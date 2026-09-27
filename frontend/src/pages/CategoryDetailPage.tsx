import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';
import type { CatalogFacets, Category, Product, ProductFilterState } from '../types/product';
import { productService } from '../services/api';
import { FilterSidebar } from '../components/search/FilterSidebar';
import { ActiveFilters } from '../components/search/ActiveFilters';
import { ProductGrid } from '../components/product/ProductGrid';

export const CategoryDetailPage: React.FC = () => {
  const { category: categorySlug } = useParams<{ category: string }>();

  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [facets, setFacets] = useState<CatalogFacets | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<ProductFilterState>({
    q: '',
    tags: [],
    sort_by: 'newest',
    page: 1,
    page_size: 12,
  });

  // Load facets and find category
  useEffect(() => {
    productService
      .getFacets()
      .then((data) => {
        setFacets(data);
        const match = data.categories.find((c) => c.slug === categorySlug);
        if (match) {
          setCurrentCategory(match);
          setFilters((prev) => ({ ...prev, category_id: match.id, page: 1 }));
        }
      })
      .catch((err) => console.error('Failed to load facets:', err));
  }, [categorySlug]);

  // Fetch products for current category
  const fetchCategoryProducts = useCallback(async () => {
    if (!filters.category_id) return;

    setIsLoading(true);
    try {
      const data = await productService.getProducts(filters);
      setProducts(data.items);
      setTotalCount(data.total);
    } catch (err) {
      console.error('Failed to load category products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCategoryProducts();
  }, [fetchCategoryProducts]);

  const handleFilterChange = (updates: Partial<ProductFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    if (!currentCategory) return;
    setFilters({
      category_id: currentCategory.id,
      q: '',
      tags: [],
      sort_by: 'newest',
      page: 1,
      page_size: 12,
    });
  };

  return (
    <div className="w-full bg-[#fafaf9] py-8 sm:py-12">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Link to="/" className="hover:text-zinc-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-zinc-400" />
          <Link to="/categories" className="hover:text-zinc-900 transition-colors">
            Categories
          </Link>
          <ChevronRight className="h-3 w-3 text-zinc-400" />
          <span className="font-semibold text-zinc-900">
            {currentCategory?.name || 'Department'}
          </span>
        </nav>

        {/* Category Header */}
        <div className="pb-4 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
              {currentCategory?.name || 'Category Products'}
            </h1>
            <p className="text-sm text-zinc-600 max-w-2xl">
              {currentCategory?.description ||
                'Verified manufacturers and precision product discovery.'}
            </p>
          </div>
          <span className="text-xs text-zinc-500 font-mono shrink-0">
            {totalCount} products available
          </span>
        </div>

        {/* Layout: Desktop Filter Sidebar + Product Grid */}
        <div className="pt-2 flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block shrink-0">
            <FilterSidebar
              facets={facets}
              filters={filters}
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
                  filters={filters}
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
              filters={filters}
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
            {totalCount > (filters.page_size || 12) && (
              <div className="pt-8 flex items-center justify-between border-t border-zinc-200 text-xs">
                <span className="text-zinc-500">
                  Showing {(filters.page! - 1) * (filters.page_size || 12) + 1} to{' '}
                  {Math.min(filters.page! * (filters.page_size || 12), totalCount)} of {totalCount} products
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={filters.page === 1}
                    onClick={() => handleFilterChange({ page: (filters.page || 1) - 1 })}
                    className="px-3 py-1.5 rounded border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={filters.page! * (filters.page_size || 12) >= totalCount}
                    onClick={() => handleFilterChange({ page: (filters.page || 1) + 1 })}
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

export default CategoryDetailPage;
