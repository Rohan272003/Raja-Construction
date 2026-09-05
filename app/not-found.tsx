'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-xl py-28 text-center max-w-lg mx-auto space-y-6">
      <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl font-display">
        404
      </div>
      <div>
        <span className="label-eyebrow mb-2 block">Page Not Found</span>
        <h1 className="font-display text-3xl text-charcoal">Residences Catalog Not Found</h1>
        <p className="text-stone text-xs leading-relaxed mt-2">
          The requested page or listing URL could not be located in the Raja Construction portfolio.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 pt-2">
        <Link href="/properties" className="btn-primary text-xs">
          Explore All Properties
        </Link>
        <Link href="/" className="btn-outline text-xs">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
