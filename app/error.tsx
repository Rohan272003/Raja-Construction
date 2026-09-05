'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="container-xl py-28 text-center max-w-lg mx-auto space-y-6">
      <div className="w-16 h-16 mx-auto rounded-full bg-ruby/10 text-ruby flex items-center justify-center text-3xl">
        ⚠️
      </div>
      <div>
        <span className="label-eyebrow mb-2 block">Application Notice</span>
        <h1 className="font-display text-3xl text-charcoal">Something Went Wrong</h1>
        <p className="text-stone text-xs leading-relaxed mt-2">
          {error.message || 'An unexpected error occurred while loading this page. Our team has been notified.'}
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 pt-2">
        <button onClick={() => reset()} className="btn-red text-xs">
          ↻ Try Again
        </button>
        <Link href="/" className="btn-outline text-xs">
          Return to Home Page
        </Link>
      </div>
    </div>
  );
}
