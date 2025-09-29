-- ==================================================================
-- INDEX SIRET UNIQUEMENT (le plus critique)
-- Executez ce script EN PREMIER pour resoudre le probleme de timeout
-- ==================================================================

-- CONCURRENTLY permet de creer l'index sans bloquer la table
-- mais prend plus de temps (30-60 secondes pour 615k lignes)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_siret_representant_legal
ON coproprietes_registry(siret_representant_legal);

-- Verifier que l'index est cree
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'coproprietes_registry'
  AND indexname = 'idx_siret_representant_legal';