import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Camera, ChevronRight, Check, ShieldCheck, Truck } from 'lucide-react';
import type { ProductDetail } from '../types/product';
import { productService } from '../services/api';
import { SimilarProducts } from '../components/product/SimilarProducts';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setErrorMessage(null);

    productService
      .getProductDetail(id)
      .then((data) => {
        setProduct(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load product detail:', err);
        setErrorMessage('Product not found or unavailable.');
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5 h-[440px] bg-zinc-200 rounded-lg animate-pulse" />
          <div className="lg:col-span-7 space-y-6">
            <div className="h-6 w-32 bg-zinc-200 rounded animate-pulse" />
            <div className="h-10 w-3/4 bg-zinc-200 rounded animate-pulse" />
            <div className="h-6 w-24 bg-zinc-200 rounded animate-pulse" />
            <div className="h-24 w-full bg-zinc-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !product) {
    return (
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900">Product Not Found</h2>
        <p className="text-sm text-zinc-600 max-w-md mx-auto">
          The requested product item could not be retrieved from the catalog index.
        </p>
        <Link
          to="/discover"
          className="inline-block px-4 py-2 rounded bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors"
        >
          Return to Discover
        </Link>
      </div>
    );
  }

  const discountPercent =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null;

  return (
    <div className="w-full bg-[#fafaf9] py-6 sm:py-10">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-8 lg:space-y-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Link to="/" className="hover:text-zinc-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-zinc-400" />
          <Link to="/discover" className="hover:text-zinc-900 transition-colors">
            Discover
          </Link>
          {product.category && (
            <>
              <ChevronRight className="h-3 w-3 text-zinc-400" />
              <Link
                to={`/category/${product.category.slug}`}
                className="hover:text-zinc-900 transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3 text-zinc-400" />
          <span className="font-semibold text-zinc-900 truncate max-w-xs">
            {product.title}
          </span>
        </nav>

        {/* Top Product Showcase (Gallery on Left, Editorial Purchase Details on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column: Focused, properly sized imagery & palette */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[480px] max-h-[480px] rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shadow-xs flex items-center justify-center">
              <img
                src={product.image_url}
                alt={product.title}
                className="h-full w-full object-cover object-center"
              />
              {discountPercent && (
                <div className="absolute top-3.5 right-3.5">
                  <span className="px-2 py-1 rounded bg-zinc-900 text-white text-xs font-semibold tracking-tight shadow-xs">
                    -{discountPercent}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Extracted Dominant Palette Swatches */}
            {product.dominant_colors && product.dominant_colors.length > 0 && (
              <div className="p-3 sm:p-3.5 rounded-md border border-zinc-200 bg-white space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
                  Extracted Color Palette
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.dominant_colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-50 border border-zinc-200 text-xs"
                    >
                      <span
                        className="h-3 w-3 rounded-full border border-zinc-300 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="font-medium text-zinc-800 text-[11px]">
                        {color.name}
                      </span>
                      <span className="font-mono text-zinc-400 text-[9px]">
                        {color.hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Title, Metadata, Pricing, Actions */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {product.brand?.name || 'Verified Manufacturer'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 leading-snug">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <div className="flex items-center text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <span className="font-bold text-zinc-900">{product.rating}</span>
                <span className="text-zinc-500">({product.review_count} verified reviews)</span>
                <span className="text-zinc-300">•</span>
                <span className="text-emerald-700 font-medium">In Stock</span>
              </div>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pb-4 border-b border-zinc-200">
              <span className="text-3xl font-bold tracking-tight text-zinc-900">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-base text-zinc-400 line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-600 leading-relaxed">
              {product.description}
            </p>

            {/* Attributes / Visual Tags */}
            {product.visual_tags && product.visual_tags.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Visual Attributes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.visual_tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-white border border-zinc-200 text-zinc-800 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setAddedToCart(true);
                  setTimeout(() => setAddedToCart(false), 2500);
                }}
                className="w-full py-2.5 sm:py-3 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider transition-colors shadow-subtle flex items-center justify-center gap-2"
              >
                {addedToCart ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <span>Add to Bag</span>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/visual-search?image=${encodeURIComponent(product.image_url)}&name=${encodeURIComponent(product.title)}`
                  )
                }
                className="w-full py-2.5 sm:py-3 rounded-md border border-zinc-300 hover:border-zinc-400 bg-white text-zinc-900 font-semibold text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Camera className="h-4 w-4 text-zinc-600" />
                <span>Find Visually Similar</span>
              </button>
            </div>

            {/* Trust Points */}
            <div className="pt-4 border-t border-zinc-200 space-y-2 text-xs text-zinc-600">
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-zinc-400 shrink-0" />
                <span>Complimentary express delivery and tracked carbon-neutral shipping</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-zinc-400 shrink-0" />
                <span>Verified authentic manufacturer guarantee & 30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Structured Technical Specifications Table */}
        {product.features && product.features.length > 0 && (
          <div className="pt-8 space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 pb-3 border-b border-zinc-200">
              Product Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {product.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-md bg-white border border-zinc-200 space-y-1 shadow-xs"
                >
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                    {feat.feature_name}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-zinc-800">
                    {feat.feature_value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visually Similar Products Shelf */}
        <SimilarProducts
          productId={product.id}
          limit={4}
          onFindSimilar={(p) =>
            navigate(
              `/visual-search?image=${encodeURIComponent(p.image_url)}&name=${encodeURIComponent(p.title)}`
            )
          }
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
