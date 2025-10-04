-- Check for views that might reference 'name' column in syndics
SELECT
    schemaname,
    viewname,
    definition
FROM pg_views
WHERE definition ILIKE '%syndics%'
  AND definition ILIKE '%name%';

-- Check for functions that might reference 'name' column in syndics
SELECT
    n.nspname as schema,
    p.proname as function_name,
    pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE pg_get_functiondef(p.oid) ILIKE '%syndics%'
  AND pg_get_functiondef(p.oid) ILIKE '%name%';

-- Check if there's any triggers on syndics
SELECT
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'syndics';
