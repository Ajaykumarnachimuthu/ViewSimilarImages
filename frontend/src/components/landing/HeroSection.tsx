import React from 'react';
import { Camera, Search, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  searchInput: string;
  onSearchInputChange: (val: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onOpenVisualSearch: () => void;
  onScrollToCatalog: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  onOpenVisualSearch,
  onScrollToCatalog,
}) => {
  return (
    <section className="relative bg-white border-b border-zinc-200 overflow-hidden">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column: Core Positioning & Search Input */}
          <div className="lg:col-span-7 space-y-6 max-w-2xl xl:max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-medium text-zinc-700">
              <span className="flex h-1.5 w-1.5 rounded-full bg-zinc-900" />
              <span>Visual Product Discovery Engine</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.08]">
                Find products by what you see.
              </h1>
              <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-xl xl:max-w-2xl">
                Find what you're looking for — even when you don't know what it's called. Search by text, explore categories, or upload an image to discover visually similar products.
              </p>
            </div>

            {/* Prominent Search Component */}
            <div className="pt-2 space-y-3 max-w-xl xl:max-w-2xl">
              <form onSubmit={onSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search products, brands, categories..."
                    value={searchInput}
                    onChange={(e) => onSearchInputChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-zinc-300 text-sm placeholder-zinc-400 focus:outline-none focus:border-zinc-900 bg-white transition-colors shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm transition-colors shadow-subtle flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Search Products</span>
                </button>
              </form>

              {/* Secondary Visual Search Entry (Natural Extension) */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-zinc-600">
                <span className="text-zinc-500">or</span>
                <span className="font-medium text-zinc-900">Search with an image</span>
                <button
                  type="button"
                  onClick={onOpenVisualSearch}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-300 text-zinc-800 hover:bg-zinc-100 hover:border-zinc-400 font-medium transition-colors bg-white shadow-xs"
                >
                  <Camera className="h-3.5 w-3.5 text-zinc-700" />
                  <span>Upload Image</span>
                </button>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onScrollToCatalog}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onOpenVisualSearch}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-zinc-300 hover:border-zinc-400 bg-white text-zinc-800 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <Camera className="h-3.5 w-3.5 text-zinc-600" />
                <span>Search by Image</span>
              </button>
            </div>
          </div>

          {/* Right Column: Realistic Product-Discovery Composition */}
          <div className="lg:col-span-5 relative w-full max-w-full">
            <div className="p-4 sm:p-5 rounded-lg border border-zinc-200 bg-zinc-50/80 space-y-4 overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-zinc-900 uppercase tracking-wider text-[11px]">
                    Visual Discovery Concept
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono">1 image → 3 discoveries</span>
              </div>

              {/* Reference Product Card */}
              <div className="flex items-center gap-3 sm:gap-4 p-3 rounded-md bg-white border border-zinc-200 shadow-xs min-w-0 overflow-hidden">
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80"
                    alt="Reference athletic sneaker"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-zinc-900/80 text-white text-[9px] font-medium backdrop-blur-xs">
                    Input
                  </span>
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Query Image
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-900 truncate">
                    Air Performance Crimson Runner
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 truncate">
                    <span className="truncate">Extracted: Crimson, Mesh, Low-top</span>
                  </div>
                </div>
              </div>

              {/* Similarity Connection Indicator */}
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 py-1 font-mono">
                <span className="h-px bg-zinc-300 w-8 sm:w-12" />
                <span className="text-[10px] sm:text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                  Similar Discoveries
                </span>
                <span className="h-px bg-zinc-300 w-8 sm:w-12" />
              </div>

              {/* Discovered Similar Products Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {/* Result 1 */}
                <div className="p-1.5 sm:p-2 rounded-md bg-white border border-zinc-200 text-left space-y-1 sm:space-y-1.5 shadow-xs min-w-0">
                  <div className="aspect-[4/5] w-full rounded overflow-hidden bg-zinc-100">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80"
                      alt="Match 1"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px]">
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
                      94% match
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] font-medium text-zinc-900 truncate">Crimson Runner</p>
                  <p className="text-[9px] sm:text-[10px] text-zinc-500">$140.00</p>
                </div>

                {/* Result 2 */}
                <div className="p-1.5 sm:p-2 rounded-md bg-white border border-zinc-200 text-left space-y-1 sm:space-y-1.5 shadow-xs min-w-0">
                  <div className="aspect-[4/5] w-full rounded overflow-hidden bg-zinc-100">
                    <img
                      src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80"
                      alt="Match 2"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px]">
                    <span className="font-semibold text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded border border-indigo-200">
                      84% match
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] font-medium text-zinc-900 truncate">Leather Sneaker</p>
                  <p className="text-[9px] sm:text-[10px] text-zinc-500">$165.00</p>
                </div>

                {/* Result 3 */}
                <div className="p-1.5 sm:p-2 rounded-md bg-white border border-zinc-200 text-left space-y-1 sm:space-y-1.5 shadow-xs min-w-0">
                  <div className="aspect-[4/5] w-full rounded overflow-hidden bg-zinc-100">
                    <img
                      src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=400&q=80"
                      alt="Match 3"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px]">
                    <span className="font-semibold text-zinc-700 bg-zinc-100 px-1 py-0.5 rounded border border-zinc-200">
                      78% match
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] font-medium text-zinc-900 truncate">Chrono Steel</p>
                  <p className="text-[9px] sm:text-[10px] text-zinc-500">$385.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
