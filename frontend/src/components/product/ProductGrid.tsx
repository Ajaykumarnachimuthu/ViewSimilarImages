import React from 'react';
import type { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import type { VisualSearchResultItem } from '../../types/visualSearch';

interface ProductGridProps {
  products: Product[];
  visualMatches?: VisualSearchResultItem[];
  isLoading: boolean;
  onSelectProduct?: (product: Product) => void;
  onFindSimilar?: (product: Product) => void;
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  visualMatches,
  isLoading,
  onSelectProduct,
  onFindSimilar,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // If in Visual Search Mode
  if (visualMatches && visualMatches.length > 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {visualMatches.map((item) => (
          <ProductCard
            key={item.product.id}
            product={item.product}
            similarityScore={item.similarity_score}
            similarityBreakdown={item.similarity_breakdown}
            sharedAttributes={item.shared_visual_attributes}
            onClick={onSelectProduct ? () => onSelectProduct(item.product) : undefined}
            onFindSimilar={onFindSimilar}
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyState onReset={onResetFilters} />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onSelectProduct ? () => onSelectProduct(product) : undefined}
          onFindSimilar={onFindSimilar}
        />
      ))}
    </div>
  );
};
