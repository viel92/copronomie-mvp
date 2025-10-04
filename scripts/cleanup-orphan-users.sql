-- Find orphaned auth users (users without syndic or company entries)
SELECT
  u.id,
  u.email,
  u.raw_user_meta_data->>'role' as role
FROM auth.users u
LEFT JOIN syndics s ON u.id = s.user_id
LEFT JOIN companies c ON u.id = c.user_id
WHERE s.user_id IS NULL AND c.user_id IS NULL;

-- Delete orphaned auth users
-- Uncomment the lines below to actually delete them
-- DELETE FROM auth.users
-- WHERE id IN (
--   SELECT u.id
--   FROM auth.users u
--   LEFT JOIN syndics s ON u.id = s.user_id
--   LEFT JOIN companies c ON u.id = c.user_id
--   WHERE s.user_id IS NULL AND c.user_id IS NULL
-- );
