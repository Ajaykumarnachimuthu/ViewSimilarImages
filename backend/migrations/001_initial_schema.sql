-- ==============================================================================
-- VISION2WEB: INITIAL POSTGRESQL SCHEMA MIGRATION (001)
-- Target: Supabase PostgreSQL (compatible with standard PostgreSQL 15+)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. BRANDS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2) CHECK (original_price IS NULL OR original_price >= price),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
    rating NUMERIC(3, 2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    review_count INT DEFAULT 0 CHECK (review_count >= 0),
    stock INT DEFAULT 0 CHECK (stock >= 0),
    image_url VARCHAR(1000) NOT NULL,
    thumbnail_url VARCHAR(1000),
    is_featured BOOLEAN DEFAULT FALSE,
    visual_tags TEXT[] DEFAULT '{}',
    dominant_colors JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. PRODUCT FEATURES TABLE (E-Commerce Specifications)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    feature_name VARCHAR(100) NOT NULL,
    feature_value VARCHAR(255) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 5. PRODUCT VISUAL EMBEDDINGS (Vision Index Table)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_visual_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    perceptual_hash VARCHAR(64) NOT NULL,
    color_histogram JSONB NOT NULL,
    embedding_vector FLOAT[] DEFAULT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. PERFORMANCE & SEARCH INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_visual_tags ON products USING gin(visual_tags);
CREATE INDEX IF NOT EXISTS idx_product_features_prod ON product_features(product_id);
CREATE INDEX IF NOT EXISTS idx_product_features_kv ON product_features(feature_name, feature_value);

-- GIN Full-Text Search Index on Title and Description
CREATE INDEX IF NOT EXISTS idx_products_fts ON products USING gin(to_tsvector('english', title || ' ' || description));

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_visual_embeddings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public categories read" ON categories;
DROP POLICY IF EXISTS "Public brands read" ON brands;
DROP POLICY IF EXISTS "Public products read" ON products;
DROP POLICY IF EXISTS "Public product features read" ON product_features;
DROP POLICY IF EXISTS "Public visual embeddings read" ON product_visual_embeddings;

DROP POLICY IF EXISTS "Catalog write categories" ON categories;
DROP POLICY IF EXISTS "Catalog write brands" ON brands;
DROP POLICY IF EXISTS "Catalog write products" ON products;
DROP POLICY IF EXISTS "Catalog write product_features" ON product_features;
DROP POLICY IF EXISTS "Catalog write embeddings" ON product_visual_embeddings;

-- Public and service read & write access
CREATE POLICY "Public categories access" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public brands access" ON brands FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public products access" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public product features access" ON product_features FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public visual embeddings access" ON product_visual_embeddings FOR ALL USING (true) WITH CHECK (true);

