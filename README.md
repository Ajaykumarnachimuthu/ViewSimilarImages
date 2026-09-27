# VISION2WEB — VISUAL PRODUCT FINDER
## Vision2Web | Full Stack Web Development Hackathon

A professional full-stack visual discovery and e-commerce product search system built with **FastAPI**, **React (TypeScript + Vite + Tailwind CSS)**, and **Supabase PostgreSQL**.

---

### Key Capabilities
- **Multi-Criteria Product Search:** Dynamic filtering across categories, brands, price boundary sliders, visual attributes, keyword search, and multiple sorting dimensions (`price_asc`, `price_desc`, `rating_desc`, `newest`).
- **Mathematical Visual Search Engine:** Genuine computer-vision feature extraction (64-bin HSV color distribution, 64-bit dHash structural silhouette, dominant color quantization, and tag Jaccard overlap) with **zero hard-coded file switches**.
- **Provider Abstraction Architecture:** Modular `VisualSearchProvider` interface (`PrototypeVisualSearchProvider` -> `EmbeddingVisualSearchProvider`), decoupling the frontend and API layers from underlying vision models.
- **Fail-Safe Fallback:** If visual similarity yields low confidence or an upload fails, the engine seamlessly falls back to popular/category products with clear user feedback.
- **Multi-Tier Upload Security:** Ingestion security pipeline verifying magic bytes (JPEG/PNG/WEBP), maximum payload size (5MB), decompression bomb defense, and UUID filename sanitization.
- **Persistent Project Intelligence System:** 14 structured engineering documents in `/project-intelligence/` acting as the single source of truth.

---

### Quick Start Guide

#### 1. Backend Setup
```bash
# Navigate to backend and activate virtualenv
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend development server
uvicorn backend.app.main:app --reload --port 8000
```
Backend API interactive docs: `http://localhost:8000/api/v1/docs`  
Health check: `http://localhost:8000/api/v1/health`

#### 2. Running Test Suite
```bash
pytest backend/tests -v
```
All 18 unit, integration, vision math, and security tests run against the live API and algorithms.

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

### Project Structure
```text
VISION2WEB/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/ (health, products, categories, visual_search)
│   │   ├── core/            (config, exceptions, security, logging)
│   │   ├── db/              (supabase_client)
│   │   ├── models/ & schemas/ (pydantic models with ConfigDict)
│   │   ├── repositories/    (product_repository, category_repository)
│   │   ├── services/        (product_service, visual_search_service)
│   │   │   └── vision_providers/ (base, prototype_provider, embedding_provider)
│   │   └── main.py
│   ├── migrations/          (001_initial_schema.sql with PostgreSQL RLS & GIN indexes)
│   ├── seed/                (seed_data.json)
│   ├── tests/               (unit & api test suites)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      (common, search, product, visual-search)
│   │   ├── services/        (type-safe Axios client)
│   │   ├── types/           (TypeScript data contracts)
│   │   ├── App.tsx          (Application state & reactive layout)
│   │   └── index.css        (Tailwind & custom glassmorphism)
│   └── package.json
└── project-intelligence/    (14 Architecture & Verification Docs)
```

---

### Demonstration Walkthrough for Hackathon Judges
1. **Catalog Browsing:** Select categories (Footwear, Outerwear, Electronics, Watches, Home) and notice instant filtering.
2. **Facet Filtering:** Drag the price slider to restrict boundaries; check multiple brands; search keywords like `leather` or `running`.
3. **Visual Product Discovery:**
   - Click the **"Visual Search"** camera button in the header.
   - Click any curated demo preset (e.g. *Red Athletic Runner*, *Studio Wireless Headphones*, *Ceramic Stoneware Lamp*) or drop your own image.
   - Observe the live laser scanning beam and extracted dominant color swatches + attribute tags.
   - Click **"Apply Visual Results"** to view ranked products with precision match badges (e.g., `94% Visual Match`).
   - Hover and inspect the **"Why this matched"** breakdown showing Color Similarity %, Structural Shape %, and Tag Overlap %.
4. **Product Details:** Click any product card to inspect full technical specifications and the **"Visually Related Products"** shelf.
