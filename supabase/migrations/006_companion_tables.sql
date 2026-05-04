-- ============================================================
-- 006 — Care Companion tables
-- ============================================================

CREATE TABLE IF NOT EXISTS user_dogs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT NOT NULL,           -- anonymous UUID from localStorage
  name        TEXT NOT NULL,
  breed       TEXT NOT NULL,
  dob         DATE NOT NULL,
  weight_kg   DECIMAL(5,2),
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX idx_user_dogs_user ON user_dogs (user_id);

CREATE TABLE IF NOT EXISTS vaccination_records (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_dog_id    UUID NOT NULL REFERENCES user_dogs(id) ON DELETE CASCADE,
  vaccine_name   TEXT NOT NULL,
  date_given     DATE NOT NULL,
  vet_name       TEXT,
  notes          TEXT,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX idx_vacc_dog ON vaccination_records (user_dog_id);

CREATE TABLE IF NOT EXISTS growth_records (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_dog_id    UUID NOT NULL REFERENCES user_dogs(id) ON DELETE CASCADE,
  weight_kg      DECIMAL(5,2) NOT NULL,
  recorded_date  DATE NOT NULL,
  notes          TEXT,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX idx_growth_dog ON growth_records (user_dog_id);

-- Disable RLS so anon key can write (companion tools use anonymous user_id)
ALTER TABLE user_dogs           DISABLE ROW LEVEL SECURITY;
ALTER TABLE vaccination_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE growth_records      DISABLE ROW LEVEL SECURITY;
