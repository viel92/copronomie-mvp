-- ==================================================================
-- INDEXES POUR LA TABLE coproprietes_registry
-- Creation de tous les index necessaires pour des recherches rapides
-- ==================================================================

-- 1. Index sur SIRET (CRITIQUE - recherche principale)
CREATE INDEX IF NOT EXISTS idx_siret_representant_legal
ON coproprietes_registry(siret_representant_legal);

-- 2. Index sur numero_immatriculation (UNIQUE - cle metier)
CREATE UNIQUE INDEX IF NOT EXISTS idx_numero_immatriculation_unique
ON coproprietes_registry(numero_immatriculation);

-- 3. Index sur commune_reference (recherche par ville)
CREATE INDEX IF NOT EXISTS idx_commune_reference
ON coproprietes_registry(commune_reference);

-- 4. Index sur commune (fallback pour les anciennes donnees)
CREATE INDEX IF NOT EXISTS idx_commune
ON coproprietes_registry(commune);

-- 5. Index sur code_postal_reference (recherche par code postal)
CREATE INDEX IF NOT EXISTS idx_code_postal_reference
ON coproprietes_registry(code_postal_reference);

-- 6. Index sur nombre_total_lots (filtre par taille)
CREATE INDEX IF NOT EXISTS idx_nombre_total_lots
ON coproprietes_registry(nombre_total_lots);

-- 7. Index sur type_syndic (filtre par type de gestion)
CREATE INDEX IF NOT EXISTS idx_type_syndic
ON coproprietes_registry(type_syndic);

-- 8. Index sur periode_construction (filtre par anciennete)
CREATE INDEX IF NOT EXISTS idx_periode_construction
ON coproprietes_registry(periode_construction);

-- ==================================================================
-- INDEX COMPOSITES (pour les recherches combinees)
-- ==================================================================

-- 9. SIRET + Commune (recherche par syndic dans une ville)
CREATE INDEX IF NOT EXISTS idx_siret_commune
ON coproprietes_registry(siret_representant_legal, commune_reference);

-- 10. SIRET + Code postal (recherche par syndic dans un CP)
CREATE INDEX IF NOT EXISTS idx_siret_codepostal
ON coproprietes_registry(siret_representant_legal, code_postal_reference);

-- 11. SIRET + Nombre de lots (recherche par syndic avec filtre taille)
CREATE INDEX IF NOT EXISTS idx_siret_lots
ON coproprietes_registry(siret_representant_legal, nombre_total_lots);

-- 12. Commune + Code postal (recherche geographique)
CREATE INDEX IF NOT EXISTS idx_commune_codepostal
ON coproprietes_registry(commune_reference, code_postal_reference);

-- ==================================================================
-- INDEX POUR LA RECHERCHE FULL-TEXT (optionnel mais recommande)
-- ==================================================================

-- 13. Index GIN pour recherche textuelle sur adresse
CREATE INDEX IF NOT EXISTS idx_gin_adresse
ON coproprietes_registry USING gin(to_tsvector('french',
  COALESCE(numero_et_voie, '') || ' ' ||
  COALESCE(adresse_reference, '') || ' ' ||
  COALESCE(nom_usage_copropriete, '')
));

-- 14. Index GIN pour recherche textuelle sur commune
CREATE INDEX IF NOT EXISTS idx_gin_commune
ON coproprietes_registry USING gin(to_tsvector('french',
  COALESCE(commune, '') || ' ' ||
  COALESCE(commune_reference, '')
));

-- ==================================================================
-- STATISTIQUES ET VERIFICATION
-- ==================================================================

-- Afficher tous les index crees
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'coproprietes_registry'
ORDER BY indexname;

-- Analyser la table pour mettre a jour les statistiques
ANALYZE coproprietes_registry;