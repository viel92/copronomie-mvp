import pandas as pd
import numpy as np
from supabase import create_client, Client
from datetime import datetime
import re
import os
from dotenv import load_dotenv
from tqdm import tqdm
import logging
import sys
import json
from pathlib import Path

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('import_coproprietes.log', encoding='utf-8'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class CoproprietesImporterImproved:
    """Importeur optimisé avec reprise et gestion améliorée des erreurs"""

    def __init__(self):
        load_dotenv()
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_KEY')
        self.csv_path = os.getenv('CSV_PATH', 'rnc-data-gouv-with-qpv.csv')
        self.checkpoint_file = 'import_checkpoint.json'

        if not self.supabase_url or not self.supabase_key:
            raise ValueError("SUPABASE_URL et SUPABASE_KEY doivent être définis dans .env")

        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        self.df = None
        self.errors = []
        self.checkpoint = self.load_checkpoint()

    def load_checkpoint(self):
        """Charge le checkpoint de la dernière session"""
        if os.path.exists(self.checkpoint_file):
            try:
                with open(self.checkpoint_file, 'r') as f:
                    checkpoint = json.load(f)
                    logger.info(f"Checkpoint trouvé: {checkpoint['rows_processed']} lignes déjà traitées")
                    return checkpoint
            except Exception as e:
                logger.warning(f"Erreur lecture checkpoint: {e}")
        return {'rows_processed': 0, 'last_batch': 0}

    def save_checkpoint(self, rows_processed, batch_num):
        """Sauvegarde la progression"""
        checkpoint = {
            'rows_processed': rows_processed,
            'last_batch': batch_num,
            'timestamp': datetime.now().isoformat()
        }
        with open(self.checkpoint_file, 'w') as f:
            json.dump(checkpoint, f)

    def fix_encoding(self, text):
        """Corrige les problèmes d'encodage UTF-8"""
        if pd.isna(text) or text is None:
            return None

        text = str(text)

        replacements = {
            'Ã©': 'é', 'Ã¨': 'è', 'Ãª': 'ê', 'Ã«': 'ë',
            'Ã ': 'à', 'Ã¢': 'â', 'Ã¤': 'ä',
            'Ã´': 'ô', 'Ã¶': 'ö',
            'Ã®': 'î', 'Ã¯': 'ï',
            'Ã¹': 'ù', 'Ã»': 'û', 'Ã¼': 'ü',
            'Ã§': 'ç',
            'Å"': 'œ', 'Ã†': 'Æ',
            'â€™': "'", 'â€œ': '"', 'â€': '"',
            'â€"': '–', 'â€"': '—',
            'â€¦': '...',
            'Â°': '°', 'Â²': '²', 'Â³': '³',
            'â‚¬': '€',
            'Ãƒâ€°': 'É', 'ÃƒÂ ': 'à',
            'nÂ°': 'n°', 'NÂ°': 'N°',
            'dâ€™': "d'", 'lâ€™': "l'"
        }

        for old, new in replacements.items():
            text = text.replace(old, new)

        text = ' '.join(text.split())
        return text if text else None

    def load_csv(self):
        """Charge le CSV avec détection automatique de l'encodage"""
        logger.info(f"Chargement du fichier: {self.csv_path}")

        encodings = ['utf-8', 'iso-8859-1', 'cp1252', 'latin-1']

        for encoding in encodings:
            try:
                self.df = pd.read_csv(
                    self.csv_path,
                    encoding=encoding,
                    sep=',',
                    low_memory=False,
                    na_values=['', 'NA', 'N/A', 'null', 'NULL', 'None']
                )
                logger.info(f"CSV chargé avec l'encodage {encoding}")
                logger.info(f"{len(self.df)} lignes, {len(self.df.columns)} colonnes")
                break
            except UnicodeDecodeError:
                continue
            except Exception as e:
                logger.error(f"Erreur avec {encoding}: {e}")

        if self.df is None:
            raise ValueError("Impossible de charger le CSV")

        # Nettoyer les noms de colonnes
        self.df.columns = [self.fix_encoding(col.strip().replace('\n', ' ').replace('  ', ' ')) for col in self.df.columns]

        return self

    def clean_data(self):
        """Nettoie et prépare les données pour Supabase"""
        logger.info("Nettoyage des données en cours...")

        # Mapping des colonnes
        column_mapping = {
            'EPCI': 'epci',
            'Commune': 'commune',
            "Numéro d'immatriculation": 'numero_immatriculation',
            "Date d'immatriculation": 'date_immatriculation',
            'Date de la dernière MAJ': 'date_derniere_maj',
            'Type de syndic : bénévole / professionnel / non connu': 'type_syndic',
            'Identification du représentant légal  (raison sociale et le numéro SIRET du syndic professionnel ou Civilité/prénom/ nom du syndic bénévole ou coopératif)': 'identification_representant_legal',
            'SIRET du représentant légal': 'siret_representant_legal',
            'Code APE': 'code_ape',
            'Commune du représentant légal': 'commune_representant_legal',
            'Mandat en cours dans la copropriété': 'mandat_en_cours',
            'Date de fin du dernier mandat': 'date_fin_dernier_mandat',
            "Nom d'usage de la copropriété": 'nom_usage_copropriete',
            'Adresse de référence': 'adresse_reference',
            'Numéro et Voie (adresse de référence)': 'numero_et_voie',
            'Code postal (adresse de référence)': 'code_postal_reference',
            'Commune (adresse de référence)': 'commune_reference',
            'Adresse complémentaire 1': 'adresse_complementaire_1',
            'Adresse complémentaire 2': 'adresse_complementaire_2',
            'Adresse complémentaire 3': 'adresse_complementaire_3',
            "Nombre d'adresses complémentaires": 'nombre_adresses_complementaires',
            'long': 'longitude',
            'lat': 'latitude',
            'Date du règlement de copropriété': 'date_reglement_copropriete',
            'Résidence service': 'residence_service',
            'Syndicat coopératif': 'syndicat_cooperatif',
            'Syndicat principal ou syndicat secondaire': 'syndicat_principal_ou_secondaire',
            "Si secondaire, n° d'immatriculation du principal": 'numero_immatriculation_principal',
            "Si secondaire n° d'immatriculation du principal": 'numero_immatriculation_principal',
            "Nombre d'ASL auxquelles est rattaché le syndicat de copropriétaires": 'nombre_asl',
            "Nombre d'AFUL auxquelles est rattaché le syndicat de copropriétaires": 'nombre_aful',
            "Nombre d'Unions de syndicats auxquelles est rattaché le syndicat de copropriétaires": 'nombre_unions_syndicats',
            'Nombre total de lots': 'nombre_total_lots',
            "Nombre total de lots à usage d'habitation, de bureaux ou de commerces": 'nombre_lots_habitation_bureaux_commerces',
            "Nombre total de lots à usage d'habitation de bureaux ou de commerces": 'nombre_lots_habitation_bureaux_commerces',
            "Nombre de lots à usage d'habitation": 'nombre_lots_habitation',
            'Nombre de lots de stationnement': 'nombre_lots_stationnement',
            'Période de construction': 'periode_construction',
            'Référence Cadastrale 1': 'reference_cadastrale_1',
            'Code INSEE commune 1': 'code_insee_commune_1',
            'Préfixe 1': 'prefixe_1',
            'Section 1': 'section_1',
            'Numéro parcelle 1': 'numero_parcelle_1',
            'Référence Cadastrale 2': 'reference_cadastrale_2',
            'Code INSEE commune 2': 'code_insee_commune_2',
            'Préfixe 2': 'prefixe_2',
            'Section 2': 'section_2',
            'Numéro parcelle 2': 'numero_parcelle_2',
            'Référence Cadastrale 3': 'reference_cadastrale_3',
            'Code INSEE commune 3': 'code_insee_commune_3',
            'Préfixe 3': 'prefixe_3',
            'Section 3': 'section_3',
            'Numéro parcelle 3': 'numero_parcelle_3',
            'Nombre de parcelles cadastrales': 'nombre_parcelles_cadastrales',
            'nom_qp_2015': 'nom_qp_2015',
            'code_qp_2015': 'code_qp_2015',
            'nom_qp_2024': 'nom_qp_2024',
            'code_qp_2024': 'code_qp_2024',
            'Copro dans ACV': 'copro_dans_acv',
            'Copro dans PVD': 'copro_dans_pvd',
            'Code de PDP': 'code_pdp',
            'Copro dans PDP': 'copro_dans_pdp',
            'Copro aidée': 'copro_aidee',
            'Code Officiel Commune': 'code_officiel_commune',
            'Nom Officiel Commune': 'nom_officiel_commune',
            'Code Officiel Arrondissement Commune': 'code_officiel_arrondissement_commune',
            'Nom Officiel Arrondissement Commune': 'nom_officiel_arrondissement_commune',
            'Code Officiel EPCI': 'code_officiel_epci',
            'Nom Officiel EPCI': 'nom_officiel_epci',
            'Code Officiel Département': 'code_officiel_departement',
            'Nom Officiel Département': 'nom_officiel_departement',
            'Code Officiel Région': 'code_officiel_region',
            'Nom Officiel Région': 'nom_officiel_region'
        }

        self.df.rename(columns=column_mapping, inplace=True)

        # Appliquer le fix d'encodage
        text_columns = self.df.select_dtypes(include=['object']).columns
        for col in text_columns:
            self.df[col] = self.df[col].apply(self.fix_encoding)

        # Dates
        date_columns = [
            'date_immatriculation', 'date_derniere_maj',
            'date_fin_dernier_mandat', 'date_reglement_copropriete'
        ]

        for col in date_columns:
            if col in self.df.columns:
                self.df[col] = pd.to_datetime(self.df[col], errors='coerce', format='%Y-%m-%d')
                self.df[col] = self.df[col].dt.strftime('%Y-%m-%d').where(pd.notnull(self.df[col]), None)

        # Numériques
        numeric_columns = [
            'nombre_adresses_complementaires', 'longitude', 'latitude',
            'nombre_asl', 'nombre_aful', 'nombre_unions_syndicats',
            'nombre_total_lots', 'nombre_lots_habitation_bureaux_commerces',
            'nombre_lots_habitation', 'nombre_lots_stationnement',
            'nombre_parcelles_cadastrales'
        ]

        for col in numeric_columns:
            if col in self.df.columns:
                self.df[col] = pd.to_numeric(self.df[col], errors='coerce')

        # Booléens
        boolean_columns = [
            'residence_service', 'syndicat_cooperatif', 'copro_dans_acv',
            'copro_dans_pvd', 'copro_dans_pdp', 'copro_aidee'
        ]

        for col in boolean_columns:
            if col in self.df.columns:
                self.df[col] = self.df[col].map({
                    'oui': True, 'Oui': True, 'OUI': True,
                    'non': False, 'Non': False, 'NON': False,
                    'Non connu': None, 'non connu': None
                })

        # Valeurs par défaut pour entiers
        integer_default_columns = {
            'nombre_adresses_complementaires': 0,
            'nombre_asl': 0,
            'nombre_aful': 0,
            'nombre_unions_syndicats': 0,
            'nombre_total_lots': 0,
            'nombre_lots_habitation_bureaux_commerces': 0,
            'nombre_lots_habitation': 0,
            'nombre_lots_stationnement': 0,
            'nombre_parcelles_cadastrales': 0
        }

        for col, default_val in integer_default_columns.items():
            if col in self.df.columns:
                self.df[col] = self.df[col].fillna(default_val).astype(int)

        # FIX CRITIQUE: Remplacer NaN, inf, -inf par None
        self.df = self.df.replace({np.nan: None, np.inf: None, -np.inf: None})

        # Supprimer doublons
        if 'numero_immatriculation' in self.df.columns:
            before = len(self.df)
            self.df = self.df.drop_duplicates(subset=['numero_immatriculation'], keep='last')
            after = len(self.df)
            logger.info(f"{before - after} doublons supprimés")

        logger.info(f"Données nettoyées: {len(self.df)} lignes prêtes")
        return self

    def validate_data(self):
        """Valide les données"""
        logger.info("Validation des données...")

        required_columns = ['numero_immatriculation']
        missing_columns = [col for col in required_columns if col not in self.df.columns]

        if missing_columns:
            raise ValueError(f"Colonnes manquantes: {missing_columns}")

        logger.info(f"Lignes totales: {len(self.df)}")
        logger.info(f"Numéros uniques: {self.df['numero_immatriculation'].nunique()}")

        return self

    def import_to_supabase(self, batch_size=1000):
        """Import optimisé avec reprise"""
        logger.info(f"Import vers Supabase (batch de {batch_size})...")

        expected_columns = [
            'epci', 'commune', 'numero_immatriculation', 'date_immatriculation',
            'date_derniere_maj', 'type_syndic', 'identification_representant_legal',
            'siret_representant_legal', 'code_ape', 'commune_representant_legal',
            'mandat_en_cours', 'date_fin_dernier_mandat', 'nom_usage_copropriete',
            'adresse_reference', 'numero_et_voie', 'code_postal_reference',
            'commune_reference', 'adresse_complementaire_1', 'adresse_complementaire_2',
            'adresse_complementaire_3', 'nombre_adresses_complementaires',
            'longitude', 'latitude', 'date_reglement_copropriete',
            'residence_service', 'syndicat_cooperatif', 'syndicat_principal_ou_secondaire',
            'numero_immatriculation_principal', 'nombre_asl', 'nombre_aful',
            'nombre_unions_syndicats', 'nombre_total_lots',
            'nombre_lots_habitation_bureaux_commerces', 'nombre_lots_habitation',
            'nombre_lots_stationnement', 'periode_construction',
            'reference_cadastrale_1', 'code_insee_commune_1', 'prefixe_1',
            'section_1', 'numero_parcelle_1', 'reference_cadastrale_2',
            'code_insee_commune_2', 'prefixe_2', 'section_2', 'numero_parcelle_2',
            'reference_cadastrale_3', 'code_insee_commune_3', 'prefixe_3',
            'section_3', 'numero_parcelle_3', 'nombre_parcelles_cadastrales',
            'nom_qp_2015', 'code_qp_2015', 'nom_qp_2024', 'code_qp_2024',
            'copro_dans_acv', 'copro_dans_pvd', 'code_pdp', 'copro_dans_pdp',
            'copro_aidee', 'code_officiel_commune', 'nom_officiel_commune',
            'code_officiel_arrondissement_commune', 'nom_officiel_arrondissement_commune',
            'code_officiel_epci', 'nom_officiel_epci', 'code_officiel_departement',
            'nom_officiel_departement', 'code_officiel_region', 'nom_officiel_region'
        ]

        df_to_import = self.df[[col for col in expected_columns if col in self.df.columns]]

        total_rows = len(df_to_import)
        start_index = self.checkpoint['rows_processed']
        success_count = start_index
        error_count = 0

        logger.info(f"Reprise à partir de la ligne {start_index}")

        with tqdm(total=total_rows, initial=start_index, desc="Import") as pbar:
            for i in range(start_index, total_rows, batch_size):
                batch_num = i // batch_size
                batch = df_to_import.iloc[i:i+batch_size].to_dict('records')

                try:
                    response = self.supabase.table('coproprietes_registry').upsert(
                        batch,
                        on_conflict='numero_immatriculation'
                    ).execute()

                    success_count += len(batch)
                    pbar.update(len(batch))

                    # Checkpoint tous les 10 batches
                    if batch_num % 10 == 0:
                        self.save_checkpoint(success_count, batch_num)

                except Exception as e:
                    error_count += len(batch)
                    logger.error(f"Erreur batch {batch_num}: {str(e)}")

                    # Essai ligne par ligne
                    for row in batch:
                        try:
                            self.supabase.table('coproprietes_registry').upsert(
                                row,
                                on_conflict='numero_immatriculation'
                            ).execute()
                            success_count += 1
                            error_count -= 1
                        except Exception as row_error:
                            self.errors.append({
                                'numero_immatriculation': row.get('numero_immatriculation'),
                                'error': str(row_error)
                            })

                    pbar.update(len(batch))

        # Rapport final
        logger.info(f"""
╔════════════════════════════════════════╗
║       RAPPORT D'IMPORT FINAL          ║
╠════════════════════════════════════════╣
║ Lignes importées:  {success_count:>18} ║
║ Erreurs:           {error_count:>18} ║
║ Total traité:      {total_rows:>18} ║
║ Taux de réussite:  {(success_count/total_rows*100):>15.1f}% ║
╚════════════════════════════════════════╝
        """)

        # Sauvegarder erreurs
        if self.errors:
            error_df = pd.DataFrame(self.errors)
            error_file = f'errors_import_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
            error_df.to_csv(error_file, index=False)
            logger.warning(f"Erreurs sauvegardées: {error_file}")

        # Nettoyer checkpoint si succès
        if error_count == 0:
            if os.path.exists(self.checkpoint_file):
                os.remove(self.checkpoint_file)
            logger.info("Import terminé avec succès! Checkpoint supprimé.")

        return self

    def run(self):
        """Lance le processus complet"""
        try:
            logger.info("=== Démarrage de l'import des copropriétés ===")

            self.load_csv() \
                .clean_data() \
                .validate_data() \
                .import_to_supabase()

            logger.info("=== Import terminé avec succès! ===")

        except Exception as e:
            logger.error(f"Erreur fatale: {str(e)}")
            logger.info(f"Progression sauvegardée. Relancez le script pour reprendre.")
            raise

if __name__ == "__main__":
    print("""
╔══════════════════════════════════════════════╗
║   IMPORT COPROPRIÉTÉS VERS SUPABASE         ║
║           VERSION AMÉLIORÉE                  ║
╠══════════════════════════════════════════════╣
║ ✅ Reprise automatique après interruption   ║
║ ✅ Gestion NaN/inf corrigée                 ║
║ ✅ Batch size optimisé (1000)               ║
║ ✅ Checkpoints tous les 10 batches          ║
╚══════════════════════════════════════════════╝
    """)

    if not os.path.exists('.env'):
        print("""
⚠️  ATTENTION: Fichier .env non trouvé!

Créez un fichier .env avec:
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_KEY=votre-service-role-key
CSV_PATH=rnc-data-gouv-with-qpv.csv
        """)
        sys.exit(1)

    try:
        importer = CoproprietesImporterImproved()
        importer.run()

        print("""
✅ Import terminé avec succès!
Vérifiez votre table 'coproprietes_registry' dans Supabase.
        """)

    except KeyboardInterrupt:
        print("\n⚠️  Import interrompu. Progression sauvegardée.")
        print("Relancez le script pour reprendre où vous vous êtes arrêté.")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Erreur: {e}")
        sys.exit(1)