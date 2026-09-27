import React from 'react';
import { Search, SlidersHorizontal, Camera, ArrowRight } from 'lucide-react';

interface DiscoveryMethodsSectionProps {
  onSearchFocus: () => void;
  onOpenVisualSearch: () => void;
  onExploreFilters: () => void;
}

export const DiscoveryMethodsSection: React.FC<DiscoveryMethodsSectionProps> = ({
  onSearchFocus,
  onOpenVisualSearch,
  onExploreFilters,
}) => {
  return (
    <section className="bg-[#fafaf9] border-b border-zinc-200 py-16 sm:py-20">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-2xl mb-12 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Discovery Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
            Explore products your way
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            Three interconnected ways to discover items across our catalog, designed to work seamlessly together rather than in silos.
          </p>
        </div>

        {/* Sophisticated Editorial 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Method 1: Search */}
          <div className="flex flex-col justify-between p-6 rounded-lg bg-white border border-zinc-200 shadow-xs hover:border-zinc-300 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-900">
                  <Search className="h-4 w-4" />
                </div>
                <span className="text-xs font-mono text-zinc-400">01 / Method</span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-zinc-900">Search</h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Find products using natural text. Search across titles, designer brands, technical specifications, and materials.
                </p>
              </div>

              {/* Sample Queries Chips */}
              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-zinc-500">
                <span className="px-2 py-1 rounded bg-zinc-50 border border-zinc-200">
                  "waterproof shell"
                </span>
                <span className="px-2 py-1 rounded bg-zinc-50 border border-zinc-200">
                  "white leather"
                </span>
                <span className="px-2 py-1 rounded bg-zinc-50 border border-zinc-200">
                  "chronograph"
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 mt-6">
              <button
                type="button"
                onClick={onSearchFocus}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:text-zinc-600 transition-colors group"
              >
                <span>Try keyword search</span>
                <ArrowRight className="h-3 w-3 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Method 2: Filter */}
          <div className="flex flex-col justify-between p-6 rounded-lg bg-white border border-zinc-200 shadow-xs hover:border-zinc-300 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-900">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <span className="text-xs font-mono text-zinc-400">02 / Method</span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-zinc-900">Filter</h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Refine results by category, brand, price, and features. Use structured facets to narrow hundreds of items down to what fits.
                </p>
              </div>

              {/* Sample Facets */}
              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-zinc-500">
                <span className="px-2 py-1 rounded bg-zinc-50 border border-zinc-200">
                  Category: Footwear
                </span>
                <span className="px-2 py-1 rounded bg-zinc-50 border border-zinc-200">
                  Price: $100 - $250
                </span>
                <span className="px-2 py-1 rounded bg-zinc-50 border border-zinc-200">
                  Material: Nappa
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 mt-6">
              <button
                type="button"
                onClick={onExploreFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:text-zinc-600 transition-colors group"
              >
                <span>Browse structured filters</span>
                <ArrowRight className="h-3 w-3 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Method 3: Visual Search */}
          <div className="flex flex-col justify-between p-6 rounded-lg bg-white border border-zinc-200 shadow-xs hover:border-zinc-300 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-md bg-zinc-900 flex items-center justify-center text-white">
                  <Camera className="h-4 w-4" />
                </div>
                <span className="text-xs font-mono text-zinc-400">03 / Method</span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-zinc-900">Visual Search</h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Upload an image and discover visually related products. Matches color harmony, silhouette contour, and material taxonomy.
                </p>
              </div>

              {/* Visual Match Signals */}
              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-zinc-500">
                <span className="px-2 py-1 rounded bg-zinc-50 border border-zinc-200">
                  Palette extraction
                </span>
                <span className="px-2 py-1 rounded bg-zinc-50 border border-zinc-200">
                  dHash silhouette
                </span>
                <span className="px-2 py-1 rounded bg-zinc-50 border border-zinc-200">
                  Jaccard overlap
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 mt-6">
              <button
                type="button"
                onClick={onOpenVisualSearch}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:text-zinc-600 transition-colors group"
              >
                <span>Search by image</span>
                <ArrowRight className="h-3 w-3 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
