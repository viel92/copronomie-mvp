-- Check the structure of companies and syndics tables
-- to confirm which columns exist and their constraints

SELECT
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name IN ('companies', 'syndics')
ORDER BY table_name, ordinal_position;
