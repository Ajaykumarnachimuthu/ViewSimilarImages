import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  AlertCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { visualSearchService } from '../../services/api';
import type { VisualSearchResponse } from '../../types/visualSearch';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVisualSearchSuccess: (response: VisualSearchResponse, imagePreviewUrl: string) => void;
}

// Preset samples for demonstration without needing an image on disk
const SAMPLE_QUERIES = [
  {
    name: 'Red Athletic Runner',
    category: 'Footwear',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Black Technical Shell',
    category: 'Outerwear',
    url: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Wireless Studio Acoustics',
    category: 'Audio',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Ceramic Stoneware Lamp',
    category: 'Home & Living',
    url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
  },
];

type VisualSearchState = 'IDLE' | 'IMAGE_SELECTED' | 'PROCESSING' | 'SUCCESS' | 'ERROR';

export const VisualSearchModal: React.FC<VisualSearchModalProps> = ({
  isOpen,
  onClose,
  onVisualSearchSuccess,
}) => {
  const [searchState, setSearchState] = useState<VisualSearchState>('IDLE');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<VisualSearchResponse | null>(null);
  const [minSimilarity] = useState<number>(0.35);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelection = async (file: File) => {
    setError(null);
    setSearchState('IMAGE_SELECTED');

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Automatically trigger vision pipeline
    executeVisualSearch(file, minSimilarity);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };

  const handleSampleClick = async (sample: typeof SAMPLE_QUERIES[0]) => {
    try {
      setError(null);
      setSearchState('IMAGE_SELECTED');
      setPreviewUrl(sample.url);

      // Fetch sample image as Blob to simulate real upload
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const file = new File([blob], `${sample.name.toLowerCase().replace(/\s+/g, '_')}.jpg`, {
        type: 'image/jpeg',
      });

      await executeVisualSearch(file, minSimilarity);
    } catch (err: any) {
      setError(`Failed to load sample query: ${err.message}`);
      setSearchState('ERROR');
    }
  };

  const executeVisualSearch = async (file: File, threshold: number) => {
    setSearchState('PROCESSING');
    setError(null);

    try {
      const response = await visualSearchService.searchByImage(file, threshold);
      setAnalysisResult(response);
      setSearchState('SUCCESS');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'We could not analyze this image. Try another image or use normal product search.';
      setError(msg);
      setSearchState('ERROR');
    }
  };

  const handleApplyToCatalog = () => {
    if (analysisResult && previewUrl) {
      onVisualSearchSuccess(analysisResult, previewUrl);
      onClose();
    }
  };

  const handleReset = () => {
    setSearchState('IDLE');
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-zinc-900/50 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-xl rounded-lg border border-zinc-200 bg-white p-6 sm:p-7 shadow-modal z-10 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              Search by image
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Upload a product image to discover visually similar products.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 text-zinc-600 mt-0.5" />
            <div>
              <span className="font-semibold block">Image search unavailable</span>
              <span className="text-zinc-600">{error}</span>
            </div>
          </div>
        )}

        {/* Upload Zone (IDLE state) */}
        {!previewUrl ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
              isDragOver
                ? 'border-zinc-900 bg-zinc-50'
                : 'border-zinc-300 hover:border-zinc-400 bg-zinc-50/50 hover:bg-zinc-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelection(e.target.files[0]);
                }
              }}
            />
            <div className="flex flex-col items-center justify-center space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-white text-zinc-600 border border-zinc-200 shadow-subtle">
                <UploadCloud className="h-5 w-5 text-zinc-700" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-900">
                  Drag & drop image, or <span className="underline font-medium">choose image</span>
                </p>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Supports JPG, PNG, WEBP (maximum 5MB)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-video w-full rounded overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Selected query"
                className="max-h-full max-w-full object-contain"
              />

              {/* Processing State */}
              {searchState === 'PROCESSING' && (
                <div className="absolute inset-0 bg-white/85 flex flex-col justify-center items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-zinc-800" />
                  <span className="text-xs font-medium text-zinc-800">
                    Analyzing image... Finding visually related products...
                  </span>
                </div>
              )}

              <button
                onClick={handleReset}
                className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-white/95 hover:bg-white text-zinc-700 text-[11px] font-medium border border-zinc-200 shadow-subtle transition-colors"
              >
                Change image
              </button>
            </div>

            {/* Extracted Attributes Summary (SUCCESS state) */}
            {analysisResult && searchState === 'SUCCESS' && (
              <div className="p-3.5 rounded bg-zinc-50 border border-zinc-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-900">Extracted signals:</span>
                  <span className="text-zinc-600 font-medium">
                    {analysisResult.total_matches} matches found
                  </span>
                </div>

                {/* Dominant Palette */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-zinc-500">Colors:</span>
                  {analysisResult.query_analysis.dominant_colors.map((c, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-zinc-200 text-[10px] text-zinc-700"
                    >
                      <span
                        className="h-2 w-2 rounded-full border border-zinc-300"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.name}
                    </span>
                  ))}
                </div>

                {/* Inferred Tags */}
                {analysisResult.query_analysis.detected_tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-zinc-500">Attributes:</span>
                    {analysisResult.query_analysis.detected_tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-white text-zinc-700 border border-zinc-200 text-[10px]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Fallback Notice */}
                {analysisResult.fallback_used && (
                  <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] mt-1">
                    {analysisResult.fallback_message}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Preset Sample Queries */}
        <div className="space-y-1.5 pt-2 border-t border-zinc-100">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Or test with sample imagery:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SAMPLE_QUERIES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSampleClick(sample)}
                className="flex items-center gap-2 p-1.5 rounded bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-left transition-colors group"
              >
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="h-7 w-7 rounded object-cover shrink-0 bg-zinc-200"
                />
                <div className="truncate">
                  <span className="block text-[11px] font-medium text-zinc-800 truncate group-hover:text-zinc-950">
                    {sample.name}
                  </span>
                  <span className="block text-[10px] text-zinc-400">{sample.category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs font-medium text-zinc-500 hover:text-zinc-800"
          >
            Cancel
          </button>
          <button
            disabled={searchState !== 'SUCCESS'}
            onClick={handleApplyToCatalog}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs transition-colors shadow-subtle"
          >
            <span>View visually related products ({analysisResult?.total_matches || 0})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
