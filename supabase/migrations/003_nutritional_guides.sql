-- ============================================================
-- 003 — nutritional_guides table
-- ============================================================

CREATE TABLE IF NOT EXISTS nutritional_guides (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

  slug                TEXT UNIQUE NOT NULL,
  title               TEXT NOT NULL,
  category            nutrition_category NOT NULL,

  description         TEXT,
  recommended_foods   TEXT[] DEFAULT '{}',

  -- e.g. { "puppies": { "meals_per_day": 3, "grams_per_meal": "100-150" }, "adults": {...} }
  quantities_chart    JSONB DEFAULT '{}',

  foods_to_avoid      TEXT[] DEFAULT '{}',
  supplements_info    TEXT,
  special_diets       TEXT[] DEFAULT '{}',
  transitions_guide   TEXT,

  is_published        BOOLEAN DEFAULT false NOT NULL
);

-- Indexes
CREATE INDEX idx_nutritional_guides_slug      ON nutritional_guides (slug);
CREATE INDEX idx_nutritional_guides_published ON nutritional_guides (is_published);
CREATE INDEX idx_nutritional_guides_category  ON nutritional_guides (category);

-- updated_at trigger
CREATE TRIGGER trg_nutritional_guides_updated_at
  BEFORE UPDATE ON nutritional_guides
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE nutritional_guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nutritional_guides_public_read" ON nutritional_guides
  FOR SELECT USING (is_published = true);

CREATE POLICY "nutritional_guides_service_all" ON nutritional_guides
  FOR ALL USING (current_setting('role') = 'service_role');
