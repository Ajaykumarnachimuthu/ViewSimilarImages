import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../../types/product';
import { ProductCard } from '../product/ProductCard';

interface FeaturedProductsSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onFindSimilar: (product: Product) => void;
  onViewAllCatalog: () => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  products,
  onSelectProduct,
  onFindSimilar,
  onViewAllCatalog,
}) => {
  // Show up to 8 featured or diverse products
  const displayProducts = products.slice(0, 8);

  return (
    <section className="bg-[#fafaf9] border-b border-zinc-200 py-16 sm:py-24">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Curated Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
              Discover what's worth looking at
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 max-w-xl xl:max-w-2xl">
              A curated selection from our verified product index. Click any item to inspect specifications or discover visually similar alternatives.
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAllCatalog}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-900 hover:text-zinc-600 transition-colors shrink-0 group"
          >
            <span>Explore full catalog</span>
            <ArrowRight className="h-3.5 w-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 4-column desktop, 3-column tablet, 2-column mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onSelectProduct(product)}
              onFindSimilar={onFindSimilar}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
