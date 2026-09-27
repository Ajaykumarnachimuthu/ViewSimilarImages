import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import type { Product } from '../../types/product';
import { productService } from '../../services/api';
import { ProductCard } from './ProductCard';

interface SimilarProductsProps {
  productId: string;
  limit?: number;
  onFindSimilar?: (product: Product) => void;
}

export const SimilarProducts: React.FC<SimilarProductsProps> = ({
  productId,
  limit = 4,
  onFindSimilar,
}) => {
  const [similarItems, setSimilarItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    productService
      .getVisuallySimilar(productId, limit)
      .then((data) => {
        if (isMounted) {
          setSimilarItems(data.matches || []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load similar products:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [productId, limit]);

  if (isLoading) {
    return (
      <div className="space-y-4 pt-12 border-t border-zinc-200">
        <div className="h-6 w-48 bg-zinc-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[4/5] bg-zinc-100 rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (similarItems.length === 0) return null;

  return (
    <div className="space-y-6 pt-12 border-t border-zinc-200">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-zinc-500" />
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">
              Visually Similar Products
            </h2>
          </div>
          <p className="text-xs text-zinc-500">
            Recommendations ranked by color harmony, geometric silhouette, and material taxonomy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {similarItems.map((item) => (
          <ProductCard
            key={item.product.id}
            product={item.product}
            similarityScore={item.similarity_score}
            similarityBreakdown={item.breakdown}
            sharedAttributes={item.shared_attributes}
            onFindSimilar={onFindSimilar}
          />
        ))}
      </div>
    </div>
  );
};
