import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { Category } from './types/product';
import { productService } from './services/api';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';

import { LandingPage } from './pages/LandingPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { VisualSearchPage } from './pages/VisualSearchPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { ProductDetailPage } from './pages/ProductDetailPage';

export const App: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    productService
      .getCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#fafaf9] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white w-full">
        {/* Persistent Global Application Shell Navigation */}
        <Navbar categories={categories} />

        {/* Dynamic Route Content */}
        <main className="flex-1 w-full flex flex-col">
          <Routes>
            {/* Landing Page (Marketing Entry Point) */}
            <Route path="/" element={<LandingPage />} />

            {/* Main Application Catalog Discovery */}
            <Route path="/discover" element={<DiscoverPage />} />

            {/* Dedicated Search Results with URL Query State */}
            <Route path="/search" element={<SearchResultsPage />} />

            {/* Dedicated Visual Search Application Page */}
            <Route path="/visual-search" element={<VisualSearchPage />} />

            {/* All Product Categories Hub */}
            <Route path="/categories" element={<CategoriesPage />} />

            {/* Dedicated Category Results */}
            <Route path="/category/:category" element={<CategoryDetailPage />} />

            {/* Comprehensive Product Details */}
            <Route path="/product/:id" element={<ProductDetailPage />} />

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Persistent Global Application Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
