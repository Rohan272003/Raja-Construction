'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProperties } from '../store/slices/propertiesSlice';
import { PropertyCard } from '../components/properties/PropertyCard';
import { clearShortlist } from '../store/slices/shortlistSlice';

export function ShortlistPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const { items, status } = useAppSelector((s) => s.properties);
  const shortlistIds = useAppSelector((s) => s.shortlist.ids);

  useEffect(() => {
    if (!user) {
      router.push('/login?from=' + encodeURIComponent('/shortlist'));
    }
  }, [user, router]);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProperties());
  }, [status, dispatch]);

  const shortlisted = items.filter((p) => shortlistIds.includes(p.id));

  return (
    <div className="container-xl py-16">
      <div className="flex items-end justify-between mb-12">
        <div>
          <span className="label-eyebrow mb-3 block">Saved for Later</span>
          <h1 className="font-display text-4xl">Your Shortlist</h1>
        </div>
        {shortlisted.length > 0 && (
          <button onClick={() => dispatch(clearShortlist())} className="text-[11px] uppercase tracking-[0.2em] text-charcoal/60 hover:text-gold-deep underline underline-offset-4">
            Clear shortlist
          </button>
        )}
      </div>

      {shortlisted.length === 0 ? (
        <div className="text-center py-24 border border-charcoal/10">
          <p className="font-display text-2xl mb-3">Your shortlist is empty</p>
          <p className="text-stone text-[14px] mb-8">Save properties you love to compare them later.</p>
          <Link href="/properties" className="btn-primary">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {shortlisted.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
