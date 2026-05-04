-- ============================================================
-- 005 — behavioral_topics table
-- ============================================================

CREATE TABLE IF NOT EXISTS behavioral_topics (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at            TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

  slug                  TEXT UNIQUE NOT NULL,
  name                  TEXT NOT NULL,

  -- ["puppy", "adult", "senior"]
  applicable_stages     TEXT[] DEFAULT '{}',

  issue_description     TEXT,
  causes                TEXT[] DEFAULT '{}',
  solutions             TEXT,
  training_techniques   TEXT[] DEFAULT '{}',

  -- { "dos": ["...", "..."], "donts": ["...", "..."] }
  do_and_donts          JSONB DEFAULT '{"dos": [], "donts": []}',

  common_mistakes       TEXT[] DEFAULT '{}',

  -- { "links": [{ "title": "...", "url": "..." }], "books": ["..."] }
  external_resources    JSONB DEFAULT '{"links": [], "books": []}',

  is_published          BOOLEAN DEFAULT false NOT NULL
);

-- Indexes
CREATE INDEX idx_behavioral_topics_slug      ON behavioral_topics (slug);
CREATE INDEX idx_behavioral_topics_published ON behavioral_topics (is_published);
-- GIN index for array contains queries (e.g. WHERE 'puppy' = ANY(applicable_stages))
CREATE INDEX idx_behavioral_topics_stages    ON behavioral_topics USING GIN (applicable_stages);

-- updated_at trigger
CREATE TRIGGER trg_behavioral_topics_updated_at
  BEFORE UPDATE ON behavioral_topics
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE behavioral_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "behavioral_topics_public_read" ON behavioral_topics
  FOR SELECT USING (is_published = true);

CREATE POLICY "behavioral_topics_service_all" ON behavioral_topics
  FOR ALL USING (current_setting('role') = 'service_role');
