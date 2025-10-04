-- Add VAT support to quotes table
-- The database already has 'total_amount' column
-- Adding total_ht (without VAT), total_ttc (with VAT), and tva_rate (VAT rate)

-- Add new columns for VAT handling
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS total_ht DECIMAL(10, 2);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS total_ttc DECIMAL(10, 2);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS tva_rate DECIMAL(5, 2) DEFAULT 20.00;

-- Migrate existing total_amount to total_ttc (assuming it was TTC)
UPDATE quotes
SET total_ttc = total_amount,
    total_ht = ROUND(total_amount / (1 + (tva_rate / 100)), 2)
WHERE total_amount IS NOT NULL AND total_ttc IS NULL;

-- Verification
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'quotes'
AND column_name IN ('total_amount', 'total_ht', 'total_ttc', 'tva_rate')
ORDER BY ordinal_position;
