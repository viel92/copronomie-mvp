-- ==================================================================
-- CORRECTION DE LA CONTRAINTE FOREIGN KEY SUR CONDOS
-- Option 1: Supprimer la contrainte (si syndics n'existe pas ou n'est pas utilisé)
-- Option 2: Pointer vers auth.users au lieu de syndics
-- ==================================================================

-- Vérifier si la table syndics existe
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'syndics'
) as syndics_table_exists;

-- Vérifier la contrainte actuelle
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name='condos'
  AND kcu.column_name='syndic_id';

-- SOLUTION 1: Supprimer complètement la contrainte FK
-- Décommentez cette ligne si vous voulez supprimer la contrainte
-- ALTER TABLE public.condos DROP CONSTRAINT IF EXISTS condos_syndic_id_fkey;

-- SOLUTION 2: Remplacer par une contrainte vers auth.users
-- Étape 1: Supprimer l'ancienne contrainte
ALTER TABLE public.condos DROP CONSTRAINT IF EXISTS condos_syndic_id_fkey;

-- Étape 2: Ajouter la nouvelle contrainte vers auth.users
ALTER TABLE public.condos
  ADD CONSTRAINT condos_syndic_id_fkey
  FOREIGN KEY (syndic_id)
  REFERENCES auth.users(id)
  ON DELETE SET NULL;

-- Vérifier que la contrainte a été modifiée
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name='condos'
  AND kcu.column_name='syndic_id';