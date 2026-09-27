# REST API REFERENCE

```text
STATUS: SPECIFIED & IMPLEMENTED
Base URL: /api/v1
Version: 1.0.0
Specification Standard: OpenAPI 3.1 / FastAPI Automatic Docs at /docs
```

---

## 1. Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/health` | Service health and database connectivity check | None |
| `GET` | `/products` | List, search, filter, and paginate products | None |
| `GET` | `/products/{id}` | Retrieve comprehensive product details with specs | None |
| `GET` | `/products/{id}/visually-similar` | Retrieve visually similar products for a given item | None |
| `GET` | `/categories` | Retrieve hierarchical categories with product counts | None |
| `GET` | `/brands` | Retrieve list of brands | None |
| `GET` | `/filters/facets` | Dynamic facet aggregation (price ranges, brands, tags) | None |
| `POST` | `/visual-search` | Visual image upload & similarity search endpoint | None |

---

## 2. Endpoint Details

### 2.1 Health Check
- **Method:** `GET`
- **Path:** `/api/v1/health`
- **Response `200 OK`:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "database": "connected",
  "vision_provider": "PrototypeVisualSearchProvider"
}
```

---

### 2.2 List / Search Products
- **Method:** `GET`
- **Path:** `/api/v1/products`
- **Query Parameters:**
  - `q` (string, optional): Full-text keyword search
  - `category_id` (UUID, optional): Filter by category
  - `brand_id` (UUID, optional): Filter by brand
  - `min_price` (float, optional, >= 0): Minimum price boundary
  - `max_price` (float, optional, >= 0): Maximum price boundary
  - `tags` (string, optional, comma-separated): Filter by visual/product tags
  - `sort_by` (string, enum: `price_asc`, `price_desc`, `rating_desc`, `newest`, default: `newest`)
  - `page` (int, default: 1, >= 1)
  - `page_size` (int, default: 12, max: 48)
- **Response `200 OK`:**
```json
{
  "items": [
    {
      "id": "e674b880-9289-4bcf-a54f-c7c42738ea82",
      "title": "Minimalist Leather Sneaker",
      "slug": "minimalist-leather-sneaker",
      "description": "Premium handcrafted leather sneaker with clean silhouette.",
      "price": 149.00,
      "original_price": 189.00,
      "category": { "id": "...", "name": "Footwear", "slug": "footwear" },
      "brand": { "id": "...", "name": "Aether & Co." },
      "rating": 4.8,
      "review_count": 128,
      "stock": 24,
      "image_url": "https://images.unsplash.com/...",
      "thumbnail_url": "https://images.unsplash.com/...",
      "is_featured": true,
      "visual_tags": ["sneakers", "leather", "white", "minimalist"],
      "dominant_colors": [
        { "hex": "#f5f5f5", "name": "Off White", "ratio": 0.65 },
        { "hex": "#1a1a1a", "name": "Charcoal", "ratio": 0.25 }
      ]
    }
  ],
  "total": 48,
  "page": 1,
  "page_size": 12,
  "total_pages": 4
}
```

---

### 2.3 Product Detail
- **Method:** `GET`
- **Path:** `/api/v1/products/{id}`
- **Path Parameters:**
  - `id` (UUID, required): Target product ID
- **Response `200 OK`:**
```json
{
  "id": "e674b880-9289-4bcf-a54f-c7c42738ea82",
  "title": "Minimalist Leather Sneaker",
  "slug": "minimalist-leather-sneaker",
  "description": "Full detailed description...",
  "price": 149.00,
  "original_price": 189.00,
  "category": { "id": "...", "name": "Footwear" },
  "brand": { "id": "...", "name": "Aether & Co." },
  "rating": 4.8,
  "review_count": 128,
  "stock": 24,
  "image_url": "https://...",
  "visual_tags": ["sneakers", "leather", "white", "minimalist"],
  "dominant_colors": [...],
  "features": [
    { "feature_name": "Upper Material", "feature_value": "Full-grain Italian Nappa" },
    { "feature_name": "Sole", "feature_value": "Vulcanized Natural Rubber" }
  ]
}
```
- **Response `404 Not Found`:**
```json
{
  "error": "PRODUCT_NOT_FOUND",
  "message": "Product with ID e674b880-9289-4bcf-a54f-c7c42738ea82 was not found"
}
```

---

### 2.4 Visually Similar Products
- **Method:** `GET`
- **Path:** `/api/v1/products/{id}/visually-similar`
- **Query Parameters:**
  - `limit` (int, default: 6, max: 20)
- **Response `200 OK`:**
```json
{
  "reference_product_id": "e674b880-9289-4bcf-a54f-c7c42738ea82",
  "matches": [
    {
      "product": { ... },
      "similarity_score": 0.94,
      "shared_visual_attributes": ["white", "minimalist", "sneakers"]
    }
  ]
}
```

---

### 2.5 Visual Search Upload
- **Method:** `POST`
- **Path:** `/api/v1/visual-search`
- **Headers:** `Content-Type: multipart/form-data`
- **Form Data:**
  - `file` (binary, required): Image file (JPEG, PNG, WEBP, <= 5MB)
  - `min_similarity` (float, optional, default: 0.40): Threshold for matching
  - `category_id` (UUID, optional): Restrict visual search to category
  - `limit` (int, optional, default: 12, max: 36)
- **Response `200 OK`:**
```json
{
  "query_analysis": {
    "dominant_colors": [
      { "hex": "#1b263b", "name": "Navy Blue", "ratio": 0.52 },
      { "hex": "#e0e1dd", "name": "Light Grey", "ratio": 0.31 }
    ],
    "detected_tags": ["jacket", "zipper", "outerwear", "dark"],
    "suggested_category": "Apparel & Outerwear"
  },
  "results": [
    {
      "product": { ... },
      "similarity_score": 0.89,
      "similarity_breakdown": {
        "color_similarity": 0.92,
        "texture_similarity": 0.85,
        "tag_overlap": 0.90
      }
    }
  ],
  "fallback_used": false,
  "total_matches": 8
}
```
- **Error Responses:**
  - `400 Bad Request`: Corrupted image or unsupported file format
  - `413 Payload Too Large`: Image file exceeds 5MB limit
  - `422 Unprocessable Entity`: Validation failure
