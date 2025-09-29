-- ==================================================================
-- INDEX SIRET - Version SIMPLE (sans CONCURRENTLY)
-- A executer dans Supabase SQL Editor
-- ==================================================================

-- Creer l'index sur SIRET (resout le probleme de timeout)
-- IMPORTANT : Cet index va prendre 30-60 secondes a creer
-- La table sera VERROUILLEE pendant la creation
CREATE INDEX IF NOT EXISTS idx_siret_representant_legal
ON coproprietes_registry(siret_representant_legal);

-- Verifier que l'index est cree
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'coproprietes_registry'
  AND indexname = 'idx_siret_representant_legal';