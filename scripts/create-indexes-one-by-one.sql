-- ==================================================================
-- CREATION D'INDEX UN PAR UN
-- Executez ces commandes UNE PAR UNE dans Supabase SQL Editor
-- Attendez que chaque index soit cree avant de passer au suivant
-- ==================================================================

-- ==================== ETAPE 1 : INDEX SIRET (LE PLUS IMPORTANT) ====================
-- Selectionnez UNIQUEMENT ces 3 lignes et executez-les
CREATE INDEX IF NOT EXISTS idx_siret_representant_legal
ON coproprietes_registry(siret_representant_legal);


-- Verifiez que l'index est cree (devrait afficher 1 ligne)
SELECT COUNT(*) as index_exists
FROM pg_indexes
WHERE tablename = 'coproprietes_registry'
  AND indexname = 'idx_siret_representant_legal';

-- ==================== ETAPE 2 : INDEX NUMERO IMMATRICULATION ====================
-- Attendez que l'etape 1 soit terminee, puis executez ces lignes
CREATE UNIQUE INDEX IF NOT EXISTS idx_numero_immatriculation_unique
ON coproprietes_registry(numero_immatriculation);

-- Verifiez
SELECT COUNT(*) as index_exists
FROM pg_indexes
WHERE tablename = 'coproprietes_registry'
  AND indexname = 'idx_numero_immatriculation_unique';

-- ==================== ETAPE 3 : INDEX COMMUNE ====================
CREATE INDEX IF NOT EXISTS idx_commune_reference
ON coproprietes_registry(commune_reference);

-- Verifiez
SELECT COUNT(*) as index_exists
FROM pg_indexes
WHERE tablename = 'coproprietes_registry'
  AND indexname = 'idx_commune_reference';

-- ==================== ETAPE 4 : INDEX CODE POSTAL ====================
CREATE INDEX IF NOT EXISTS idx_code_postal_reference
ON coproprietes_registry(code_postal_reference);

-- Verifiez
SELECT COUNT(*) as index_exists
FROM pg_indexes
WHERE tablename = 'coproprietes_registry'
  AND indexname = 'idx_code_postal_reference';

-- ==================== VERIFICATION FINALE ====================
-- Executez ceci a la fin pour voir tous les index crees
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'coproprietes_registry'
  AND indexname LIKE 'idx_%'
ORDER BY indexname;