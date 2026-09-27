import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import type { Category } from '../types/product';
import { productService } from '../services/api';

const CATEGORY_IMAGES: Record<string, string> = {
  footwear: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
  'outerwear-apparel': 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80',
  'electronics-audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  'watches-accessories': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
  'home-living': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
};

const CATEGORY_TAGLINES: Record<string, string> = {
  footwear: 'Handcrafted sneakers, technical running shoes, and timeless leather silhouettes.',
  'outerwear-apparel': 'Weather-resistant storm shells, structural knitwear, and technical tailoring.',
  'electronics-audio': 'Acoustic studio monitors, planar magnetic headphones, and precision hardware.',
  'watches-accessories': 'Automatic mechanical chronographs, full-grain leather wallets, and eyewear.',
  'home-living': 'Ceramic architectural lamps, minimalist earthenware, and ergonomic furniture.',
};

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    productService
      .getCategories()
      .then((data) => {
        setCategories(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load categories:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="w-full bg-[#fafaf9] py-8 sm:py-16">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-12">
        {/* Header */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-medium border border-zinc-200">
            <Layers className="h-3 w-3" />
            <span>Catalog Taxonomy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900">
            Product Categories
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            Browse our full taxonomy of verified departments. Every category features authentic manufacturer specifications and full visual search compatibility.
          </p>
        </div>

        {/* Categories Grid (Large Editorial Tiles with Real Photography) */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-96 rounded-lg bg-zinc-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((cat) => {
              const imgSrc = CATEGORY_IMAGES[cat.slug] || CATEGORY_IMAGES.footwear;
              const tagline = CATEGORY_TAGLINES[cat.slug] || cat.description;

              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="group relative flex flex-col rounded-lg border border-zinc-200 bg-white overflow-hidden hover:border-zinc-400 hover:shadow-card transition-all duration-300"
                >
                  {/* Dominant Image Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
                    <img
                      src={imgSrc}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h2 className="text-xl font-bold tracking-tight">{cat.name}</h2>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                      {tagline}
                    </p>

                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                      <span>Explore Department</span>
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
