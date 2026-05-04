-- ============================================================
-- 004 — health_conditions table
-- ============================================================

CREATE TABLE IF NOT EXISTS health_conditions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at            TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

  slug                  TEXT UNIQUE NOT NULL,
  name                  TEXT NOT NULL,
  severity              condition_severity NOT NULL,

  description           TEXT,
  symptoms              TEXT[] DEFAULT '{}',
  when_to_see_vet       TEXT,
  home_remedies         TEXT,
  prevention_tips       TEXT[] DEFAULT '{}',

  -- breed names that are more susceptible (optional)
  affected_breeds       TEXT[] DEFAULT '{}',
  vaccinations_needed   TEXT[] DEFAULT '{}',

  is_published          BOOLEAN DEFAULT false NOT NULL
);

-- Indexes
CREATE INDEX idx_health_conditions_slug      ON health_conditions (slug);
CREATE INDEX idx_health_conditions_published ON health_conditions (is_published);
CREATE INDEX idx_health_conditions_severity  ON health_conditions (severity);

-- updated_at trigger
CREATE TRIGGER trg_health_conditions_updated_at
  BEFORE UPDATE ON health_conditions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE health_conditions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "health_conditions_public_read" ON health_conditions
  FOR SELECT USING (is_published = true);

CREATE POLICY "health_conditions_service_all" ON health_conditions
  FOR ALL USING (current_setting('role') = 'service_role');
