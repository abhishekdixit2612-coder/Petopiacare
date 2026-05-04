-- ============================================================
-- 001 — dog_breeds table
-- ============================================================

CREATE TABLE IF NOT EXISTS dog_breeds (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

  slug                TEXT UNIQUE NOT NULL,
  name                TEXT NOT NULL,
  image_url           TEXT,

  size                dog_size NOT NULL,
  weight_range        TEXT,                        -- e.g. "10–15 kg"
  height_range        TEXT,                        -- e.g. "25–30 cm"

  temperament         TEXT[] DEFAULT '{}',
  exercise_level      exercise_level NOT NULL,
  grooming_needs      grooming_needs NOT NULL,
  shedding            shedding_level NOT NULL,

  common_health_issues TEXT[] DEFAULT '{}',
  life_expectancy     TEXT,                        -- e.g. "12–15 years"
  origin              TEXT,

  behavioral_traits   TEXT,
  training_difficulty training_difficulty NOT NULL,
  good_with_kids      BOOLEAN DEFAULT false,
  good_with_pets      BOOLEAN DEFAULT false,

  full_description    TEXT,
  care_tips           TEXT,
  nutrition_notes     TEXT,

  is_published        BOOLEAN DEFAULT false NOT NULL
);

-- Indexes
CREATE INDEX idx_dog_breeds_slug        ON dog_breeds (slug);
CREATE INDEX idx_dog_breeds_published   ON dog_breeds (is_published);
CREATE INDEX idx_dog_breeds_size        ON dog_breeds (size);

-- updated_at trigger
CREATE TRIGGER trg_dog_breeds_updated_at
  BEFORE UPDATE ON dog_breeds
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE dog_breeds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dog_breeds_public_read" ON dog_breeds
  FOR SELECT USING (is_published = true);

CREATE POLICY "dog_breeds_service_all" ON dog_breeds
  FOR ALL USING (current_setting('role') = 'service_role');
