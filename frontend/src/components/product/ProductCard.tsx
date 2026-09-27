import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Camera } from 'lucide-react';
import type { Product } from '../../types/product';
import { SimilarityBadge } from '../common/Badge';
import type { SimilarityBreakdown } from '../../types/visualSearch';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  onFindSimilar?: (product: Product) => void;
  similarityScore?: number;
  similarityBreakdown?: SimilarityBreakdown;
  sharedAttributes?: string[];
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  onFindSimilar,
  similarityScore,
  similarityBreakdown,
  sharedAttributes,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const handleSimilarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFindSimilar) {
      onFindSimilar(product);
    } else {
      navigate(`/visual-search?image=${encodeURIComponent(product.image_url)}&name=${encodeURIComponent(product.title)}`);
    }
  };

  const discountPercent =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null;

  return (
    <article className="group relative flex flex-col bg-white border border-zinc-200 rounded-md overflow-hidden hover:border-zinc-300 hover:shadow-card transition-subtle">
      {/* Visual Match Badge (If in Visual Search Mode) */}
      {similarityScore !== undefined && (
        <div className="absolute top-2.5 left-2.5 z-10">
          <SimilarityBadge score={similarityScore} size="sm" />
        </div>
      )}

      {/* Discount Badge */}
      {discountPercent && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-white text-[10px] font-medium tracking-tight">
            -{discountPercent}%
          </span>
        </div>
      )}

      {/* Dominant Product Image Container (4:5 Ratio) */}
      <div
        onClick={handleCardClick}
        className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100 cursor-pointer"
      >
        <img
          src={product.image_url}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />

        {/* Quick Similar Trigger on Hover */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={handleSimilarClick}
            className="flex items-center gap-1 px-2 py-1 rounded bg-white/95 hover:bg-white text-zinc-800 border border-zinc-200 text-[11px] font-medium shadow-subtle transition-colors"
            title="Search similar products"
          >
            <Camera className="h-3 w-3 text-zinc-600" />
            <span>Similar</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-1">
            <span>{product.brand?.name || 'Aether'}</span>
            <span className="capitalize">{product.category?.name}</span>
          </div>

          {/* Product Name */}
          <h3
            onClick={handleCardClick}
            className="font-medium text-zinc-900 text-sm line-clamp-1 group-hover:text-zinc-600 cursor-pointer transition-colors"
          >
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center text-amber-500">
              <Star className="h-3 w-3 fill-current" />
            </div>
            <span className="text-xs font-medium text-zinc-800">{product.rating}</span>
            <span className="text-[11px] text-zinc-400">({product.review_count})</span>
          </div>
        </div>

        {/* Dominant Palette Swatches */}
        {product.dominant_colors && product.dominant_colors.length > 0 && (
          <div className="flex items-center gap-1 pt-0.5">
            {product.dominant_colors.map((c, i) => (
              <span
                key={i}
                title={`${c.name} (${c.hex})`}
                className="h-2 w-2 rounded-full border border-zinc-300"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}

        {/* Why this matches (Subtle explanation if in visual search mode) */}
        {similarityBreakdown && sharedAttributes && sharedAttributes.length > 0 && (
          <div className="pt-2 border-t border-zinc-100 text-[10px] text-zinc-500 space-y-1">
            <span className="block font-medium text-zinc-700">Matched attributes:</span>
            <div className="flex flex-wrap gap-1">
              {sharedAttributes.slice(0, 3).map((attr, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[10px]"
                >
                  • {attr}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price & Action */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-zinc-900">${product.price.toFixed(2)}</span>
            {product.original_price && (
              <span className="text-xs text-zinc-400 line-through">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleCardClick}
            className="text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
};
