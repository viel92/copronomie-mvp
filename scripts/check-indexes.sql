-- Verifier tous les index sur coproprietes_registry
SELECT
  tablename,
  indexname,
  indexdef,
  pg_size_pretty(pg_relation_size(indexname::regclass)) as index_size
FROM pg_indexes
WHERE tablename = 'coproprietes_registry'
ORDER BY indexname;

-- Verifier si l'index SIRET est utilise dans la requete
EXPLAIN ANALYZE
SELECT *
FROM coproprietes_registry
WHERE siret_representant_legal = '47969676700017'
ORDER BY commune_reference;