-- ==============================================================================
-- VISION2WEB: MIGRATION 002 - SECURITY RLS FIX & EXTERNAL IDENTITY
-- Target: Supabase PostgreSQL
-- ==============================================================================

-- 1. ADD EXTERNAL IDENTITY COLUMNS TO PRODUCTS
ALTER TABLE products ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'catalog';
ALTER TABLE products ADD COLUMN IF NOT EXISTS external_product_id VARCHAR(255);

-- 2. CREATE UNIQUE INDEX ON EXTERNAL IDENTITY
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_source_ext_id
ON products(source, external_product_id)
WHERE external_product_id IS NOT NULL;

-- 3. ENSURE ROW LEVEL SECURITY IS ENABLED
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_visual_embeddings ENABLE ROW LEVEL SECURITY;

-- 4. DROP ALL PERMISSIVE OR OVERLY BROAD WRITE POLICIES
DROP POLICY IF EXISTS "Public categories access" ON categories;
DROP POLICY IF EXISTS "Public brands access" ON brands;
DROP POLICY IF EXISTS "Public products access" ON products;
DROP POLICY IF EXISTS "Public product features access" ON product_features;
DROP POLICY IF EXISTS "Public visual embeddings access" ON product_visual_embeddings;

DROP POLICY IF EXISTS "Catalog write categories" ON categories;
DROP POLICY IF EXISTS "Catalog write brands" ON brands;
DROP POLICY IF EXISTS "Catalog write products" ON products;
DROP POLICY IF EXISTS "Catalog write product_features" ON product_features;
DROP POLICY IF EXISTS "Catalog write embeddings" ON product_visual_embeddings;

DROP POLICY IF EXISTS "Public categories read" ON categories;
DROP POLICY IF EXISTS "Public brands read" ON brands;
DROP POLICY IF EXISTS "Public products read" ON products;
DROP POLICY IF EXISTS "Public product features read" ON product_features;
DROP POLICY IF EXISTS "Public visual embeddings read" ON product_visual_embeddings;

-- 5. CREATE STRICT PUBLIC READ-ONLY POLICIES (anon and authenticated can only SELECT)
CREATE POLICY "Public categories read"
ON categories
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public brands read"
ON brands
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public products read"
ON products
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public product features read"
ON product_features
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public visual embeddings read"
ON product_visual_embeddings
FOR SELECT
TO anon, authenticated
USING (true);
