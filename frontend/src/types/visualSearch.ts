import type { ColorSwatch, Product } from './product';

export interface SimilarityBreakdown {
  color_similarity: number;
  structure_similarity: number;
  tag_overlap: number;
}

export interface VisualQueryAnalysis {
  dominant_colors: ColorSwatch[];
  detected_tags: string[];
  suggested_category?: string;
  aspect_ratio?: number;
}

export interface VisualSearchResultItem {
  product: Product;
  similarity_score: number;
  similarity_breakdown: SimilarityBreakdown;
  shared_visual_attributes: string[];
}

export interface VisualSearchResponse {
  query_analysis: VisualQueryAnalysis;
  results: VisualSearchResultItem[];
  fallback_used: boolean;
  fallback_message?: string;
  total_matches: number;
}
