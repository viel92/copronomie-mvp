-- ==================================================================
-- CREATION DE TOUS LES INDEX ESSENTIELS
-- Executez ce script dans Supabase SQL Editor
-- Temps estime : 2-3 minutes pour 615k lignes
-- ==================================================================

-- 1. Index SIRET (deja cree normalement, mais IF NOT EXISTS evite l'erreur)
CREATE INDEX IF NOT EXISTS idx_siret_representant_legal
ON coproprietes_registry(siret_representant_legal);

-- 2. Index UNIQUE sur numero_immatriculation
CREATE UNIQUE INDEX IF NOT EXISTS idx_numero_immatriculation_unique
ON coproprietes_registry(numero_immatriculation);

-- 3. Index sur commune_reference (filtre par ville)
CREATE INDEX IF NOT EXISTS idx_commune_reference
ON coproprietes_registry(commune_reference);

-- 4. Index sur commune (fallback)
CREATE INDEX IF NOT EXISTS idx_commune
ON coproprietes_registry(commune);

-- 5. Index sur code_postal_reference (filtre par code postal)
CREATE INDEX IF NOT EXISTS idx_code_postal_reference
ON coproprietes_registry(code_postal_reference);

-- 6. Index sur nombre_total_lots (filtre par taille)
CREATE INDEX IF NOT EXISTS idx_nombre_total_lots
ON coproprietes_registry(nombre_total_lots);

-- 7. Index sur type_syndic (filtre par type)
CREATE INDEX IF NOT EXISTS idx_type_syndic
ON coproprietes_registry(type_syndic);

-- 8. Index sur periode_construction (filtre par anciennete)
CREATE INDEX IF NOT EXISTS idx_periode_construction
ON coproprietes_registry(periode_construction);

-- 9. Index composite SIRET + Commune (recherche optimisee)
CREATE INDEX IF NOT EXISTS idx_siret_commune
ON coproprietes_registry(siret_representant_legal, commune_reference);

-- 10. Index composite SIRET + Code postal
CREATE INDEX IF NOT EXISTS idx_siret_codepostal
ON coproprietes_registry(siret_representant_legal, code_postal_reference);

-- Verification finale - affiche tous les index crees
SELECT
  indexname,
  pg_size_pretty(pg_relation_size(indexname::regclass)) as size
FROM pg_indexes
WHERE tablename = 'coproprietes_registry'
  AND indexname LIKE 'idx_%'
ORDER BY indexname;