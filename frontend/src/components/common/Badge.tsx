import React from 'react';

interface SimilarityBadgeProps {
  score: number; // 0.00 to 1.00
  size?: 'sm' | 'md';
}

export const SimilarityBadge: React.FC<SimilarityBadgeProps> = ({ score, size = 'md' }) => {
  const percent = Math.round(score * 100);

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded bg-zinc-900/90 text-white font-medium tracking-tight shadow-subtle ${sizeClasses}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      <span>{percent}% visual match</span>
    </span>
  );
};
