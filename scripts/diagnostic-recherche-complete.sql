-- ==================================================================
-- DIAGNOSTIC COMPLET RECHERCHE AVEC FILTRES
-- Analyse en profondeur comme un pro
-- ==================================================================

-- ===================== 1. VERIFICATION DES DONNEES =====================
-- Verifions quelles sont les vraies donnees pour ce SIRET

SELECT
  '=== DONNEES BRUTES ===' as section,
  siret_representant_legal,
  code_postal_reference,
  commune_reference,
  COUNT(*) as nb_copros
FROM coproprietes_registry
WHERE siret_representant_legal = '47969676700017'
GROUP BY siret_representant_legal, code_postal_reference, commune_reference
ORDER BY code_postal_reference;

-- ===================== 2. TEST DES DIFFERENTS FILTRES =====================

-- Test 1: Sans filtre (devrait retourner 141 lignes)
SELECT '=== TEST 1: SANS FILTRE ===' as test, COUNT(*) as resultat
FROM coproprietes_registry
WHERE siret_representant_legal = '47969676700017';

-- Test 2: Avec code postal EXACT '9' (devrait retourner 0)
SELECT '=== TEST 2: CODE POSTAL = 9 (exact) ===' as test, COUNT(*) as resultat
FROM coproprietes_registry
WHERE siret_representant_legal = '47969676700017'
  AND code_postal_reference = '9';

-- Test 3: Avec code postal COMMENCE PAR '9' (devrait retourner les 92xxx, 93xxx, etc.)
SELECT '=== TEST 3: CODE POSTAL LIKE 9% ===' as test, COUNT(*) as resultat
FROM coproprietes_registry
WHERE siret_representant_legal = '47969676700017'
  AND code_postal_reference LIKE '9%';

-- Test 4: Avec code postal ILIKE '9%' (insensible casse)
SELECT '=== TEST 4: CODE POSTAL ILIKE 9% ===' as test, COUNT(*) as resultat
FROM coproprietes_registry
WHERE siret_representant_legal = '47969676700017'
  AND code_postal_reference ILIKE '9%';

-- Test 5: Codes postaux qui commencent par 92
SELECT '=== TEST 5: CODE POSTAL LIKE 92% ===' as test, COUNT(*) as resultat
FROM coproprietes_registry
WHERE siret_representant_legal = '47969676700017'
  AND code_postal_reference LIKE '92%';

-- ===================== 3. VERIFICATION RLS =====================

-- Verifier si RLS est active sur la table
SELECT
  '=== VERIFICATION RLS ===' as section,
  tablename,
  rowsecurity as rls_actif
FROM pg_tables
WHERE tablename = 'coproprietes_registry';

-- Lister toutes les policies RLS sur cette table
SELECT
  '=== POLICIES RLS ===' as section,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'coproprietes_registry';

-- ===================== 4. VERIFICATION PERMISSIONS =====================

-- Verifier les permissions sur la table
SELECT
  '=== PERMISSIONS ===' as section,
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'coproprietes_registry'
  AND table_schema = 'public';

-- ===================== 5. ANALYSE PERFORMANCE =====================

-- Plan d'execution avec filtre code postal
EXPLAIN ANALYZE
SELECT
  numero_immatriculation,
  nom_usage_copropriete,
  code_postal_reference,
  commune_reference
FROM coproprietes_registry
WHERE siret_representant_legal = '47969676700017'
  AND code_postal_reference ILIKE '92%'
ORDER BY commune_reference
LIMIT 500;

-- ===================== 6. VERIFICATION INDEX =====================

-- Lister tous les index sur la table
SELECT
  '=== INDEX SUR TABLE ===' as section,
  indexname,
  indexdef,
  pg_size_pretty(pg_relation_size(indexname::regclass)) as taille
FROM pg_indexes
WHERE tablename = 'coproprietes_registry'
ORDER BY indexname;

-- Verifier si l'index composite SIRET+CODE_POSTAL existe
SELECT
  '=== INDEX COMPOSITE SIRET+CP ===' as section,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'coproprietes_registry'
  AND indexname LIKE '%siret%postal%';

-- ===================== 7. STATISTIQUES TABLE =====================

-- Stats generales sur la table
SELECT
  '=== STATS GENERALES ===' as section,
  schemaname,
  relname as table_name,
  n_live_tup as nb_lignes_vivantes,
  n_dead_tup as nb_lignes_mortes,
  n_mod_since_analyze as nb_modifs_depuis_analyze,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables
WHERE relname = 'coproprietes_registry';

-- ===================== 8. TEST REQUETE EXACTE API =====================

-- Simuler exactement la requete de l'API avec les colonnes selectionnees
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT
  numero_immatriculation,
  nom_usage_copropriete,
  numero_et_voie,
  adresse_reference,
  commune,
  commune_reference,
  code_postal_reference,
  nombre_total_lots,
  nombre_lots_habitation,
  nombre_lots_stationnement,
  periode_construction,
  type_syndic,
  date_immatriculation
FROM coproprietes_registry
WHERE siret_representant_legal = '47969676700017'
  AND code_postal_reference ILIKE '92%'
ORDER BY commune_reference
LIMIT 500;