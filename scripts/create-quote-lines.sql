-- Create quote_lines table for itemized quotes with multiple VAT rates
-- Each quote can have multiple lines with different VAT rates (20%, 5.5%, 10%, etc.)

CREATE TABLE IF NOT EXISTS quote_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,

  -- Line item details
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
  unit_price_ht DECIMAL(10, 2) NOT NULL,

  -- Calculated amounts
  total_ht DECIMAL(10, 2) NOT NULL, -- quantity * unit_price_ht
  vat_rate DECIMAL(5, 2) NOT NULL, -- TVA rate (20.00, 5.50, 10.00, etc.)
  total_vat DECIMAL(10, 2) NOT NULL, -- total_ht * (vat_rate / 100)
  total_ttc DECIMAL(10, 2) NOT NULL, -- total_ht + total_vat

  -- Order for display
  line_order INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quote_lines_quote_id ON quote_lines(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_lines_order ON quote_lines(quote_id, line_order);

-- RLS Policies (same as quotes table)
ALTER TABLE quote_lines ENABLE ROW LEVEL SECURITY;

-- Syndics can see lines for their project quotes
CREATE POLICY "Syndics can view quote lines for their projects"
  ON quote_lines FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quotes q
      JOIN projects p ON q.project_id = p.id
      WHERE q.id = quote_lines.quote_id
      AND p.syndic_id = auth.uid()
    )
  );

-- Companies can see their own quote lines
CREATE POLICY "Companies can view their own quote lines"
  ON quote_lines FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quotes q
      WHERE q.id = quote_lines.quote_id
      AND q.company_id = auth.uid()
    )
  );

-- Companies can insert lines for their own quotes
CREATE POLICY "Companies can insert their own quote lines"
  ON quote_lines FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quotes q
      WHERE q.id = quote_lines.quote_id
      AND q.company_id = auth.uid()
    )
  );

-- Companies can update lines for their draft quotes
CREATE POLICY "Companies can update their draft quote lines"
  ON quote_lines FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM quotes q
      WHERE q.id = quote_lines.quote_id
      AND q.company_id = auth.uid()
      AND q.status = 'draft'
    )
  );

-- Companies can delete lines from their draft quotes
CREATE POLICY "Companies can delete their draft quote lines"
  ON quote_lines FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM quotes q
      WHERE q.id = quote_lines.quote_id
      AND q.company_id = auth.uid()
      AND q.status = 'draft'
    )
  );

-- Function to update quote totals when lines change
CREATE OR REPLACE FUNCTION update_quote_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the parent quote with calculated totals
  UPDATE quotes
  SET
    total_amount = (
      SELECT COALESCE(SUM(total_ttc), 0)
      FROM quote_lines
      WHERE quote_id = COALESCE(NEW.quote_id, OLD.quote_id)
    ),
    total_ht = (
      SELECT COALESCE(SUM(total_ht), 0)
      FROM quote_lines
      WHERE quote_id = COALESCE(NEW.quote_id, OLD.quote_id)
    ),
    total_ttc = (
      SELECT COALESCE(SUM(total_ttc), 0)
      FROM quote_lines
      WHERE quote_id = COALESCE(NEW.quote_id, OLD.quote_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.quote_id, OLD.quote_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update quote totals
DROP TRIGGER IF EXISTS trigger_update_quote_totals ON quote_lines;
CREATE TRIGGER trigger_update_quote_totals
  AFTER INSERT OR UPDATE OR DELETE ON quote_lines
  FOR EACH ROW
  EXECUTE FUNCTION update_quote_totals();

-- Add columns to quotes table if they don't exist (from previous migration)
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS total_ht DECIMAL(10, 2);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS total_ttc DECIMAL(10, 2);

-- Verification
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'quote_lines'
ORDER BY ordinal_position;

COMMENT ON TABLE quote_lines IS 'Itemized quote lines with individual VAT rates. Multiple lines can have different VAT rates (20%, 5.5%, 10%, etc.) that are summed up in the parent quote.';
