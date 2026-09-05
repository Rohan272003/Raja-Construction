'use client';

import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchProperties } from '../../store/slices/propertiesSlice';
import { PropertyCard } from '../properties/PropertyCard';

export function FeaturedProperties() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((s) => s.properties);
  const featured = items.filter((p) => p.featured).slice(0, 3);
  const displayProperties = featured.length > 0 ? featured : items.slice(0, 3);

  return (
    <section className="container-xl py-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <span className="label-eyebrow mb-3 block">Curated Selection</span>
          <h2 className="font-display text-4xl">
            Featured <span className="italic text-gold-deep">Residences</span>
          </h2>
        </div>
        <Link href="/properties" className="hidden sm:block text-[12px] uppercase tracking-[0.2em] border-b border-gold-deep pb-1 text-charcoal hover:text-gold-deep">
          View All Properties →
        </Link>
      </div>

      {status === 'loading' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[430px] bg-charcoal/5 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {status === 'failed' && (
        <div className="bg-ruby/5 border border-ruby/20 p-8 rounded-xl text-center space-y-4">
          <p className="text-ruby text-sm font-semibold">Failed to load featured residences: {error || 'Network error'}</p>
          <button onClick={() => dispatch(fetchProperties())} className="btn-red text-xs">
            ↻ Retry Loading Properties
          </button>
        </div>
      )}

      {status === 'succeeded' && displayProperties.length === 0 && (
        <div className="bg-white border border-emerald-900/15 p-12 text-center rounded-xl space-y-3">
          <p className="font-display text-xl text-charcoal">No Featured Properties Available</p>
          <p className="text-stone text-xs">Check back soon or explore our full property catalog.</p>
          <Link href="/properties" className="btn-primary !px-6 text-xs inline-block">
            Browse All Listings
          </Link>
        </div>
      )}

      {status === 'succeeded' && displayProperties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </section>
  );
}
