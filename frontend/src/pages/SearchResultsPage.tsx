import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Camera, X } from 'lucide-react';
import type { CatalogFacets, Product, ProductFilterState } from '../types/product';
import { productService } from '../services/api';
import { FilterSidebar } from '../components/search/FilterSidebar';
import { ActiveFilters } from '../components/search/ActiveFilters';
import { ProductGrid } from '../components/product/ProductGrid';

export const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL State
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category_id') || undefined;
  const brandParam = searchParams.get('brand_id') || undefined;
  const minPriceParam = searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined;
  const maxPriceParam = searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined;
  const tagsParamRaw = searchParams.get('tags') || '';
  const tagsParam = React.useMemo(
    () => (tagsParamRaw ? tagsParamRaw.split(',').filter(Boolean) : []),
    [tagsParamRaw]
  );
  const sortByParam = searchParams.get('sort_by') || 'newest';
  const pageParam = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  // Local state for search bar input
  const [searchInput, setSearchInput] = useState<string>(queryParam);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [facets, setFacets] = useState<CatalogFacets | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  // Sync search input when URL changes
  useEffect(() => {
    setSearchInput(queryParam);
  }, [queryParam]);

  // Load facets once
  useEffect(() => {
    productService
      .getFacets()
      .then((data) => setFacets(data))
      .catch((err) => console.error('Failed to load facets:', err));
  }, []);

  // Fetch products matching URL search params
  const fetchSearchResults = useCallback(async () => {
    setIsLoading(true);
    const filterState: Partial<ProductFilterState> = {
      q: queryParam,
      category_id: categoryParam,
      brand_id: brandParam,
      min_price: minPriceParam,
      max_price: maxPriceParam,
      tags: tagsParam,
      sort_by: sortByParam as any,
      page: pageParam,
      page_size: 12,
    };

    try {
      const data = await productService.getProducts(filterState);
      setProducts(data.items);
      setTotalCount(data.total);
    } catch (err) {
      console.error('Failed to load search results:', err);
    } finally {
      setIsLoading(false);
    }
  }, [queryParam, categoryParam, brandParam, minPriceParam, maxPriceParam, tagsParamRaw, sortByParam, pageParam]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  // Update URL Search Parameters
  const updateUrlParams = (updates: Record<string, string | undefined | null>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === null || val === '') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, val);
      }
    });
    setSearchParams(nextParams);
  };

  const handleFilterChange = (updates: Partial<ProductFilterState>) => {
    const urlUpdates: Record<string, string | undefined | null> = {};

    if ('q' in updates) urlUpdates.q = updates.q || null;
    if ('category_id' in updates) urlUpdates.category_id = updates.category_id || null;
    if ('brand_id' in updates) urlUpdates.brand_id = updates.brand_id || null;
    if ('min_price' in updates) urlUpdates.min_price = updates.min_price !== undefined ? String(updates.min_price) : null;
    if ('max_price' in updates) urlUpdates.max_price = updates.max_price !== undefined ? String(updates.max_price) : null;
    if ('tags' in updates) urlUpdates.tags = updates.tags && updates.tags.length > 0 ? updates.tags.join(',') : null;
    if ('sort_by' in updates) urlUpdates.sort_by = updates.sort_by || 'newest';
    if ('page' in updates) urlUpdates.page = String(updates.page || 1);

    updateUrlParams(urlUpdates);
  };

  const handleResetFilters = () => {
    setSearchParams({ q: queryParam });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ q: searchInput.trim(), page: '1' });
  };

  // Convert current URL params into ProductFilterState for reusable components
  const currentFilters: ProductFilterState = {
    q: queryParam,
    category_id: categoryParam,
    brand_id: brandParam,
    min_price: minPriceParam,
    max_price: maxPriceParam,
    tags: tagsParam,
    sort_by: sortByParam as any,
    page: pageParam,
    page_size: 12,
  };

  return (
    <div className="w-full bg-[#fafaf9] py-8 sm:py-12">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-6">
        {/* Search Header Bar */}
        <div className="space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center max-w-2xl xl:max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-24 py-3 rounded-l-md border border-r-0 border-zinc-300 text-sm placeholder-zinc-400 focus:outline-none focus:border-zinc-900 bg-white transition-colors shadow-xs"
              />
              <Link
                to="/visual-search"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors"
                title="Search by image"
              >
                <Camera className="h-4 w-4" />
              </Link>
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-r-md bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm transition-colors shadow-subtle shrink-0"
            >
              Search
            </button>
          </form>

          {/* Result Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-zinc-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
                {queryParam ? `Search results for "${queryParam}"` : 'All catalog products'}
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                {totalCount} {totalCount === 1 ? 'product' : 'products'} available in index
              </p>
            </div>
          </div>
        </div>

        {/* Layout: Desktop Filter Sidebar + Product Grid */}
        <div className="pt-2 flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block shrink-0">
            <FilterSidebar
              facets={facets}
              filters={currentFilters}
              onChangeFilter={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalProductsCount={totalCount}
            />
          </div>

          {/* Mobile Filter Drawer Overlay */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div
                className="fixed inset-0 bg-zinc-900/50 backdrop-blur-xs"
                onClick={() => setIsMobileFiltersOpen(false)}
              />
              <div className="relative w-80 max-w-[85vw] h-full bg-white p-5 overflow-y-auto z-10 space-y-5 shadow-modal">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <span className="font-semibold text-xs uppercase tracking-wider text-zinc-900">
                    Filters
                  </span>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <FilterSidebar
                  facets={facets}
                  filters={currentFilters}
                  onChangeFilter={handleFilterChange}
                  onResetFilters={handleResetFilters}
                  totalProductsCount={totalCount}
                />
              </div>
            </div>
          )}

          {/* Main Product Grid Column */}
          <div className="flex-1 w-full space-y-4">
            <ActiveFilters
              filters={currentFilters}
              categories={facets?.categories || []}
              brands={facets?.brands || []}
              totalResults={totalCount}
              onChangeFilter={handleFilterChange}
              onClearAll={handleResetFilters}
              onToggleMobileFilters={() => setIsMobileFiltersOpen(true)}
            />

            <ProductGrid
              products={products}
              isLoading={isLoading}
              onResetFilters={handleResetFilters}
            />

            {/* Pagination Controls */}
            {totalCount > (currentFilters.page_size || 12) && (
              <div className="pt-8 flex items-center justify-between border-t border-zinc-200 text-xs">
                <span className="text-zinc-500">
                  Showing {(currentFilters.page! - 1) * (currentFilters.page_size || 12) + 1} to{' '}
                  {Math.min(currentFilters.page! * (currentFilters.page_size || 12), totalCount)} of {totalCount} products
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentFilters.page === 1}
                    onClick={() => handleFilterChange({ page: (currentFilters.page || 1) - 1 })}
                    className="px-3 py-1.5 rounded border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={currentFilters.page! * (currentFilters.page_size || 12) >= totalCount}
                    onClick={() => handleFilterChange({ page: (currentFilters.page || 1) + 1 })}
                    className="px-3 py-1.5 rounded border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
