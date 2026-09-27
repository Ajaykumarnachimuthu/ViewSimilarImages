import React, { useEffect, useState } from 'react';
import { X, Star, CheckCircle2, Camera } from 'lucide-react';
import type { Product, ProductDetail } from '../../types/product';
import { productService } from '../../services/api';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSearchWithProductImage: (product: Product) => void;
  onSelectRelatedProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSearchWithProductImage,
  onSelectRelatedProduct,
}) => {
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [visuallySimilar, setVisuallySimilar] = useState<any[]>([]);

  useEffect(() => {
    if (!product) return;

    // Fetch full specs and visually similar
    Promise.all([
      productService.getProductDetail(product.id),
      productService.getVisuallySimilar(product.id, 4),
    ])
      .then(([detailData, similarData]) => {
        setDetail(detailData);
        setVisuallySimilar(similarData.matches || []);
      })
      .catch((err) => console.error('Error fetching product details:', err));

    // Handle ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-zinc-900/50 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-modal z-10 scrollbar-thin">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-7 w-7 items-center justify-center rounded text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          {/* Left: Large Product Image */}
          <div className="space-y-3">
            <div className="relative w-full h-[320px] sm:h-[380px] max-h-[380px] rounded overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center">
              <img
                src={product.image_url}
                alt={product.title}
                className="h-full w-full object-cover object-center"
              />
              <button
                onClick={() => onSearchWithProductImage(product)}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-medium border border-zinc-200 shadow-subtle transition-colors"
              >
                <Camera className="h-3.5 w-3.5 text-zinc-600" />
                <span>Search visually similar</span>
              </button>
            </div>

            {/* Dominant Palette Swatches */}
            {product.dominant_colors && product.dominant_colors.length > 0 && (
              <div className="p-3 rounded bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Extracted Palette
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {product.dominant_colors.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span
                        className="h-3 w-3 rounded-full border border-zinc-300 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div className="truncate">
                        <span className="text-[11px] font-medium text-zinc-800 block truncate">
                          {c.name}
                        </span>
                        <span className="text-[10px] text-zinc-400">{c.hex}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Product Information & Purchase CTAs */}
          <div className="flex flex-col justify-between space-y-5">
            <div className="space-y-3.5">
              <div>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  {product.brand?.name} • {product.category?.name}
                </span>
                <h2 className="text-xl font-semibold text-zinc-900 mt-1 leading-snug">
                  {product.title}
                </h2>
              </div>

              {/* Rating & Availability */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="font-semibold text-zinc-900">{product.rating}</span>
                  <span className="text-zinc-400">({product.review_count} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>In Stock ({product.stock} available)</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 pt-1">
                <span className="text-2xl font-bold text-zinc-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.original_price && (
                  <span className="text-sm text-zinc-400 line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed pt-1">
                {product.description}
              </p>

              {/* Attributes / Visual Tags */}
              {product.visual_tags && product.visual_tags.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Attributes
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {product.visual_tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[11px] font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications Table */}
              {detail && detail.features && detail.features.length > 0 && (
                <div className="pt-3 border-t border-zinc-100">
                  <span className="text-[11px] font-semibold text-zinc-900 uppercase tracking-wider block mb-2">
                    Specifications
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {detail.features.map((feat, idx) => (
                      <div key={idx} className="p-2 rounded bg-zinc-50 border border-zinc-200">
                        <span className="text-zinc-400 block text-[10px] uppercase font-semibold">
                          {feat.feature_name}
                        </span>
                        <span className="text-zinc-800 font-medium">{feat.feature_value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-zinc-100 flex items-center gap-3">
              <button
                onClick={() => onSearchWithProductImage(product)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs transition-colors shadow-subtle"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Search visually similar products</span>
              </button>
            </div>
          </div>
        </div>

        {/* Visually Related Products Shelf */}
        {visuallySimilar.length > 0 && (
          <div className="p-6 border-t border-zinc-100 bg-zinc-50/50">
            <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-3">
              Similar Products
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {visuallySimilar.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectRelatedProduct(item.product)}
                  className="group rounded border border-zinc-200 bg-white p-2 hover:border-zinc-300 hover:shadow-subtle cursor-pointer transition-colors"
                >
                  <div className="aspect-[4/5] w-full rounded overflow-hidden bg-zinc-100 mb-2">
                    <img
                      src={item.product.image_url}
                      alt={item.product.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-zinc-600 font-medium">
                      {Math.round(item.similarity_score * 100)}% match
                    </span>
                    <span className="text-zinc-900 font-semibold">${item.product.price}</span>
                  </div>
                  <h4 className="text-xs text-zinc-800 font-medium truncate group-hover:text-zinc-600">
                    {item.product.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
