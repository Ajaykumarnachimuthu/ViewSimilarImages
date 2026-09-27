import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Camera, Search, X, User, Menu, ChevronRight } from 'lucide-react';
import type { Category } from '../../types/product';

interface NavbarProps {
  categories: Category[];
}

export const Navbar: React.FC<NavbarProps> = ({ categories }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navSearch, setNavSearch] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync nav search with ?q= in URL if on /search
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('q');
    if (q) {
      setNavSearch(q);
    } else if (location.pathname !== '/search') {
      setNavSearch('');
    }
  }, [location.pathname, location.search]);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(navSearch.trim())}`);
    } else {
      navigate('/discover');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full max-w-full transition-all duration-200 bg-white/95 backdrop-blur-sm ${
          isScrolled
            ? 'border-b border-zinc-200/90 shadow-subtle'
            : 'border-b border-zinc-200'
        }`}
      >
        {/* Primary Navigation Row */}
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
            {/* Left: Brand Identity & Desktop Nav Links */}
            <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 shrink-0">
              {/* Mobile Menu Hamburger Trigger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="md:hidden p-1.5 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              <Link to="/" className="flex items-center gap-2 text-left group shrink-0">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-zinc-900 text-white font-bold text-xs tracking-tight shrink-0">
                  V
                </div>
                <span className="hidden sm:inline text-sm sm:text-base font-bold tracking-tight text-zinc-900 group-hover:text-zinc-600 transition-colors">
                  Visual Product Finder
                </span>
                <span className="sm:hidden text-xs font-bold tracking-tight text-zinc-900">
                  Visual Finder
                </span>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-xs font-medium text-zinc-600">
                <NavLink
                  to="/discover"
                  className={({ isActive }) =>
                    `py-1 transition-colors ${
                      isActive
                        ? 'text-zinc-900 font-semibold border-b-2 border-zinc-900'
                        : 'hover:text-zinc-900'
                    }`
                  }
                >
                  Discover
                </NavLink>
                <NavLink
                  to="/visual-search"
                  className={({ isActive }) =>
                    `py-1 transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'text-zinc-900 font-semibold border-b-2 border-zinc-900'
                        : 'hover:text-zinc-900'
                    }`
                  }
                >
                  <Camera className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Visual Search</span>
                </NavLink>
                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    `py-1 transition-colors ${
                      isActive
                        ? 'text-zinc-900 font-semibold border-b-2 border-zinc-900'
                        : 'hover:text-zinc-900'
                    }`
                  }
                >
                  Categories
                </NavLink>
              </nav>
            </div>

            {/* Right: Search, Sign In, CTA */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 flex-1 max-w-md lg:max-w-lg justify-end">
              {/* Responsive Search Input */}
              <form onSubmit={handleSearchSubmit} className="relative w-full max-w-[150px] xs:max-w-[190px] sm:max-w-xs md:max-w-sm lg:max-w-md">
                <input
                  type="text"
                  placeholder="Search..."
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  className="w-full pl-7 sm:pl-8 pr-12 sm:pr-14 py-1.5 rounded-md bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors"
                />
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                  {navSearch && (
                    <button
                      type="button"
                      onClick={() => setNavSearch('')}
                      className="p-1 text-zinc-400 hover:text-zinc-700"
                      title="Clear search"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                  <Link
                    to="/visual-search"
                    className="p-1 text-zinc-500 hover:text-zinc-900"
                    title="Search by image"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </form>

              {/* Sign In Button (Desktop) */}
              <button
                type="button"
                onClick={() => setShowSignInModal(true)}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition-colors shrink-0"
              >
                <User className="h-3.5 w-3.5 text-zinc-500" />
                <span>Sign In</span>
              </button>

              {/* Primary CTA: Try Visual Search */}
              <Link
                to="/visual-search"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-colors shadow-subtle shrink-0"
              >
                <Camera className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="hidden xs:inline">Visual Search</span>
              </Link>
            </div>
          </div>

          {/* Department Bar (Horizontally scrollable with zero page blowout) */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto py-2 border-t border-zinc-100 text-[11px] sm:text-xs text-zinc-600 scrollbar-none w-full max-w-full">
            <NavLink
              to="/discover"
              className={({ isActive }) =>
                `shrink-0 hover:text-zinc-900 transition-colors ${
                  isActive && location.pathname === '/discover'
                    ? 'text-zinc-900 font-semibold'
                    : ''
                }`
              }
            >
              All Products
            </NavLink>
            {categories.map((cat) => (
              <NavLink
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={({ isActive }) =>
                  `shrink-0 hover:text-zinc-900 transition-colors ${
                    isActive ? 'text-zinc-900 font-semibold' : ''
                  }`
                }
              >
                {cat.name}
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full bg-white p-5 overflow-y-auto z-10 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <Link to="/" className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-900 text-white font-bold text-xs">
                    V
                  </div>
                  <span className="text-sm font-bold text-zinc-900">Visual Product Finder</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Main Navigation Links */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Navigation
                </span>
                <nav className="space-y-0.5 pt-1 text-sm font-medium">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `flex items-center justify-between px-2.5 py-2 rounded-md ${
                        isActive ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-700 hover:bg-zinc-50'
                      }`
                    }
                  >
                    <span>Home Overview</span>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                  </NavLink>
                  <NavLink
                    to="/discover"
                    className={({ isActive }) =>
                      `flex items-center justify-between px-2.5 py-2 rounded-md ${
                        isActive ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-700 hover:bg-zinc-50'
                      }`
                    }
                  >
                    <span>Discover Catalog</span>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                  </NavLink>
                  <NavLink
                    to="/visual-search"
                    className={({ isActive }) =>
                      `flex items-center justify-between px-2.5 py-2 rounded-md ${
                        isActive ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-700 hover:bg-zinc-50'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-zinc-600" />
                      <span>Visual Search</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                  </NavLink>
                  <NavLink
                    to="/categories"
                    className={({ isActive }) =>
                      `flex items-center justify-between px-2.5 py-2 rounded-md ${
                        isActive ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-700 hover:bg-zinc-50'
                      }`
                    }
                  >
                    <span>All Categories</span>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                  </NavLink>
                </nav>
              </div>

              {/* Department Links */}
              <div className="space-y-1 pt-2 border-t border-zinc-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Departments
                </span>
                <div className="space-y-0.5 pt-1 text-xs text-zinc-600">
                  {categories.map((cat) => (
                    <NavLink
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="block px-2.5 py-1.5 rounded hover:bg-zinc-50 hover:text-zinc-900"
                    >
                      {cat.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Account */}
            <div className="pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setShowSignInModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-md border border-zinc-200 text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign In / Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightweight Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-modal border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900">Sign in to your account</h3>
              <button
                onClick={() => setShowSignInModal(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Sign in to save discovered products, curate personal visual search inspiration boards, and track order histories.
            </p>
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  defaultValue="shopper@example.com"
                  className="w-full px-3 py-2 rounded border border-zinc-300 text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  defaultValue="••••••••"
                  className="w-full px-3 py-2 rounded border border-zinc-300 text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowSignInModal(false)}
                className="w-full py-2.5 rounded bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
