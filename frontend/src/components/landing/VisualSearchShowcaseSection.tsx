import React from 'react';
import { Camera, Check, ArrowRight } from 'lucide-react';

interface VisualSearchShowcaseSectionProps {
  onOpenVisualSearch: () => void;
}

export const VisualSearchShowcaseSection: React.FC<VisualSearchShowcaseSectionProps> = ({
  onOpenVisualSearch,
}) => {
  return (
    <section className="bg-white border-b border-zinc-200 py-16 sm:py-24">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left: Large Reference Product / Ingestion Display */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-lg border border-zinc-200 bg-zinc-50 space-y-4">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-zinc-200">
                <span className="font-semibold text-zinc-900 uppercase tracking-wider text-[11px]">
                  Uploaded Reference
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-200/80 text-zinc-700 text-[10px] font-mono">
                  image/jpeg • 245 KB
                </span>
              </div>

              {/* Dominant Image */}
              <div className="relative aspect-[4/5] w-full rounded-md overflow-hidden bg-zinc-100 border border-zinc-200">
                <img
                  src="https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80"
                  alt="Reference technical shell jacket"
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-zinc-900/85 text-white text-[10px] font-medium backdrop-blur-xs flex items-center gap-1.5">
                  <Camera className="h-3 w-3" />
                  <span>Input Photo</span>
                </div>
              </div>

              {/* Detected Visual Descriptors */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between text-zinc-600">
                  <span className="text-[11px]">Extracted Palette:</span>
                  <div className="flex items-center gap-1">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-zinc-300"
                      style={{ backgroundColor: '#18181b' }}
                      title="Matte Black (#18181b)"
                    />
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-zinc-300"
                      style={{ backgroundColor: '#27272a' }}
                      title="Slate Dark (#27272a)"
                    />
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-zinc-300"
                      style={{ backgroundColor: '#71717a' }}
                      title="Neutral Muted (#71717a)"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-zinc-600">
                  <span className="text-[11px]">Inferred Descriptors:</span>
                  <span className="font-mono text-[11px] text-zinc-800">
                    jacket, hooded, technical, shell
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Signature Capability Explanation & Realistic Result Preview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Visual Search Capability
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
                See something you like? Search with it.
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl">
                Upload any product photograph, screenshot, or inspiration image to discover products with matching visual characteristics across our inventory.
              </p>
            </div>

            {/* Feature Bullets with restrained checkmarks */}
            <div className="space-y-2.5 text-xs sm:text-sm text-zinc-700">
              <div className="flex items-start gap-2.5">
                <div className="h-4 w-4 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5 text-zinc-900">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                </div>
                <span>
                  <strong>Color & Hue Matching:</strong> Compares 64-bin HSV chromatic distributions to match color harmonies accurately.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-4 w-4 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5 text-zinc-900">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                </div>
                <span>
                  <strong>Silhouette & Contour Analysis:</strong> Uses 64-bit difference hashing to preserve physical shape and geometric proportions.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-4 w-4 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5 text-zinc-900">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                </div>
                <span>
                  <strong>Taxonomy Alignment:</strong> Combines visual geometry with catalog tags to eliminate spurious cross-department false positives.
                </span>
              </div>
            </div>

            {/* Realistic Result Preview (REFERENCE IMAGE → SIMILAR PRODUCTS) */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-100 pb-2">
                <span className="font-semibold uppercase tracking-wider text-[11px] text-zinc-800">
                  Live Result Preview
                </span>
                <span className="font-mono text-[11px]">Ranked by visual similarity</span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {/* Result Item 1 */}
                <div className="p-2 sm:p-2.5 rounded-md border border-zinc-200 bg-zinc-50/50 space-y-1.5 sm:space-y-2 text-left min-w-0">
                  <div className="aspect-[4/5] rounded overflow-hidden bg-zinc-100">
                    <img
                      src="https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=400&q=80"
                      alt="Shell Jacket"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-[9px] sm:text-[10px]">
                      92% match
                    </span>
                    <p className="text-[11px] sm:text-xs font-semibold text-zinc-900 truncate mt-1">
                      Technical Shell Jacket
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-zinc-500 truncate">Patagonia • $289</p>
                  </div>
                </div>

                {/* Result Item 2 */}
                <div className="p-2 sm:p-2.5 rounded-md border border-zinc-200 bg-zinc-50/50 space-y-1.5 sm:space-y-2 text-left min-w-0">
                  <div className="aspect-[4/5] rounded overflow-hidden bg-zinc-100">
                    <img
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
                      alt="Studio Headphones"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 font-semibold text-[9px] sm:text-[10px]">
                      74% match
                    </span>
                    <p className="text-[11px] sm:text-xs font-semibold text-zinc-900 truncate mt-1">
                      Noise-Cancelling Audio
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-zinc-500 truncate">Sony • $299</p>
                  </div>
                </div>

                {/* Result Item 3 */}
                <div className="p-2 sm:p-2.5 rounded-md border border-zinc-200 bg-zinc-50/50 space-y-1.5 sm:space-y-2 text-left min-w-0">
                  <div className="aspect-[4/5] rounded overflow-hidden bg-zinc-100">
                    <img
                      src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=400&q=80"
                      alt="Chronograph Watch"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 font-semibold text-[9px] sm:text-[10px]">
                      68% match
                    </span>
                    <p className="text-[11px] sm:text-xs font-semibold text-zinc-900 truncate mt-1">
                      Automatic Chronograph
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-zinc-500 truncate">Seiko • $385</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenVisualSearch}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-subtle"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Try Visual Search Now</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
