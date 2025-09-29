-- ==================================================================
-- AJOUT DES COLONNES MANQUANTES A LA TABLE CONDOS (VERSION SIMPLE)
-- Pour stocker toutes les informations du registre national
-- ==================================================================

-- Ajouter uniquement les colonnes qui n'existent pas encore
ALTER TABLE public.condos
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS postal_code TEXT,
  ADD COLUMN IF NOT EXISTS numero_immatriculation TEXT,
  ADD COLUMN IF NOT EXISTS periode_construction TEXT,
  ADD COLUMN IF NOT EXISTS type_syndic TEXT,
  ADD COLUMN IF NOT EXISTS date_immatriculation DATE,
  ADD COLUMN IF NOT EXISTS nombre_lots_habitation INTEGER,
  ADD COLUMN IF NOT EXISTS nombre_lots_stationnement INTEGER;

-- Ajouter contrainte UNIQUE sur numero_immatriculation (si pas déjà existante)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'condos_numero_immatriculation_key'
  ) THEN
    ALTER TABLE public.condos ADD CONSTRAINT condos_numero_immatriculation_key UNIQUE (numero_immatriculation);
  END IF;
END $$;

-- Créer des index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_condos_numero_immatriculation
ON public.condos(numero_immatriculation);

CREATE INDEX IF NOT EXISTS idx_condos_city
ON public.condos(city);

CREATE INDEX IF NOT EXISTS idx_condos_postal_code
ON public.condos(postal_code);

-- Vérifier les colonnes de la table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'condos'
  AND table_schema = 'public'
ORDER BY ordinal_position;