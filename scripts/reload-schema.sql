-- Force Supabase PostgREST to reload schema cache
-- Run this in Supabase SQL Editor

NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- Also verify the actual table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'syndics'
ORDER BY ordinal_position;
