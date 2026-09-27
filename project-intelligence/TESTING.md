# TESTING STRATEGY & TEST SUITE

```text
STATUS: SPECIFIED & TEST SUITE DESIGNED
Framework: pytest, pytest-asyncio, httpx
Target Coverage: Services, Repositories, Providers, Endpoints, Security
```

---

## 1. Test Suite Architecture

```text
backend/tests/
├── conftest.py                  # Test fixtures, mock repositories, sample image generators
├── unit/
│   ├── test_security.py         # Magic bytes, payload limits, safe filename generation
│   ├── test_prototype_vision.py # Feature extraction, dHash, color histogram, similarity scoring
│   └── test_product_service.py  # Filter logic, sorting, pagination, facet aggregation
├── api/
│   ├── test_health_api.py       # Health check endpoint
│   ├── test_products_api.py     # Product listing, filtering, search, 404 handling
│   └── test_visual_search_api.py# Image upload, validation, similarity matching, fallback
```

---

## 2. Test Cases & Execution Matrix

| Test ID | Area | Scenario | Input | Expected Output | Status |
|---|---|---|---|---|---|
| `SEC-001` | Security | Reject non-image file spoofed as JPEG | Byte stream with text `hello world` and `.jpg` extension | `400 Bad Request: Invalid image header` | PENDING |
| `SEC-002` | Security | Reject oversized image file | Synthetic buffer > 5MB | `413 Payload Too Large` | PENDING |
| `SEC-003` | Security | Sanitize path traversal filename | `../../etc/passwd.png` | Stripped to `uuid.png` | PENDING |
| `VIS-001` | Vision Provider | Color histogram normalization | $100\times100$ pure red image | Sum of histogram bins equals $1.0$ | PENDING |
| `VIS-002` | Vision Provider | Identical image similarity | Image compared with itself | Similarity score $\approx 1.00$ | PENDING |
| `VIS-003` | Vision Provider | Invariant to slight scale / compression | Image vs 50% resized version | Similarity score $> 0.85$ | PENDING |
| `VIS-004` | Vision Provider | Dissimilar images | Black shoe vs bright yellow lamp | Similarity score $< 0.40$ | PENDING |
| `CAT-001` | Product API | Keyword search matching | `q=leather` | Returns only items with 'leather' in title/desc/tags | PENDING |
| `CAT-002` | Product API | Price boundary filtering | `min_price=100&max_price=200` | All returned items satisfy $100 \le \text{price} \le 200$ | PENDING |
| `CAT-003` | Product API | Non-existent product ID | Random UUID | `404 Not Found` with structured error | PENDING |
| `VIS-API-1` | Visual API | Valid visual search request | Synthetic sneaker image | `200 OK`, `results` sorted by similarity desc | PENDING |
| `VIS-API-2` | Visual API | Visual search fallback trigger | Unrecognizable noise pattern | `200 OK`, `fallback_used: true`, popular items returned | PENDING |

---

## 3. Test Verification Policy
No test may be marked `PASSED` without actual test execution logs recorded in [VERIFICATION_LOG.md](file:///d:/VISION2WEB/project-intelligence/VERIFICATION_LOG.md).
