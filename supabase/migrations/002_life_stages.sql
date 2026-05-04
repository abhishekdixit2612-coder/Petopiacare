-- ============================================================
-- 002 — life_stages table
-- ============================================================

CREATE TABLE IF NOT EXISTS life_stages (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at                TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at                TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

  slug                      TEXT UNIQUE NOT NULL,
  name                      TEXT NOT NULL,               -- "Puppy", "Adult", "Senior"
  age_range                 TEXT NOT NULL,               -- "0–1 year", "1–7 years"
  image_url                 TEXT,

  behavioral_characteristics TEXT,
  nutrition_needs           TEXT,
  exercise_requirements     TEXT,

  health_concerns           TEXT[] DEFAULT '{}',
  training_tips             TEXT,
  common_issues             TEXT[] DEFAULT '{}',
  special_care              TEXT,

  is_published              BOOLEAN DEFAULT false NOT NULL
);

-- Indexes
CREATE INDEX idx_life_stages_slug       ON life_stages (slug);
CREATE INDEX idx_life_stages_published  ON life_stages (is_published);

-- updated_at trigger
CREATE TRIGGER trg_life_stages_updated_at
  BEFORE UPDATE ON life_stages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE life_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "life_stages_public_read" ON life_stages
  FOR SELECT USING (is_published = true);

CREATE POLICY "life_stages_service_all" ON life_stages
  FOR ALL USING (current_setting('role') = 'service_role');
