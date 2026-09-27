import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { Category } from '../../types/product';

interface CategoryDiscoverySectionProps {
  categories: Category[];
  onSelectCategory: (id: string) => void;
}

const CATEGORY_IMAGES: Record<string, string> = {
  footwear: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
  'outerwear-apparel': 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80',
  'electronics-audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  'watches-accessories': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
  'home-living': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
};

const CATEGORY_COUNTS: Record<string, string> = {
  footwear: '12 products',
  'outerwear-apparel': '8 products',
  'electronics-audio': '6 products',
  'watches-accessories': '10 products',
  'home-living': '8 products',
};

export const CategoryDiscoverySection: React.FC<CategoryDiscoverySectionProps> = ({
  categories,
  onSelectCategory,
}) => {
  return (
    <section className="bg-white border-b border-zinc-200 py-16 sm:py-24">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Department Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
              Browse by category
            </h2>
            <p className="text-sm sm:text-base text-zinc-600">
              Curated departments featuring verified manufacturers and high-resolution catalog imagery.
            </p>
          </div>
        </div>

        {/* Clean Editorial Grid with Real Photography */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const imgSrc = CATEGORY_IMAGES[cat.slug] || CATEGORY_IMAGES.footwear;
            const countText = CATEGORY_COUNTS[cat.slug] || '8 products';

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className="group flex flex-col rounded-lg border border-zinc-200 overflow-hidden bg-white text-left hover:border-zinc-300 hover:shadow-subtle transition-all duration-200"
              >
                {/* Image Container with 4:3 Ratio */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 relative">
                  <img
                    src={imgSrc}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-mono">{countText}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
