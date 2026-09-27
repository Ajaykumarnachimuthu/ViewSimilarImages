import axios from 'axios';
import type {
  Brand,
  Category,
  CatalogFacets,
  PaginatedProducts,
  ProductDetail,
  ProductFilterState,
} from '../types/product';
import type { VisualSearchResponse } from '../types/visualSearch';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export const productService = {
  async getProducts(filters: Partial<ProductFilterState>): Promise<PaginatedProducts> {
    const params: Record<string, any> = {
      page: filters.page || 1,
      page_size: filters.page_size || 12,
      sort_by: filters.sort_by || 'newest',
    };

    if (filters.q?.trim()) params.q = filters.q.trim();
    if (filters.category_id) params.category_id = filters.category_id;
    if (filters.brand_id) params.brand_id = filters.brand_id;
    if (filters.min_price !== undefined) params.min_price = filters.min_price;
    if (filters.max_price !== undefined) params.max_price = filters.max_price;
    if (filters.tags && filters.tags.length > 0) params.tags = filters.tags.join(',');

    const response = await apiClient.get<PaginatedProducts>('/products', { params });
    return response.data;
  },

  async getProductDetail(id: string): Promise<ProductDetail> {
    const response = await apiClient.get<ProductDetail>(`/products/${id}`);
    return response.data;
  },

  async getVisuallySimilar(id: string, limit: number = 6): Promise<any> {
    const response = await apiClient.get(`/products/${id}/visually-similar`, {
      params: { limit },
    });
    return response.data;
  },

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  async getBrands(): Promise<Brand[]> {
    const response = await apiClient.get<Brand[]>('/brands');
    return response.data;
  },

  async getFacets(): Promise<CatalogFacets> {
    const response = await apiClient.get<CatalogFacets>('/products/facets');
    return response.data;
  },
};

export const visualSearchService = {
  async searchByImage(
    file: File,
    minSimilarity?: number,
    categoryId?: string,
    limit: number = 12
  ): Promise<VisualSearchResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (minSimilarity !== undefined) formData.append('min_similarity', String(minSimilarity));
    if (categoryId) formData.append('category_id', categoryId);
    formData.append('limit', String(limit));

    const response = await apiClient.post<VisualSearchResponse>('/visual-search', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
