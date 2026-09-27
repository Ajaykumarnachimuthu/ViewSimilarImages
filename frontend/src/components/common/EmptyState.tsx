import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No products found",
  description = "Try adjusting your filters, price range, or search terms to find what you're looking for.",
  onReset,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-zinc-200 bg-white shadow-subtle my-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-zinc-100 text-zinc-500 mb-3 border border-zinc-200">
        <SearchX className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-zinc-900 mb-1">{title}</h3>
      <p className="max-w-md text-xs text-zinc-500 mb-5 leading-relaxed">
        {description}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs transition-colors shadow-subtle"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Clear filters</span>
        </button>
      )}
    </div>
  );
};
