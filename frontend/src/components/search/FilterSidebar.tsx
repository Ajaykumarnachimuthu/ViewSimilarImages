import React from 'react';
import { RotateCcw, Filter, Check } from 'lucide-react';
import type { CatalogFacets, ProductFilterState } from '../../types/product';

interface FilterSidebarProps {
  facets: CatalogFacets | null;
  filters: ProductFilterState;
  onChangeFilter: (updates: Partial<ProductFilterState>) => void;
  onResetFilters: () => void;
  totalProductsCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  facets,
  filters,
  onChangeFilter,
  onResetFilters,
  totalProductsCount,
}) => {
  if (!facets) return null;

  const minPrice = filters.min_price !== undefined ? filters.min_price : facets.min_catalog_price;
  const maxPrice = filters.max_price !== undefined ? filters.max_price : facets.max_catalog_price;

  const handleBrandToggle = (brandId: string) => {
    if (filters.brand_id === brandId) {
      onChangeFilter({ brand_id: undefined, page: 1 });
    } else {
      onChangeFilter({ brand_id: brandId, page: 1 });
    }
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    if (currentTags.includes(tag)) {
      onChangeFilter({ tags: currentTags.filter((t) => t !== tag), page: 1 });
    } else {
      onChangeFilter({ tags: [...currentTags, tag], page: 1 });
    }
  };

  const hasActiveFilters = Boolean(
    filters.category_id ||
      filters.brand_id ||
      filters.min_price !== undefined ||
      filters.max_price !== undefined ||
      (filters.tags && filters.tags.length > 0) ||
      filters.q
  );

  return (
    <aside className="w-full lg:w-60 space-y-6 shrink-0 bg-white p-4 rounded-md border border-zinc-200">
      {/* Filters Title & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-1.5 text-zinc-900 font-semibold text-xs uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5 text-zinc-600" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Category Section */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Category</h4>
        <div className="space-y-0.5 text-xs">
          <button
            onClick={() => onChangeFilter({ category_id: undefined, page: 1 })}
            className={`w-full flex items-center justify-between px-2 py-1 rounded text-left transition-colors ${
              !filters.category_id
                ? 'font-semibold text-zinc-900 bg-zinc-100'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[10px] text-zinc-400 font-normal">{totalProductsCount}</span>
          </button>
          {facets.categories.map((cat) => {
            const isSelected = filters.category_id === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onChangeFilter({ category_id: isSelected ? undefined : cat.id, page: 1 })}
                className={`w-full flex items-center justify-between px-2 py-1 rounded text-left transition-colors ${
                  isSelected
                    ? 'font-semibold text-zinc-900 bg-zinc-100'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <span>{cat.name}</span>
                {isSelected && <Check className="h-3 w-3 text-zinc-800" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Section */}
      <div className="space-y-2.5 pt-3 border-t border-zinc-100">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Price</h4>
          <span className="text-xs font-semibold text-zinc-900">
            ${minPrice} — ${maxPrice}
          </span>
        </div>
        <div className="space-y-1.5">
          <input
            type="range"
            min={facets.min_catalog_price}
            max={facets.max_catalog_price}
            value={maxPrice}
            onChange={(e) => onChangeFilter({ max_price: Number(e.target.value), page: 1 })}
            className="w-full h-1 bg-zinc-200 rounded appearance-none cursor-pointer accent-zinc-900"
          />
          <div className="flex items-center justify-between text-[10px] text-zinc-400">
            <span>Min: ${facets.min_catalog_price}</span>
            <span>Max: ${facets.max_catalog_price}</span>
          </div>
        </div>
      </div>

      {/* Brand Section */}
      <div className="space-y-2 pt-3 border-t border-zinc-100">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Brand</h4>
        <div className="space-y-1 text-xs">
          {facets.brands.map((b) => {
            const isChecked = filters.brand_id === b.id;
            return (
              <label
                key={b.id}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-zinc-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleBrandToggle(b.id)}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 h-3.5 w-3.5 accent-zinc-900"
                />
                <span className={isChecked ? 'font-medium text-zinc-900' : 'text-zinc-600'}>
                  {b.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Visual Attribute Tags */}
      {facets.available_tags && facets.available_tags.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-zinc-100">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Attributes
          </h4>
          <div className="flex flex-wrap gap-1">
            {facets.available_tags.map((tag) => {
              const isActive = (filters.tags || []).includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    isActive
                      ? 'bg-zinc-900 text-white font-medium'
                      : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};
