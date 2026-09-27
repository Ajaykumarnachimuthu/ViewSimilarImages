import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 overflow-hidden shadow-subtle animate-pulse">
      <div className="aspect-[4/5] w-full rounded bg-zinc-100 mb-3" />
      <div className="space-y-2">
        <div className="h-3 w-1/3 rounded bg-zinc-100" />
        <div className="h-4 w-4/5 rounded bg-zinc-200" />
        <div className="h-3 w-1/4 rounded bg-zinc-100" />
        <div className="pt-2 flex items-center justify-between">
          <div className="h-4.5 w-16 rounded bg-zinc-200" />
          <div className="h-7 w-20 rounded bg-zinc-100" />
        </div>
      </div>
    </div>
  );
};

export const FilterSidebarSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse p-4 bg-white rounded-lg border border-zinc-200 shadow-subtle">
      <div className="h-4 w-24 rounded bg-zinc-200" />
      <div className="space-y-2.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-7 w-full rounded bg-zinc-100" />
        ))}
      </div>
    </div>
  );
};
