import React from 'react';
import { Eye, ShieldCheck, Database, Layers } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section className="bg-white border-b border-zinc-200 py-16 sm:py-20">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-2xl mb-12 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Engineered For Trust
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
            Transparent discovery by design
          </h2>
          <p className="text-sm sm:text-base text-zinc-600">
            Built without black-box hype or fabricated scores. Every match is derived from authentic mathematical feature extraction and structured catalog metadata.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-5 rounded-lg border border-zinc-200 bg-zinc-50/50 space-y-2.5">
            <div className="h-8 w-8 rounded-md bg-white border border-zinc-200 flex items-center justify-center text-zinc-900">
              <Eye className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">
              Mathematical Similarity
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Calculates 64-bin HSV color histograms and 64-bit difference hashes for verifiable visual alignment without guessing.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-lg border border-zinc-200 bg-zinc-50/50 space-y-2.5">
            <div className="h-8 w-8 rounded-md bg-white border border-zinc-200 flex items-center justify-center text-zinc-900">
              <Layers className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">
              Explainable Matches
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Every visual recommendation exposes matched attributes: color harmony, geometric silhouette, and shared category tags.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-lg border border-zinc-200 bg-zinc-50/50 space-y-2.5">
            <div className="h-8 w-8 rounded-md bg-white border border-zinc-200 flex items-center justify-center text-zinc-900">
              <Database className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">
              Curated Index
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Directly indexed against structured catalog tables with validated manufacturers, real pricing, and genuine specifications.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-lg border border-zinc-200 bg-zinc-50/50 space-y-2.5">
            <div className="h-8 w-8 rounded-md bg-white border border-zinc-200 flex items-center justify-center text-zinc-900">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">
              Secure Image Ingestion
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Protected by multi-tier binary inspection: magic byte verification, strict 5MB boundaries, and safe image handling.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
