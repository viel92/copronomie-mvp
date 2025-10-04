-- Politiques RLS pour la table projects

-- 1. Activer RLS sur la table projects (si pas déjà fait)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 2. Politique SELECT : Les syndics peuvent voir leurs propres projets
CREATE POLICY "Syndics can view their own projects"
ON projects
FOR SELECT
USING (syndic_id = auth.uid());

-- 3. Politique INSERT : Les syndics peuvent créer des projets pour eux-mêmes
CREATE POLICY "Syndics can create their own projects"
ON projects
FOR INSERT
WITH CHECK (syndic_id = auth.uid());

-- 4. Politique UPDATE : Les syndics peuvent mettre à jour leurs propres projets
CREATE POLICY "Syndics can update their own projects"
ON projects
FOR UPDATE
USING (syndic_id = auth.uid())
WITH CHECK (syndic_id = auth.uid());

-- 5. Politique DELETE : Les syndics peuvent supprimer leurs propres projets
CREATE POLICY "Syndics can delete their own projects"
ON projects
FOR DELETE
USING (syndic_id = auth.uid());

-- 6. Politique SELECT pour les entreprises : Voir les projets publiés
CREATE POLICY "Companies can view published projects"
ON projects
FOR SELECT
USING (status IN ('published', 'analyzing', 'awarded'));

-- Vérification: Afficher toutes les politiques sur la table projects
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'projects';
