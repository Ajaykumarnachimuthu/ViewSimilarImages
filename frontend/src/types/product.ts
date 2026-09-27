export interface ColorSwatch {
  hex: string;
  name: string;
  ratio: number;
}

export interface ProductFeature {
  feature_name: string;
  feature_value: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parent_id?: string;
  product_count?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  category_id: string;
  brand_id: string;
  category?: Category;
  brand?: Brand;
  rating: number;
  review_count: number;
  stock: number;
  image_url: string;
  thumbnail_url?: string;
  is_featured: boolean;
  visual_tags: string[];
  dominant_colors: ColorSwatch[];
}

export interface ProductDetail extends Product {
  features: ProductFeature[];
}

export interface CatalogFacets {
  min_catalog_price: number;
  max_catalog_price: number;
  available_tags: string[];
  categories: Category[];
  brands: Brand[];
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ProductFilterState {
  q: string;
  category_id?: string;
  brand_id?: string;
  min_price?: number;
  max_price?: number;
  tags: string[];
  sort_by: 'newest' | 'price_asc' | 'price_desc' | 'rating_desc';
  page: number;
  page_size: number;
}
