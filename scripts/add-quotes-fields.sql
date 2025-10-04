-- Add description, delay_days, and pdf_url columns to quotes table

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS delay_days INTEGER;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- Verification
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'quotes'
AND column_name IN ('description', 'delay_days', 'pdf_url');
