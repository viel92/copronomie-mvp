# 🚀 Import des Copropriétés RNC vers Supabase

## 📋 Version Améliorée

### ✨ Nouvelles fonctionnalités

- ✅ **Fix NaN/inf** : Correction du bug "Out of range float values"
- ✅ **Reprise automatique** : Si le script s'arrête, il reprend où il s'était arrêté
- ✅ **Batch optimisé** : 1000 lignes par batch (vs 500) = 2x plus rapide
- ✅ **Checkpoints** : Sauvegarde automatique tous les 10 batches
- ✅ **Rapport détaillé** : Statistiques complètes en fin d'import
- ✅ **Gestion doublons** : UPSERT automatique sur `numero_immatriculation`

## 📦 Installation

```bash
# Installer les dépendances Python
pip install pandas numpy supabase python-dotenv tqdm
```

## ⚙️ Configuration

Créez un fichier `.env` dans le dossier `scripts/` :

```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_KEY=votre-service-role-key
CSV_PATH=../rnc-data-gouv-with-qpv.csv
```

⚠️ **Important** : Utilisez la clé **service_role** (pas la clé anon) pour bypasser les RLS.

## 🚀 Utilisation

### Import complet

```bash
cd scripts
python import-coproprietes-improved.py
```

### En cas d'interruption

Le script sauvegarde automatiquement sa progression dans `import_checkpoint.json`.

Pour reprendre :
```bash
# Simplement relancer le script
python import-coproprietes-improved.py
```

Il reprendra automatiquement là où il s'était arrêté.

### Forcer un nouveau départ

```bash
# Supprimer le checkpoint
rm import_checkpoint.json
python import-coproprietes-improved.py
```

## 📊 Durée estimée

- **615 000 lignes** × **40ms/ligne** ÷ **1000 batch** = **~25 min**
- Avec doublons et retry : **~45 min à 1h30**

## 🔍 Suivi en temps réel

Le script affiche :
- Progress bar avec tqdm
- Logs dans `import_coproprietes.log`
- Rapport final avec statistiques

## ❌ Gestion des erreurs

Si des lignes échouent :
1. Le script essaie ligne par ligne
2. Les erreurs sont sauvegardées dans `errors_import_YYYYMMDD_HHMMSS.csv`
3. Vous pouvez analyser les erreurs et relancer uniquement ces lignes

## 📈 Rapport final

```
╔════════════════════════════════════════╗
║       RAPPORT D'IMPORT FINAL          ║
╠════════════════════════════════════════╣
║ Lignes importées:            615 000 ║
║ Erreurs:                           45 ║
║ Total traité:                 615 045 ║
║ Taux de réussite:                99.9% ║
╚════════════════════════════════════════╝
```

## 🆚 Différences avec l'ancien script

| Fonctionnalité | Ancien | Nouveau |
|----------------|--------|---------|
| Fix NaN/inf | ❌ | ✅ |
| Batch size | 500 | 1000 |
| Reprise auto | ❌ | ✅ |
| Checkpoint | ❌ | ✅ (tous les 10k) |
| Rapport final | Basique | Détaillé |
| Gestion Ctrl+C | ❌ | ✅ |

## 🐛 Troubleshooting

### Erreur "Out of range float values"
✅ Corrigé dans la nouvelle version (ligne 238)

### Script trop lent
- Augmentez `batch_size` à 2000 (ligne 332)
- Vérifiez votre connexion internet

### Trop de doublons
- Normal si vous relancez l'import
- UPSERT gère automatiquement

### Script interrompu
- Vérifiez `import_checkpoint.json`
- Relancez simplement le script

## 📞 Support

Consultez les logs dans `import_coproprietes.log` pour plus de détails.