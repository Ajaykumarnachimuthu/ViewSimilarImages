import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, Search, X } from 'lucide-react';
import type { CatalogFacets, Product, ProductFilterState } from '../types/product';
import { productService } from '../services/api';
import { FilterSidebar } from '../components/search/FilterSidebar';
import { ActiveFilters } from '../components/search/ActiveFilters';
import { ProductGrid } from '../components/product/ProductGrid';

export const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [facets, setFacets] = useState<CatalogFacets | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<ProductFilterState>({
    q: '',
    tags: [],
    sort_by: 'newest',
    page: 1,
    page_size: 12,
  });

  // Load facets once
  useEffect(() => {
    productService
      .getFacets()
      .then((data) => setFacets(data))
      .catch((err) => console.error('Failed to load facets:', err));
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await productService.getProducts(filters);
      setProducts(data.items);
      setTotalCount(data.total);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (updates: Partial<ProductFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      q: '',
      tags: [],
      sort_by: 'newest',
      page: 1,
      page_size: 12,
    });
    setSearchInput('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="w-full bg-[#fafaf9] py-8 sm:py-12">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-8">
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl xl:max-w-4xl">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
              Discover products
            </h1>
            <p className="text-sm sm:text-base text-zinc-600">
              Explore products across verified departments or search for something specific using text or images.
            </p>
          </div>

          {/* Large Discover Search Bar with Integrated Camera Action */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center max-w-2xl xl:max-w-3xl pt-2">
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

          {/* Quick Department Shortcuts */}
          {facets && facets.categories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none text-xs">
              <span className="text-zinc-400 font-medium shrink-0">Popular:</span>
              {facets.categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="px-2.5 py-1 rounded-md bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:text-zinc-900 shrink-0 transition-colors shadow-xs"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Discovery Catalog Layout: Left Filter Sidebar + Product Grid */}
        <div className="pt-4 flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Left Sidebar */}
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

export default DiscoverPage;
