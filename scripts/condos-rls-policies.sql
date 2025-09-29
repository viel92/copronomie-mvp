-- ==================================================================
-- POLICIES RLS POUR LA TABLE CONDOS
-- Permettre aux syndics de gérer leurs propres copropriétés
-- ==================================================================

-- Activer RLS sur la table condos (si pas déjà activé)
ALTER TABLE public.condos ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Syndics can view their own condos" ON public.condos;
DROP POLICY IF EXISTS "Syndics can insert their own condos" ON public.condos;
DROP POLICY IF EXISTS "Syndics can update their own condos" ON public.condos;
DROP POLICY IF EXISTS "Syndics can delete their own condos" ON public.condos;

-- Policy SELECT: Les syndics peuvent voir leurs propres copropriétés
CREATE POLICY "Syndics can view their own condos"
ON public.condos
FOR SELECT
USING (
  auth.uid() = syndic_id
);

-- Policy INSERT: Les syndics peuvent créer des copropriétés pour eux-mêmes
CREATE POLICY "Syndics can insert their own condos"
ON public.condos
FOR INSERT
WITH CHECK (
  auth.uid() = syndic_id
);

-- Policy UPDATE: Les syndics peuvent modifier leurs propres copropriétés
CREATE POLICY "Syndics can update their own condos"
ON public.condos
FOR UPDATE
USING (
  auth.uid() = syndic_id
)
WITH CHECK (
  auth.uid() = syndic_id
);

-- Policy DELETE: Les syndics peuvent supprimer leurs propres copropriétés
CREATE POLICY "Syndics can delete their own condos"
ON public.condos
FOR DELETE
USING (
  auth.uid() = syndic_id
);

-- Vérifier les policies créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'condos';