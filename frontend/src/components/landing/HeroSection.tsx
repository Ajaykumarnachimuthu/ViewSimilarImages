import React from 'react';
import { Camera, Search, ArrowRight } from 'lucide-react';
import type { Product } from '../../types/product';

interface HeroSectionProps {
  searchInput: string;
  onSearchInputChange: (val: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onOpenVisualSearch: () => void;
  onScrollToCatalog: () => void;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  onOpenVisualSearch,
  onScrollToCatalog,
  products = [],
  onSelectProduct,
}) => {
  // Use first product as the reference and next 3 as discoveries if available
  const hasDynamicProducts = products.length >= 4;
  const refProduct = hasDynamicProducts ? products[0] : null;
  const matchProducts = hasDynamicProducts ? products.slice(1, 4) : [];

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
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 leading-[1.08]">
                Find the exact product you're looking for. By image or word.
              </h1>
              <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-xl">
                Bridge the gap between visual inspiration and commerce. Upload any photo, screenshot, or product link to instantly discover visually matching items, precise specifications, and verified pricing.
              </p>
            </div>

            {/* Direct Dual Search Interface */}
            <form onSubmit={onSearchSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => onSearchInputChange(e.target.value)}
                    placeholder="Search keywords, SKU, categories, or brands..."
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-zinc-300 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
                >
                  Search
                </button>
              </div>

              {/* Keyword quick filters */}
              <div className="flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
                <span className="font-medium text-zinc-600">Quick Searches:</span>
                {['Running Shoes', 'Minimalist Watch', 'Wireless Headphones', 'Desk Lamp'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      onSearchInputChange(tag);
                    }}
                    className="px-2.5 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>

            {/* Quick Action Navigation */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
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

          {/* Right Column: Dynamic Realistic Product-Discovery Composition */}
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
              <div
                onClick={() => refProduct && onSelectProduct && onSelectProduct(refProduct)}
                className={`flex items-center gap-3 sm:gap-4 p-3 rounded-md bg-white border border-zinc-200 shadow-xs min-w-0 overflow-hidden ${
                  refProduct ? 'cursor-pointer hover:border-zinc-300 transition-colors' : ''
                }`}
              >
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                  <img
                    src={
                      refProduct
                        ? refProduct.image_url
                        : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={refProduct ? refProduct.title : 'Reference athletic sneaker'}
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
                    {refProduct ? refProduct.title : 'Air Performance Crimson Runner'}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 truncate">
                    <span className="truncate">
                      {refProduct && refProduct.visual_tags?.length
                        ? `Tags: ${refProduct.visual_tags.slice(0, 3).join(', ')}`
                        : 'Extracted: Crimson, Mesh, Low-top'}
                    </span>
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
                {(hasDynamicProducts
                  ? matchProducts
                  : [
                      {
                        id: 's1',
                        title: 'Crimson Runner',
                        price: 140,
                        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
                        match: '94%',
                        badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
                      },
                      {
                        id: 's2',
                        title: 'Leather Sneaker',
                        price: 165,
                        image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80',
                        match: '84%',
                        badgeClass: 'text-indigo-700 bg-indigo-50 border-indigo-200',
                      },
                      {
                        id: 's3',
                        title: 'Chrono Steel',
                        price: 385,
                        image_url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=400&q=80',
                        match: '78%',
                        badgeClass: 'text-zinc-700 bg-zinc-100 border-zinc-200',
                      },
                    ]
                ).map((item, idx) => {
                  const matchScores = ['94%', '87%', '81%'];
                  const badgeClasses = [
                    'text-emerald-700 bg-emerald-50 border-emerald-200',
                    'text-indigo-700 bg-indigo-50 border-indigo-200',
                    'text-zinc-700 bg-zinc-100 border-zinc-200',
                  ];
                  const score = 'match' in item ? (item as any).match : matchScores[idx] || '85%';
                  const badgeCls = 'badgeClass' in item ? (item as any).badgeClass : badgeClasses[idx];

                  return (
                    <div
                      key={item.id}
                      onClick={() => hasDynamicProducts && onSelectProduct && onSelectProduct(item as Product)}
                      className={`p-1.5 sm:p-2 rounded-md bg-white border border-zinc-200 text-left space-y-1 sm:space-y-1.5 shadow-xs min-w-0 ${
                        hasDynamicProducts ? 'cursor-pointer hover:border-zinc-300 transition-colors' : ''
                      }`}
                    >
                      <div className="aspect-[4/5] w-full rounded overflow-hidden bg-zinc-100">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[9px] sm:text-[10px]">
                        <span className={`font-semibold px-1 py-0.5 rounded border ${badgeCls}`}>
                          {score} match
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] font-medium text-zinc-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-zinc-500">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
