# UI / UX DESIGN SYSTEM & MULTI-PAGE APPLICATION SPECIFICATION

```text
STATUS: PRODUCTION MULTI-PAGE APPLICATION (IMPLEMENTED & VERIFIED)
Architecture: Full-Width Multi-Page Application (React Router v7)
Visual Language: Premium E-Commerce × Editorial Product Discovery × Modern Search UX
Viewport Model: 100% Full-Width Viewport Spanning with 1280–1440px Reading Grids
Routes: / (Landing), /discover, /search, /visual-search, /categories, /category/:slug, /product/:id
```

---

## 1. Information Architecture & Application Shell

The application is structured as a **real consumer-facing multi-page discovery platform**, not a single static portfolio page or AI demo.

### 1.1 Global Application Shell
All application pages share a persistent global shell:
```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [V] Visual Product Finder    Discover   Visual Search   Categories   [Search]  [Sign In]  [Try Visual Search] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                            ROUTE PAGE CONTENT                               │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ FOOTER: Product Links   •   Department Taxonomy   •   Legal   •   Copyright │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Full-Width Layout Discipline
- The application spans **100% of the available browser viewport width**.
- Background surfaces (`#fafaf9`, `#ffffff`) extend edge-to-edge.
- Content elements maintain disciplined readability within centered, spacious containers (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`).
- Zero cramped 900px or 1100px floating card containers.

---

## 2. Route Specifications

### 2.1 Landing Page (`/`)
- **Role:** Marketing & discovery entrance; explains value proposition and transitions into the app.
- **Sections:**
  - *Hero:* Headline *"Find products by what you see."*, full search input, visual discovery concept card (1 image $\rightarrow$ 3 discoveries), dual CTAs (`Explore Catalog`, `Search by Image`).
  - *Discovery Methods:* 3-pillar layout (Natural Search, Structured Filter, Visual Search).
  - *Visual Search Showcase:* Large reference jacket with extracted color swatches and live result preview cards.
  - *How It Works:* 3-step typographic process (01 Search or upload, 02 Discover, 03 Compare and explore).
  - *Category Preview:* 5 verified departments with real photography.
  - *Featured Products:* Curated 4-column product grid with direct navigation to `/product/:id`.
  - *Trust Section:* Transparent capabilities (HSV histogram, dHash, verified catalog index, secure ingestion) without fake metrics.
  - *Final CTA:* Direct entry into `/discover` and `/visual-search`.

### 2.2 Product Discovery (`/discover`)
- **Role:** Main application catalog homepage.
- **Components:**
  - Header: *"Discover products"* — *"Explore products across verified departments or search for something specific."*
  - Large search bar with integrated camera button leading to `/visual-search`.
  - Quick category department shortcuts (*Footwear*, *Outerwear*, *Electronics*, *Watches*, *Home*).
  - Persistent left filter sidebar + active filter chips bar + sort dropdown.
  - Responsive 4-column product grid with price, discount badges, ratings, and hover visual search lens.
  - Pagination controls.

### 2.3 Search Results (`/search?q=...`)
- **Role:** Dedicated search results with persistent URL state.
- **Components:**
  - Top search input bar.
  - Search results summary (*Results for "query" — N products available*).
  - Active filter chips with 1-click dismiss and clear all.
  - Left filter sidebar (categories, brands, price slider, attribute tags).
  - Mobile filter drawer.
  - 4-column product grid with skeleton loading and empty state recovery.
  - URL synchronization: `q`, `category_id`, `brand_id`, `min_price`, `max_price`, `tags`, `sort_by`, `page`.

### 2.4 Visual Search Engine (`/visual-search`)
- **Role:** Dedicated application workflow page (not a modal).
- **State Machine:**
  - `EMPTY`: Large dropzone (Drag and drop here, or choose from device), supported formats notice, 4 curated 1-click presets (*Red Athletic Runner*, *Technical Shell Jacket*, *Wireless Headphones*, *Ceramic Lamp*).
  - `PROCESSING`: Image thumbnail + active analysis spinner (*"Analyzing image... Extracting color palette, silhouette geometry, and catalog descriptors..."*).
  - `RESULTS`: Dual-column layout:
    - *Left Column (Sticky):* Uploaded reference image, extracted color palette swatches with hex codes, recognized attribute tags, and change image button.
    - *Right Column:* Similarity results count, department/brand refinement dropdowns, 4-column product grid with precision similarity badges (`83% visual match`) and matched attributes breakdown (`Color: 100% • Shape: 90% • Tags: Runner, Mesh`).
  - `ERROR`: Clear human-readable message with retry action.

### 2.5 Categories Overview (`/categories`)
- **Role:** Full catalog taxonomy.
- **Components:** Large editorial category tiles with photography, department descriptions, product counts, and direct links to `/category/:slug`.

### 2.6 Category Detail (`/category/:slug`)
- **Role:** Department-specific collection.
- **Components:** Breadcrumbs (*Home > Categories > Department*), category title and description, category-specific filter sidebar, active chips, sort dropdown, and 4-column product grid.

### 2.7 Product Detail (`/product/:id`)
- **Role:** Full-width comprehensive product page.
- **Components:**
  - Breadcrumbs (*Home > Discover > Department > Product Title*).
  - Left Column: Large 4:5 image gallery with hover zoom, extracted color palette swatches with hex codes and names.
  - Right Column: Brand uppercase, title, star rating with verified review count, pricing with discount badges, short description, attribute tags, primary CTA (*"Find Visually Similar"*), secondary CTA (*"Add to Bag"*), shipping and guarantee trust notes.
  - Product Specifications: Structured key-value table (Category, Brand, Materials, Outsole, Weight, Origin, etc.).
  - Similar Products Shelf: Reusable component displaying real visually similar products ranked by color harmony and geometric silhouette.

---

## 3. Reusable Component Invariants

1. **`ProductCard`:** ONE unified card across Discover, Search, Category, Visual Search, and Similar Products. Supports image, brand, title, rating, price, discount badge, similarity score, matched attributes, click navigation to `/product/:id`, and hover camera button to `/visual-search`.
2. **`SimilarProducts`:** Reusable component backed by `/api/v1/products/{id}/visually-similar`.
3. **`FilterSidebar`:** Driven dynamically by `CatalogFacets` returned by the backend.
4. **`Navbar` & `Footer`:** Persistent across all routes.

---

## 4. Multi-Device Responsive Layout Plan & Viewport Architecture

To guarantee that the application fits completely inside all browser windows on Windows OS (including laptops with 125% and 150% high-DPI scaling), tablets, and mobile devices without horizontal overflow or clipped elements, the layout implements a strict multi-tier responsive strategy:

### 4.1 Breakpoint System & Grid Distribution

| Device Tier | Viewport Width ($W$) | Product Grid Columns | Navigation UI | Filter Presentation |
| :--- | :--- | :--- | :--- | :--- |
| **Desktop / Ultra-Wide** | $W \ge 1280\text{px}$ (`xl`, `2xl`) | **4 Columns** (`grid-cols-4`) | Full desktop nav + full search bar + direct CTAs | Sticky left sidebar (`FilterSidebar`) |
| **Laptop / Windows 125%-150% DPI** | $1024\text{px} \le W < 1280\text{px}$ (`lg`) | **3 to 4 Columns** | Compact search input (`max-w-xs`) + desktop nav | Sticky left sidebar or collapsible |
| **Tablet / Small Laptop** | $768\text{px} \le W < 1024\text{px}$ (`md`) | **3 Columns** (`grid-cols-3`) | Desktop links + compact search | 1-Tap Mobile Filter Drawer (`isMobileFiltersOpen`) |
| **Mobile Large / Phablet** | $480\text{px} \le W < 768\text{px}$ (`sm`) | **2 Columns** (`grid-cols-2`) | Hamburger menu + slide-out navigation drawer | 1-Tap Mobile Filter Drawer |
| **Mobile Compact** | $320\text{px} \le W < 480\text{px}$ (`xs`) | **2 Columns** (`grid-cols-2`) | Hamburger drawer + compact logo text ("Visual Finder") | 1-Tap Mobile Filter Drawer |

### 4.2 Windows OS Viewport Fitting & Overflow Defense
1. **Global Root Viewport Lock (`index.css`):**
   ```css
   *, *::before, *::after {
     box-sizing: border-box;
   }
   html, body, #root {
     width: 100%;
     max-width: 100vw;
     overflow-x: hidden;
   }
   ```
2. **Defensive Grid Child Constraint (`min-w-0`):** All CSS grid items have explicit `min-w-0` applied to prevent standard CSS grid auto-min-width calculation from triggering horizontal page blowout when titles or image wrappers are nested.
3. **Fluid Image & Media Bounds:** `img, video { max-width: 100%; height: auto; }` ensures high-resolution catalog photos scale down smoothly on narrow viewports.
4. **Header Department Scrollbar Isolation:** The horizontal department bar (`Navbar.tsx`) uses `overflow-x-auto scrollbar-none max-w-full` to provide smooth horizontal flicking without affecting parent page scroll.
5. **Interactive Filter Accessibility:**
   - On Desktop ($\ge 1024\text{px}$): Sidebar is visible by default alongside the grid.
   - On Tablet/Mobile ($< 1024\text{px}$): Dedicated `Filters` button in `ActiveFilters` opens a full-height touch-friendly slide-out drawer with zero layout shifting.
