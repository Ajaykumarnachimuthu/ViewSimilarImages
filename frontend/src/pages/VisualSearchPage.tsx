import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Upload, Camera, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import type { VisualSearchResponse, VisualSearchResultItem } from '../types/visualSearch';
import type { CatalogFacets } from '../types/product';
import { visualSearchService, productService } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';

type SearchState = 'EMPTY' | 'PROCESSING' | 'RESULTS' | 'ERROR';

const DEMO_PRESETS = [
  {
    id: 'preset-runner',
    title: 'Red Athletic Runner',
    category: 'Footwear',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    tags: ['runner', 'crimson', 'sneakers'],
  },
  {
    id: 'preset-jacket',
    title: 'Technical Shell Jacket',
    category: 'Outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=400&q=80',
    tags: ['jacket', 'black', 'waterproof'],
  },
  {
    id: 'preset-audio',
    title: 'Wireless Headphones',
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    tags: ['headphones', 'studio', 'wireless'],
  },
  {
    id: 'preset-lamp',
    title: 'Architectural Ceramic Lamp',
    category: 'Home & Living',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
    tags: ['ceramic', 'lighting', 'minimalist'],
  },
];

export const VisualSearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialImageUrl = searchParams.get('image');

  const [state, setState] = useState<SearchState>('EMPTY');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<VisualSearchResponse | null>(null);
  const [results, setResults] = useState<VisualSearchResultItem[]>([]);
  const [filteredResults, setFilteredResults] = useState<VisualSearchResultItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Facets & Filters for refining visual search
  const [facets, setFacets] = useState<CatalogFacets | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(500);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch facets
  useEffect(() => {
    productService.getFacets().then(setFacets).catch(console.error);
  }, []);

  // Process image file through backend API
  const processImageFile = useCallback(async (file: File, displayPreviewUrl: string) => {
    setState('PROCESSING');
    setPreviewUrl(displayPreviewUrl);
    setErrorMessage(null);

    try {
      const response = await visualSearchService.searchByImage(file);
      setAnalysis(response);
      setResults(response.results);
      setFilteredResults(response.results);
      setState('RESULTS');
    } catch (err: any) {
      console.error('Visual search failed:', err);
      setErrorMessage(
        err.response?.data?.detail ||
          'Failed to process image. Please ensure the file is an image (JPEG, PNG, WEBP) under 5MB.'
      );
      setState('ERROR');
    }
  }, []);

  // Process image from a URL or preset
  const processImageUrl = useCallback(async (url: string) => {
    setState('PROCESSING');
    setPreviewUrl(url);
    setErrorMessage(null);

    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], 'query-image.jpg', { type: blob.type || 'image/jpeg' });
      await processImageFile(file, url);
    } catch (err) {
      console.error('Failed to load image from URL:', err);
      setErrorMessage('Could not load image from the provided URL.');
      setState('ERROR');
    }
  }, [processImageFile]);

  // Handle URL query parameter ?image=... on initial mount
  useEffect(() => {
    if (initialImageUrl) {
      processImageUrl(initialImageUrl);
    }
  }, [initialImageUrl, processImageUrl]);

  // Refine visual results locally based on Category, Brand, Price filters
  useEffect(() => {
    if (!results.length) return;

    let updated = [...results];
    if (filterCategory !== 'all') {
      updated = updated.filter((r) => r.product.category_id === filterCategory);
    }
    if (filterBrand !== 'all') {
      updated = updated.filter((r) => r.product.brand_id === filterBrand);
    }
    if (filterMaxPrice < 500) {
      updated = updated.filter((r) => r.product.price <= filterMaxPrice);
    }
    setFilteredResults(updated);
  }, [results, filterCategory, filterBrand, filterMaxPrice]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      processImageFile(file, objectUrl);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      processImageFile(file, objectUrl);
    }
  };

  const handleReset = () => {
    setState('EMPTY');
    setPreviewUrl(null);
    setAnalysis(null);
    setResults([]);
    setFilteredResults([]);
    setErrorMessage(null);
    setFilterCategory('all');
    setFilterBrand('all');
    setFilterMaxPrice(500);
  };

  return (
    <div className="w-full bg-[#fafaf9] py-8 sm:py-12 min-h-[calc(100vh-16rem)]">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-medium border border-zinc-200">
            <Camera className="h-3 w-3" />
            <span>Visual Discovery Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
            Search by image
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 max-w-2xl">
            Upload any product photograph, screenshot, or inspiration image to discover visually similar products from the catalog.
          </p>
        </div>

        {/* STATE: EMPTY -> Large Dropzone & Curated Presets */}
        {state === 'EMPTY' && (
          <div className="space-y-10">
            {/* Dedicated Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center p-12 sm:p-16 border-2 border-dashed rounded-lg bg-white transition-all text-center ${
                isDragOver
                  ? 'border-zinc-900 bg-zinc-50/80 shadow-md'
                  : 'border-zinc-300 hover:border-zinc-400 shadow-xs'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="h-14 w-14 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 mb-4 border border-zinc-200">
                <Upload className="h-6 w-6" />
              </div>

              <div className="space-y-1 max-w-sm mb-6">
                <p className="text-base font-semibold text-zinc-900">
                  Drop an image here
                </p>
                <p className="text-xs text-zinc-500">
                  or choose a high-resolution photo from your device
                </p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs sm:text-sm uppercase tracking-wider transition-colors shadow-subtle"
              >
                Choose Image
              </button>

              <p className="mt-4 text-[11px] text-zinc-400 font-mono">
                Supports JPEG, PNG, WEBP up to 5MB
              </p>
            </div>

            {/* Curated 1-Click Demo Presets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                  Try with sample reference images
                </h3>
                <span className="text-[11px] text-zinc-400">Click any preset to test live matching</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {DEMO_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => processImageUrl(preset.imageUrl)}
                    className="group flex flex-col rounded-md border border-zinc-200 bg-white overflow-hidden text-left hover:border-zinc-400 hover:shadow-subtle transition-all"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 relative">
                      <img
                        src={preset.imageUrl}
                        alt={preset.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-zinc-900/80 text-white text-[10px] font-medium backdrop-blur-xs">
                        {preset.category}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-zinc-900 group-hover:text-zinc-600 truncate">
                        {preset.title}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {preset.tags.join(' • ')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STATE: PROCESSING -> Live Analysis Spinner */}
        {state === 'PROCESSING' && (
          <div className="flex flex-col items-center justify-center p-16 rounded-lg bg-white border border-zinc-200 text-center space-y-6 shadow-xs">
            {previewUrl && (
              <div className="relative h-28 w-28 rounded-md overflow-hidden bg-zinc-100 border border-zinc-200 shadow-xs">
                <img
                  src={previewUrl}
                  alt="Analyzing target"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-zinc-900">
                <RefreshCw className="h-5 w-5 animate-spin text-zinc-700" />
                <h3 className="text-base font-bold">Analyzing image...</h3>
              </div>
              <p className="text-xs text-zinc-500 max-w-md">
                Extracting 64-bin HSV color distributions, 64-bit structural difference hashing, and aligning catalog taxonomy.
              </p>
            </div>
          </div>
        )}

        {/* STATE: ERROR */}
        {state === 'ERROR' && (
          <div className="p-8 rounded-lg bg-white border border-zinc-200 text-center space-y-4 shadow-xs">
            <div className="h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-900">Image analysis failed</h3>
              <p className="text-xs text-zinc-600 max-w-md mx-auto">
                {errorMessage || 'Unable to process the image.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors"
            >
              Try another image
            </button>
          </div>
        )}

        {/* STATE: RESULTS -> Full Dual-Column Visual Search Layout with Refinement Filters */}
        {state === 'RESULTS' && analysis && previewUrl && (
          <div className="space-y-8">
            {/* Top Results Summary Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-white border border-zinc-200 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>New Search</span>
                </button>
                <div className="h-4 w-px bg-zinc-200" />
                <span className="text-xs text-zinc-600">
                  Found <strong>{results.length}</strong> visually related products
                </span>
              </div>

              {/* Refinement Controls (Category, Brand, Max Price) */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {/* Category Refinement */}
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500 font-medium">Category:</span>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-2 py-1 rounded border border-zinc-200 bg-white text-xs text-zinc-800 focus:outline-none focus:border-zinc-900"
                  >
                    <option value="all">All Departments</option>
                    {facets?.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Refinement */}
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500 font-medium">Brand:</span>
                  <select
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                    className="px-2 py-1 rounded border border-zinc-200 bg-white text-xs text-zinc-800 focus:outline-none focus:border-zinc-900"
                  >
                    <option value="all">All Brands</option>
                    {facets?.brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Fallback Notice if active */}
            {analysis.fallback_used && (
              <div className="p-3.5 rounded bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-zinc-500" />
                <span>{analysis.fallback_message}</span>
              </div>
            )}

            {/* Main Dual-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Uploaded Reference Card (Sticky) */}
              <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
                <div className="p-4 sm:p-5 rounded-lg border border-zinc-200 bg-white space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100 text-xs">
                    <span className="font-semibold text-zinc-900 uppercase tracking-wider text-[11px]">
                      Query Image
                    </span>
                    <span className="text-zinc-400 font-mono text-[11px]">
                      Reference
                    </span>
                  </div>

                  {/* Image View */}
                  <div className="relative aspect-[4/5] w-full rounded overflow-hidden bg-zinc-100 border border-zinc-200">
                    <img
                      src={previewUrl}
                      alt="Uploaded query preview"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Extracted Color Palette */}
                  <div className="space-y-2 pt-1 text-xs">
                    <span className="block font-medium text-zinc-700 text-[11px] uppercase tracking-wider">
                      Extracted Palette
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {analysis.query_analysis.dominant_colors.map((c, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-1.5 rounded border border-zinc-100 bg-zinc-50"
                        >
                          <span
                            className="h-4 w-4 rounded-full border border-zinc-300 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <div className="space-y-0.5 truncate">
                            <p className="text-[10px] font-medium text-zinc-800 truncate">{c.name}</p>
                            <p className="text-[9px] font-mono text-zinc-400">{c.hex}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inferred Attributes */}
                  <div className="space-y-2 pt-2 border-t border-zinc-100 text-xs">
                    <span className="block font-medium text-zinc-700 text-[11px] uppercase tracking-wider">
                      Recognized Descriptors
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.query_analysis.detected_tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 text-[11px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full py-2 rounded border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-medium transition-colors"
                  >
                    Change Image
                  </button>
                </div>
              </div>

              {/* Right Column: Ranked Visual Results Grid */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200 text-xs">
                  <span className="font-semibold uppercase tracking-wider text-zinc-700">
                    Ranked by similarity score
                  </span>
                  <span className="text-zinc-500 font-mono text-[11px]">
                    Showing {filteredResults.length} matches
                  </span>
                </div>

                {filteredResults.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-lg border border-zinc-200 space-y-3">
                    <p className="text-sm font-semibold text-zinc-800">
                      No products match your current refinement filters.
                    </p>
                    <p className="text-xs text-zinc-500">
                      Try resetting category or brand filters to see all visual matches.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFilterCategory('all');
                        setFilterBrand('all');
                        setFilterMaxPrice(500);
                      }}
                      className="px-3 py-1.5 rounded bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors"
                    >
                      Reset Refinements
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                    {filteredResults.map((item) => (
                      <ProductCard
                        key={item.product.id}
                        product={item.product}
                        similarityScore={item.similarity_score}
                        similarityBreakdown={item.similarity_breakdown}
                        sharedAttributes={item.shared_visual_attributes}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualSearchPage;
