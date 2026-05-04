-- ============================================================
-- 000 — Shared enums and updated_at trigger helper
-- Run this FIRST before any other migration
-- ============================================================

-- Trigger function: auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── Dog breed enums ──────────────────────────────────────────
CREATE TYPE dog_size AS ENUM ('small', 'medium', 'large', 'xlarge');

CREATE TYPE exercise_level AS ENUM ('low', 'moderate', 'high', 'very_high');

CREATE TYPE grooming_needs AS ENUM ('minimal', 'moderate', 'high', 'very_high');

CREATE TYPE shedding_level AS ENUM ('low', 'moderate', 'high');

CREATE TYPE training_difficulty AS ENUM ('easy', 'moderate', 'difficult');

-- ── Health condition enums ───────────────────────────────────
CREATE TYPE condition_severity AS ENUM ('mild', 'moderate', 'severe');

-- ── Nutritional guide enums ──────────────────────────────────
CREATE TYPE nutrition_category AS ENUM (
  'food_types',
  'feeding_schedules',
  'special_diets',
  'foods_to_avoid',
  'supplements'
);
