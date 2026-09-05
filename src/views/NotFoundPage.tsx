'use client';

import Link from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';

export function NotFoundPage() {
  return (
    <div className="container-xl py-32 text-center">
      <span className="label-eyebrow mb-3 block">404</span>
      <h1 className="font-display text-4xl mb-6">This page has moved, or never existed</h1>
      <Link href="/" className="btn-primary">
        Return Home
      </Link>
    </div>
  );
}
