-- Migration: Rate Limiting avec Supabase
-- Description: Table et fonctions optimisées pour rate limiting distribué
-- Date: 2025-10-28

-- Table principale pour stocker les compteurs de rate limiting
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,  -- Type de rate limit: 'auth', 'api', 'mutations', etc.
  key TEXT NOT NULL,         -- Clé unique: IP ou IP:userID
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_request_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_rate_limit UNIQUE (identifier, key)
);

-- Index pour optimiser les lookups (critiques pour performance)
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup
  ON rate_limits(identifier, key, expires_at);

CREATE INDEX IF NOT EXISTS idx_rate_limits_expires
  ON rate_limits(expires_at);

-- Index pour cleanup efficace (sans predicate WHERE car NOW() n'est pas IMMUTABLE)
CREATE INDEX IF NOT EXISTS idx_rate_limits_cleanup
  ON rate_limits(expires_at);

-- Fonction PostgreSQL pour vérifier et incrémenter le rate limit (atomique)
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier TEXT,
  p_key TEXT,
  p_max_requests INTEGER,
  p_window_seconds INTEGER
) RETURNS JSON AS $$
DECLARE
  v_record RECORD;
  v_now TIMESTAMP WITH TIME ZONE := NOW();
  v_window_start TIMESTAMP WITH TIME ZONE := v_now - (p_window_seconds || ' seconds')::INTERVAL;
  v_expires_at TIMESTAMP WITH TIME ZONE := v_now + (p_window_seconds || ' seconds')::INTERVAL;
  v_allowed BOOLEAN;
  v_remaining INTEGER;
  v_reset_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Tenter d'obtenir le record existant avec lock FOR UPDATE (évite race conditions)
  SELECT * INTO v_record
  FROM rate_limits
  WHERE identifier = p_identifier
    AND key = p_key
  FOR UPDATE;

  -- Si le record existe et est dans la fenêtre active
  IF FOUND AND v_record.window_start > v_window_start THEN
    -- Vérifier si la limite est atteinte
    IF v_record.request_count >= p_max_requests THEN
      v_allowed := FALSE;
      v_remaining := 0;
      v_reset_at := v_record.expires_at;
    ELSE
      -- Incrémenter le compteur
      UPDATE rate_limits
      SET
        request_count = request_count + 1,
        last_request_at = v_now
      WHERE identifier = p_identifier AND key = p_key;

      v_allowed := TRUE;
      v_remaining := p_max_requests - (v_record.request_count + 1);
      v_reset_at := v_record.expires_at;
    END IF;
  ELSE
    -- Créer un nouveau record ou réinitialiser
    INSERT INTO rate_limits (
      identifier,
      key,
      request_count,
      window_start,
      expires_at,
      last_request_at
    ) VALUES (
      p_identifier,
      p_key,
      1,
      v_now,
      v_expires_at,
      v_now
    )
    ON CONFLICT (identifier, key)
    DO UPDATE SET
      request_count = 1,
      window_start = v_now,
      expires_at = v_expires_at,
      last_request_at = v_now;

    v_allowed := TRUE;
    v_remaining := p_max_requests - 1;
    v_reset_at := v_expires_at;
  END IF;

  -- Retourner le résultat en JSON
  RETURN json_build_object(
    'allowed', v_allowed,
    'remaining', v_remaining,
    'reset_at', v_reset_at,
    'limit', p_max_requests
  );
END;
$$ LANGUAGE plpgsql;

-- Fonction pour nettoyer les entrées expirées (appelée périodiquement)
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM rate_limits
  WHERE expires_at < NOW() - INTERVAL '1 hour';

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour réinitialiser un rate limit spécifique (admin/debug)
CREATE OR REPLACE FUNCTION reset_rate_limit(
  p_identifier TEXT,
  p_key TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM rate_limits
  WHERE identifier = p_identifier AND key = p_key;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les stats de rate limiting
CREATE OR REPLACE FUNCTION get_rate_limit_stats()
RETURNS JSON AS $$
BEGIN
  RETURN json_build_object(
    'total_entries', (SELECT COUNT(*) FROM rate_limits),
    'active_entries', (SELECT COUNT(*) FROM rate_limits WHERE expires_at > NOW()),
    'expired_entries', (SELECT COUNT(*) FROM rate_limits WHERE expires_at <= NOW()),
    'by_identifier', (
      SELECT json_object_agg(identifier, count)
      FROM (
        SELECT identifier, COUNT(*) as count
        FROM rate_limits
        WHERE expires_at > NOW()
        GROUP BY identifier
      ) subquery
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Optionnel: Trigger pour cleanup automatique à chaque insertion (léger overhead)
-- Alternative: Utiliser pg_cron pour cleanup périodique
CREATE OR REPLACE FUNCTION trigger_cleanup_rate_limits()
RETURNS TRIGGER AS $$
BEGIN
  -- Nettoyer seulement 1% du temps pour minimiser l'impact
  IF random() < 0.01 THEN
    PERFORM cleanup_expired_rate_limits();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_cleanup_rate_limits
  AFTER INSERT ON rate_limits
  EXECUTE FUNCTION trigger_cleanup_rate_limits();

-- Commentaires pour documentation
COMMENT ON TABLE rate_limits IS 'Table de rate limiting distribué pour protéger l''API contre les abus';
COMMENT ON FUNCTION check_rate_limit IS 'Vérifie et incrémente atomiquement un compteur de rate limit';
COMMENT ON FUNCTION cleanup_expired_rate_limits IS 'Nettoie les entrées expirées (à appeler via pg_cron ou manuellement)';
COMMENT ON FUNCTION reset_rate_limit IS 'Réinitialise un rate limit spécifique (admin uniquement)';
COMMENT ON FUNCTION get_rate_limit_stats IS 'Obtient les statistiques globales de rate limiting';

-- RLS (Row Level Security) - Désactiver car géré côté serveur avec SERVICE_ROLE_KEY
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Politique: Seulement le service role peut accéder
CREATE POLICY "Service role only" ON rate_limits
  FOR ALL
  USING (auth.role() = 'service_role');

-- Grant permissions au service role
GRANT ALL ON rate_limits TO service_role;
GRANT EXECUTE ON FUNCTION check_rate_limit TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_expired_rate_limits TO service_role;
GRANT EXECUTE ON FUNCTION reset_rate_limit TO service_role;
GRANT EXECUTE ON FUNCTION get_rate_limit_stats TO service_role;
