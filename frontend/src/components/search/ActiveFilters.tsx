import React from 'react';
import { X, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import type { Brand, Category, ProductFilterState } from '../../types/product';

interface ActiveFiltersProps {
  filters: ProductFilterState;
  categories: Category[];
  brands: Brand[];
  totalResults: number;
  onChangeFilter: (updates: Partial<ProductFilterState>) => void;
  onClearAll: () => void;
  onToggleMobileFilters?: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  categories,
  brands,
  totalResults,
  onChangeFilter,
  onClearAll,
  onToggleMobileFilters,
}) => {
  const selectedCategory = categories.find((c) => c.id === filters.category_id);
  const selectedBrand = brands.find((b) => b.id === filters.brand_id);

  const hasAnyFilter = Boolean(
    filters.q ||
      selectedCategory ||
      selectedBrand ||
      filters.max_price !== undefined ||
      (filters.tags && filters.tags.length > 0)
  );

  return (
    <div className="space-y-3 mb-6 w-full">
      {/* Result Count, Filters and Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
            {totalResults} {totalResults === 1 ? 'Product' : 'Products'}
          </span>

          {hasAnyFilter && <div className="h-3 w-[1px] bg-zinc-300 mx-1 hidden sm:block" />}

          {/* Query Filter */}
          {filters.q && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-100 text-xs text-zinc-800 font-medium">
              <span>"{filters.q}"</span>
              <button
                type="button"
                onClick={() => onChangeFilter({ q: '' })}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Category Filter */}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-100 text-xs text-zinc-800 font-medium">
              <span>{selectedCategory.name}</span>
              <button
                type="button"
                onClick={() => onChangeFilter({ category_id: undefined })}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Brand Filter */}
          {selectedBrand && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-100 text-xs text-zinc-800 font-medium">
              <span>{selectedBrand.name}</span>
              <button
                type="button"
                onClick={() => onChangeFilter({ brand_id: undefined })}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Price Range */}
          {filters.max_price !== undefined && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-100 text-xs text-zinc-800 font-medium">
              <span>Max: ${filters.max_price}</span>
              <button
                type="button"
                onClick={() => onChangeFilter({ max_price: undefined })}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Tags */}
          {filters.tags &&
            filters.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-100 text-xs text-zinc-800 font-medium"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() =>
                    onChangeFilter({
                      tags: filters.tags?.filter((t) => t !== tag),
                    })
                  }
                  className="text-zinc-400 hover:text-zinc-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

          {/* Clear All */}
          {hasAnyFilter && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-zinc-500 hover:text-zinc-900 font-medium underline underline-offset-4 ml-1 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Controls: Mobile Filter Button + Sort Dropdown */}
        <div className="flex items-center gap-2.5 shrink-0 justify-between sm:justify-end w-full sm:w-auto">
          {onToggleMobileFilters && (
            <button
              type="button"
              onClick={onToggleMobileFilters}
              className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-xs"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-500" />
              <span>Filters</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-3 w-3 text-zinc-400" />
            <label htmlFor="sort_by" className="text-xs text-zinc-500 font-medium">
              Sort:
            </label>
            <select
              id="sort_by"
              value={filters.sort_by}
              onChange={(e) =>
                onChangeFilter({
                  sort_by: e.target.value as ProductFilterState['sort_by'],
                  page: 1,
                })
              }
              className="bg-white border border-zinc-200 text-zinc-800 text-xs rounded px-2.5 py-1 focus:outline-none focus:border-zinc-400 font-medium cursor-pointer"
            >
              <option value="newest">Featured / Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
