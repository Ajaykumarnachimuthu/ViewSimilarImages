import React from 'react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="bg-[#fafaf9] border-b border-zinc-200 py-16 sm:py-20">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-xl mb-12 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
            How it works
          </h2>
          <p className="text-sm sm:text-base text-zinc-600">
            A direct, three-step discovery flow built for speed and visual precision.
          </p>
        </div>

        {/* 3 Steps in clean typography with photographic accents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="p-6 rounded-lg bg-white border border-zinc-200 space-y-4 shadow-xs">
            <span className="block font-mono text-3xl sm:text-4xl font-bold text-zinc-900">
              01
            </span>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-zinc-900">
                Search or upload
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Enter descriptive keywords into the search bar, filter by category facets, or drag and drop any reference photograph.
              </p>
            </div>
            <div className="pt-2 text-[11px] text-zinc-400 font-mono">
              Accepts JPEG, PNG, WEBP $\le$ 5MB
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-lg bg-white border border-zinc-200 space-y-4 shadow-xs">
            <span className="block font-mono text-3xl sm:text-4xl font-bold text-zinc-900">
              02
            </span>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-zinc-900">
                Discover relevant products
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Our visual similarity engine evaluates chromatic distributions, structural silhouette geometry, and catalog metadata.
              </p>
            </div>
            <div className="pt-2 text-[11px] text-zinc-400 font-mono">
              Authentic mathematical scores
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-lg bg-white border border-zinc-200 space-y-4 shadow-xs">
            <span className="block font-mono text-3xl sm:text-4xl font-bold text-zinc-900">
              03
            </span>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-zinc-900">
                Compare and explore
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Inspect structured technical specifications, view why items matched, and browse visual alternatives directly from product pages.
              </p>
            </div>
            <div className="pt-2 text-[11px] text-zinc-400 font-mono">
              Full specs & related items shelf
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
