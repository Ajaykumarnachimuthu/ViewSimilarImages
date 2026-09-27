import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CatalogFacets, Product } from '../types/product';
import { productService } from '../services/api';

import { HeroSection } from '../components/landing/HeroSection';
import { DiscoveryMethodsSection } from '../components/landing/DiscoveryMethodsSection';
import { VisualSearchShowcaseSection } from '../components/landing/VisualSearchShowcaseSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { CategoryDiscoverySection } from '../components/landing/CategoryDiscoverySection';
import { FeaturedProductsSection } from '../components/landing/FeaturedProductsSection';
import { TrustSection } from '../components/landing/TrustSection';
import { FinalCtaSection } from '../components/landing/FinalCtaSection';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [facets, setFacets] = useState<CatalogFacets | null>(null);

  useEffect(() => {
    productService
      .getFacets()
      .then((data) => setFacets(data))
      .catch((err) => console.error('Failed to load facets:', err));

    productService
      .getProducts({ page_size: 8, sort_by: 'newest' })
      .then((data) => setFeaturedProducts(data.items))
      .catch((err) => console.error('Failed to load featured products:', err));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/discover');
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#fafaf9]">
      {/* 1. Hero Section */}
      <HeroSection
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
        onOpenVisualSearch={() => navigate('/visual-search')}
        onScrollToCatalog={() => navigate('/discover')}
      />

      {/* 2. Product Discovery Methods */}
      <DiscoveryMethodsSection
        onSearchFocus={() => navigate('/discover')}
        onOpenVisualSearch={() => navigate('/visual-search')}
        onExploreFilters={() => navigate('/discover')}
      />

      {/* 3. Signature Visual Search Showcase */}
      <VisualSearchShowcaseSection
        onOpenVisualSearch={() => navigate('/visual-search')}
      />

      {/* 4. How It Works */}
      <HowItWorksSection />

      {/* 5. Category Discovery Grid */}
      <CategoryDiscoverySection
        categories={facets?.categories || []}
        onSelectCategory={(catId) => {
          const cat = facets?.categories.find((c) => c.id === catId);
          if (cat) {
            navigate(`/category/${cat.slug}`);
          } else {
            navigate('/categories');
          }
        }}
      />

      {/* 6. Featured Products Curated Showcase */}
      <FeaturedProductsSection
        products={featuredProducts}
        onSelectProduct={(p) => navigate(`/product/${p.id}`)}
        onFindSimilar={(p) =>
          navigate(
            `/visual-search?image=${encodeURIComponent(p.image_url)}&name=${encodeURIComponent(p.title)}`
          )
        }
        onViewAllCatalog={() => navigate('/discover')}
      />

      {/* 7. Trust & Product Quality */}
      <TrustSection />

      {/* 8. Final Call to Action */}
      <FinalCtaSection
        onSearchFocus={() => navigate('/discover')}
        onOpenVisualSearch={() => navigate('/visual-search')}
      />
    </div>
  );
};

export default LandingPage;
