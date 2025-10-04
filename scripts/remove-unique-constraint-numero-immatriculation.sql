-- Retirer la contrainte d'unicité sur numero_immatriculation
-- Cela permet à plusieurs syndics de gérer la même copropriété

-- Drop la contrainte unique sur numero_immatriculation
ALTER TABLE condos
DROP CONSTRAINT IF EXISTS condos_numero_immatriculation_key;

-- Vérification: Afficher les contraintes restantes sur la table condos
SELECT
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'condos'::regclass;
