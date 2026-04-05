-- PHASE 2 DATABASE MIGRATION SCRIPT
-- Run this in your Supabase SQL Editor

-- 1. Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt VARCHAR(500),
  content TEXT NOT NULL,
  featured_image VARCHAR(500),
  category VARCHAR(50),
  author VARCHAR(100) DEFAULT 'PetopiaCare',
  read_time_minutes INT,
  status VARCHAR(20) DEFAULT 'published',
  seo_title VARCHAR(60),
  seo_description VARCHAR(160),
  seo_keywords VARCHAR(200),
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Note: Digital Products Table is added since we are not just mocking for production
-- 2. Digital Products Table
CREATE TABLE IF NOT EXISTS digital_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  category VARCHAR(50) NOT NULL, -- e.g., eBook, Course, Guide
  tier VARCHAR(50) NOT NULL, -- e.g., FREE, TIER2, TIER3, BUNDLES
  short_description VARCHAR(500),
  features JSONB, -- list of bullet points for 'What you will learn'
  thumbnail_url VARCHAR(500),
  download_url VARCHAR(500), -- link to the actual pdf/video
  rating DECIMAL(3, 2) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  badge VARCHAR(50), -- e.g., 'Bestseller', 'New'
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Newsletter Subscribers Table (Bonus to handle footer signup)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  source VARCHAR(50) DEFAULT 'footer',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
