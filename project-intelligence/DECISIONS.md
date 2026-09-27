# ARCHITECTURAL DECISION RECORDS (ADR)

```text
STATUS: ACTIVE
Project: VISION2WEB — Visual Product Finder
```

---

### ADR-001: Decoupled Multi-Layered Architecture
- **Date:** 2026-09-27
- **Status:** APPROVED
- **Context:** The application is built for the Vision2Web Hackathon and must evolve from prototype to production without rewrites.
- **Decision:** Strict separation between Presentation (React/Vite/TS), REST API Controllers (FastAPI), Application Services (`ProductService`, `VisualSearchService`), Repositories (`ProductRepository`), and Data Storage (PostgreSQL).
- **Reason:** Business logic must never reside in routes or UI components. Testing and provider switching become trivial.
- **Trade-offs:** Additional boilerplate classes compared to monolithic scripts, but vastly superior maintainability.

---

### ADR-002: Visual Search Provider Abstraction
- **Date:** 2026-09-27
- **Status:** APPROVED
- **Context:** The initial prototype cannot depend on heavy GPU infrastructure or proprietary vision APIs, yet must support seamless upgrade to CLIP/pgvector later.
- **Decision:** Introduce `VisualSearchProvider` interface with `PrototypeVisualSearchProvider` and future `EmbeddingVisualSearchProvider`.
- **Reason:** Frontend and controllers are completely decoupled from the vision algorithm.
- **Trade-offs:** Requires standardizing feature representation and similarity scoring interfaces.

---

### ADR-003: Mathematical Similarity vs. Hard-Coded Demos
- **Date:** 2026-09-27
- **Status:** APPROVED
- **Context:** Hackathon prototypes frequently use fake switch statements (e.g. `if "shoe.jpg" in filename`).
- **Decision:** Implement genuine computer vision feature extraction: 32-bin HSV color histogram, 64-bit dHash structural geometry, and attribute overlap.
- **Reason:** Satisfies the master engineering rule: "No hard-coded business logic". Any arbitrary image produces real mathematical scores.
- **Trade-offs:** Requires PIL/NumPy dependency in backend, but provides credible technical integrity.

---

### ADR-004: Supabase PostgreSQL as Primary Store with Repository Pattern
- **Date:** 2026-09-27
- **Status:** APPROVED
- **Context:** Relational data model with category hierarchy, brand facets, product specifications, and JSONB visual metadata.
- **Decision:** Use PostgreSQL schema managed via versioned SQL migrations, accessed via a repository layer with mockable/in-memory database fallback for frictionless local execution.
- **Reason:** Ensures standard SQL relational integrity and easy deployment to Supabase cloud.

---

### ADR-005: Multi-Tier Image Upload Validation
- **Date:** 2026-09-27
- **Status:** APPROVED
- **Context:** Image uploads are untrusted user input susceptible to DoS (decompression bombs) and MIME spoofing.
- **Decision:** Four-stage pipeline: payload size check (<= 5MB) → magic byte inspection → PIL bounded decompression → UUID sanitization.
- **Reason:** Hardened security preventing server exploitation.
