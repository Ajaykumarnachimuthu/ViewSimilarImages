import React from 'react';
import { Camera, Search } from 'lucide-react';

interface FinalCtaSectionProps {
  onSearchFocus: () => void;
  onOpenVisualSearch: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onSearchFocus,
  onOpenVisualSearch,
}) => {
  return (
    <section className="bg-white py-20 sm:py-28 border-b border-zinc-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-center space-y-6">
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Get Started
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 leading-tight">
            Start with what you have in mind.
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 max-w-xl mx-auto">
            Search by words or show us an image.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onSearchFocus}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors shadow-subtle"
          >
            <Search className="h-4 w-4" />
            <span>Search Products</span>
          </button>
          <button
            type="button"
            onClick={onOpenVisualSearch}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-zinc-300 hover:border-zinc-400 bg-white text-zinc-800 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            <Camera className="h-4 w-4 text-zinc-600" />
            <span>Try Visual Search</span>
          </button>
        </div>
      </div>
    </section>
  );
};
