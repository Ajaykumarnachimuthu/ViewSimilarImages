import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-200 bg-white text-zinc-500 text-xs mt-auto">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Left: Logo + Short Description */}
          <div className="md:col-span-5 space-y-3">
            <Link to="/" className="flex items-center gap-2.5 text-left group">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-zinc-900 text-white font-bold text-xs tracking-tight">
                V
              </div>
              <span className="text-base font-bold tracking-tight text-zinc-900 group-hover:text-zinc-600 transition-colors">
                Visual Product Finder
              </span>
            </Link>
            <p className="text-zinc-500 text-xs sm:text-sm max-w-sm leading-relaxed">
              A consumer-grade visual product discovery platform. Search by keywords, explore structured facets, or upload an image to find visually similar items.
            </p>
          </div>

          {/* Center: Navigation Links (Product, Categories) */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-zinc-900 uppercase tracking-wider mb-3 text-[11px]">
                Product
              </h4>
              <ul className="space-y-2 text-zinc-600">
                <li>
                  <Link to="/discover" className="hover:text-zinc-900 transition-colors">
                    Discover Catalog
                  </Link>
                </li>
                <li>
                  <Link to="/visual-search" className="hover:text-zinc-900 transition-colors">
                    Visual Search
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="hover:text-zinc-900 transition-colors">
                    All Categories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-zinc-900 uppercase tracking-wider mb-3 text-[11px]">
                Categories
              </h4>
              <ul className="space-y-2 text-zinc-600">
                <li>
                  <Link to="/category/footwear" className="hover:text-zinc-900 transition-colors">
                    Footwear
                  </Link>
                </li>
                <li>
                  <Link to="/category/outerwear-apparel" className="hover:text-zinc-900 transition-colors">
                    Outerwear & Apparel
                  </Link>
                </li>
                <li>
                  <Link to="/category/electronics-audio" className="hover:text-zinc-900 transition-colors">
                    Electronics & Audio
                  </Link>
                </li>
                <li>
                  <Link to="/category/watches-accessories" className="hover:text-zinc-900 transition-colors">
                    Watches & Accessories
                  </Link>
                </li>
                <li>
                  <Link to="/category/home-living" className="hover:text-zinc-900 transition-colors">
                    Home & Living
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Privacy, Terms, Contact */}
          <div className="md:col-span-3">
            <h4 className="font-semibold text-zinc-900 uppercase tracking-wider mb-3 text-[11px]">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-zinc-600">
              <li>
                <span className="hover:text-zinc-900 cursor-pointer transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-zinc-900 cursor-pointer transition-colors">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-zinc-900 cursor-pointer transition-colors">
                  Contact & Inquiries
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-400 text-xs">
          <p>© 2026 Visual Product Finder. All rights reserved.</p>
          <p className="font-mono text-[11px]">Production Discovery Application</p>
        </div>
      </div>
    </footer>
  );
};
