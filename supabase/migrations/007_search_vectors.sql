-- ============================================================
-- 007 — Full-text search vectors + analytics
-- ============================================================

-- Search vector on dog_breeds
ALTER TABLE dog_breeds ADD COLUMN IF NOT EXISTS search_vector tsvector;
UPDATE dog_breeds SET search_vector = to_tsvector('english',
  coalesce(name, '') || ' ' || coalesce(full_description, '') || ' ' ||
  coalesce(behavioral_traits, '') || ' ' || coalesce(array_to_string(temperament, ' '), '')
);
CREATE INDEX IF NOT EXISTS idx_dog_breeds_fts ON dog_breeds USING GIN(search_vector);

CREATE OR REPLACE FUNCTION sync_dog_breeds_fts() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector = to_tsvector('english',
    coalesce(NEW.name, '') || ' ' || coalesce(NEW.full_description, '') || ' ' ||
    coalesce(NEW.behavioral_traits, '') || ' ' || coalesce(array_to_string(NEW.temperament, ' '), ''));
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER dog_breeds_fts_trigger
  BEFORE INSERT OR UPDATE ON dog_breeds
  FOR EACH ROW EXECUTE FUNCTION sync_dog_breeds_fts();

-- Search vector on health_conditions
ALTER TABLE health_conditions ADD COLUMN IF NOT EXISTS search_vector tsvector;
UPDATE health_conditions SET search_vector = to_tsvector('english',
  coalesce(name, '') || ' ' || coalesce(description, '') || ' ' ||
  coalesce(array_to_string(symptoms, ' '), '') || ' ' || coalesce(prevention_tips::text, '')
);
CREATE INDEX IF NOT EXISTS idx_health_conditions_fts ON health_conditions USING GIN(search_vector);

CREATE OR REPLACE FUNCTION sync_health_conditions_fts() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector = to_tsvector('english',
    coalesce(NEW.name, '') || ' ' || coalesce(NEW.description, '') || ' ' ||
    coalesce(array_to_string(NEW.symptoms, ' '), ''));
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER health_conditions_fts_trigger
  BEFORE INSERT OR UPDATE ON health_conditions
  FOR EACH ROW EXECUTE FUNCTION sync_health_conditions_fts();

-- Search vector on nutritional_guides
ALTER TABLE nutritional_guides ADD COLUMN IF NOT EXISTS search_vector tsvector;
UPDATE nutritional_guides SET search_vector = to_tsvector('english',
  coalesce(title, '') || ' ' || coalesce(description, '') || ' ' ||
  coalesce(supplements_info, '') || ' ' || coalesce(array_to_string(recommended_foods, ' '), '')
);
CREATE INDEX IF NOT EXISTS idx_nutritional_guides_fts ON nutritional_guides USING GIN(search_vector);

CREATE OR REPLACE FUNCTION sync_nutritional_guides_fts() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector = to_tsvector('english',
    coalesce(NEW.title, '') || ' ' || coalesce(NEW.description, '') || ' ' ||
    coalesce(NEW.supplements_info, ''));
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER nutritional_guides_fts_trigger
  BEFORE INSERT OR UPDATE ON nutritional_guides
  FOR EACH ROW EXECUTE FUNCTION sync_nutritional_guides_fts();

-- Search vector on behavioral_topics
ALTER TABLE behavioral_topics ADD COLUMN IF NOT EXISTS search_vector tsvector;
UPDATE behavioral_topics SET search_vector = to_tsvector('english',
  coalesce(name, '') || ' ' || coalesce(issue_description, '') || ' ' ||
  coalesce(solutions, '') || ' ' || coalesce(array_to_string(causes, ' '), '')
);
CREATE INDEX IF NOT EXISTS idx_behavioral_topics_fts ON behavioral_topics USING GIN(search_vector);

CREATE OR REPLACE FUNCTION sync_behavioral_topics_fts() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector = to_tsvector('english',
    coalesce(NEW.name, '') || ' ' || coalesce(NEW.issue_description, '') || ' ' ||
    coalesce(NEW.solutions, '') || ' ' || coalesce(array_to_string(NEW.causes, ' '), ''));
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER behavioral_topics_fts_trigger
  BEFORE INSERT OR UPDATE ON behavioral_topics
  FOR EACH ROW EXECUTE FUNCTION sync_behavioral_topics_fts();

-- Search vector on blog_posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS search_vector tsvector;
UPDATE blog_posts SET search_vector = to_tsvector('english',
  coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, '')
);
CREATE INDEX IF NOT EXISTS idx_blog_posts_fts ON blog_posts USING GIN(search_vector);

CREATE OR REPLACE FUNCTION sync_blog_posts_fts() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector = to_tsvector('english',
    coalesce(NEW.title, '') || ' ' || coalesce(NEW.excerpt, '') || ' ' || coalesce(NEW.content, ''));
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER blog_posts_fts_trigger
  BEFORE INSERT OR UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION sync_blog_posts_fts();

-- Search analytics table
CREATE TABLE IF NOT EXISTS search_analytics (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query      TEXT NOT NULL,
  results    INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON search_analytics (query);
ALTER TABLE search_analytics DISABLE ROW LEVEL SECURITY;
