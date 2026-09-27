# CHANGELOG

All notable changes to the **Visual Product Finder** project are documented here.
Format conforms to Keep a Changelog standards.

---

## [2.0.0] - 2026-09-27
### Added
- **Full-Width Production Multi-Page Application:**
  - Integrated `react-router-dom` v7 to transform the platform into a true multi-page commercial application.
  - Implemented 7 distinct routes:
    - `/`: Landing Page marketing entrance.
    - `/discover`: Main application catalog discovery homepage.
    - `/search`: Search results page synchronized with URL query state (`?q=...&category_id=...&brand_id=...&min_price=...&max_price=...&tags=...&sort_by=...&page=...`).
    - `/visual-search`: Dedicated visual search application workflow with dropzone, sample presets, active analyzing state, left reference card, and ranked similarity results with refinement filters.
    - `/categories`: Product categories taxonomy hub with large editorial tiles.
    - `/category/:category`: Department collection page with breadcrumbs and category-specific filters.
    - `/product/:id`: Full-width product details page with gallery, extracted palette swatches, specifications table, and `Visually Similar Products` shelf.
  - Full-Width Responsive Viewport Spanning (`width: 100%`) with disciplined 1280–1440px reading grids.
  - Reusable `ProductCard` component supporting click navigation to `/product/:id` and quick similar trigger to `/visual-search`.
  - Reusable `SimilarProducts` component backed by `/api/v1/products/{id}/visually-similar`.
  - Reusable `ScrollToTop` helper resetting scroll position on route transitions.
  - Persistent global application shell: [`Navbar.tsx`](file:///d:/VISION2WEB/frontend/src/components/common/Navbar.tsx) and [`Footer.tsx`](file:///d:/VISION2WEB/frontend/src/components/common/Footer.tsx).
  - Verified end-to-end via automated browser subagent with session recording `multipage_app_demo_1790520229929.webp`.

---

## [1.3.0] - 2026-09-27
### Added
- **Production-Quality Landing Page Experience:**
  - Implemented full editorial landing page architecture:
    - `HeroSection`: Controlled headline (*"Find products by what you see."*), prominent search field with `Search Products` button, secondary visual search entry (*"or Search with an image [Upload Image]"*), and realistic 1-image-to-3-discoveries visual composition.
    - `DiscoveryMethodsSection`: *"Explore products your way"* with 3 editorial discovery pillars (Search, Filter, Visual Search).
    - `VisualSearchShowcaseSection`: *"See something you like? Search with it."* with large uploaded reference jacket, extracted color swatches, technical capability details, and live ranked similarity preview.
    - `HowItWorksSection`: 3-step typographic process (01 Search or upload, 02 Discover relevant products, 03 Compare and explore).
    - `CategoryDiscoverySection`: Real product photography cards across 5 verified departments.
    - `FeaturedProductsSection`: Curated 4-column product grid with direct modal inspection and "Similar" triggers.
    - `TrustSection`: Transparent engineering capabilities without fake metrics.
    - `FinalCtaSection`: Clean call-to-action with whitespace.
  - Verified via browser recording `landing_page_demo_1790513655987.webp`.

---

## [1.2.0] - 2026-09-27
### Changed
- **Production-Grade Editorial UI/UX Transformation:**
  - Restrained editorial visual foundation (`#fafaf9`, `#ffffff`, `#18181b`, `#0f172a`), 4:5 image ratio, disciplined 4–12px radii.
  - Verified via browser recording `editorial_product_demo_1790511419073.webp`.

---

## [1.1.0] - 2026-09-27
### Changed
- **UI/UX Master Redesign:** Soft neutral canvas (`#f8fafc`) and pure white cards; breadcrumbs and active filter chips; verified via browser recording `visual_finder_light_1790509588541.webp`.

---

## [1.0.0] - 2026-09-27
### Added
- Complete FastAPI backend in `backend/app/`.
- Modular `VisualSearchProvider` with `PrototypeVisualSearchProvider` (HSV 64-bin histogram, 64-bit dHash, dominant colors).
- Untrusted image upload security pipeline (magic bytes, 5MB limit, safe sanitization).
- Supabase PostgreSQL schema with RLS and GIN indexes.
- 18 automated pytest test suite in `backend/tests/`.
- 14 synchronized project intelligence documents in `project-intelligence/`.
