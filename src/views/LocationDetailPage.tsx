'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { erodeLocations } from '../data/erodeLocations';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProperties } from '../store/slices/propertiesSlice';
import { PropertyCard } from '../components/properties/PropertyCard';

export function LocationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { items: properties, status, error } = useAppSelector((s) => s.properties);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProperties());
    }
  }, [dispatch, status]);

  const locationInfo = erodeLocations.find((l) => l.slug.toLowerCase() === slug?.toLowerCase());

  if (!locationInfo) {
    return (
      <div className="container-xl py-32 text-center">
        <h1 className="font-display text-3xl mb-4 text-emerald-950">Location Not Found</h1>
        <p className="text-stone text-sm mb-8">We could not find the requested location in Erode district.</p>
        <Link href="/locations" className="btn-primary">
          Back to All Locations
        </Link>
      </div>
    );
  }

  // Filter properties by location from real state
  const matchingProperties = properties.filter(
    (p) =>
      p.location.toLowerCase().includes(locationInfo.locationQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(locationInfo.name.toLowerCase()) ||
      p.description.toLowerCase().includes(locationInfo.name.toLowerCase())
  );

  return (
    <div>
      {/* Location Banner */}
      <section className="relative bg-charcoal-deep text-ivory py-24 border-b border-emerald-900/30 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={locationInfo.heroImage} alt={locationInfo.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-charcoal-deep/90" />
        </div>

        <div className="container-xl relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Link href="/locations" className="text-[11px] uppercase tracking-[0.2em] text-emerald-400 hover:underline">
                  Locations
                </Link>
                <span className="text-ivory/40">/</span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-ruby-bright font-semibold">
                  Erode District
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl text-ivory mb-2">{locationInfo.name}</h1>
              <p className="text-lg text-emerald-300 font-serif italic">{locationInfo.tagline}</p>
            </div>

            <div className="bg-emerald-900/40 border border-emerald-700/30 px-6 py-4 rounded backdrop-blur">
              <span className="text-[11px] uppercase tracking-wider text-ivory/60 block">Available Listings</span>
              <span className="font-display text-3xl text-ruby-bright font-bold">
                {matchingProperties.length} {matchingProperties.length === 1 ? 'Property' : 'Properties'}
              </span>
            </div>
          </div>

          <p className="text-[14.5px] leading-relaxed text-ivory/80 max-w-3xl font-light mb-8">
            {locationInfo.description}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] uppercase tracking-wider text-ivory/50 mr-2">Key Highlights:</span>
            {locationInfo.highlights.map((h) => (
              <span
                key={h}
                className="text-[11px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-3 py-1 rounded-full"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Property Listings in Location */}
      <section className="container-xl py-16">
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-emerald-900/10">
          <div>
            <h2 className="font-display text-2xl text-emerald-950">Residences & Projects in {locationInfo.name}</h2>
            <p className="text-xs text-stone mt-1">Showing premier properties represented by Raja Construction</p>
          </div>
          <Link
            href="/properties"
            className="text-[11px] uppercase tracking-[0.2em] text-emerald-800 font-semibold hover:text-ruby transition-colors"
          >
            View All Erode Properties →
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
            <p className="text-ruby text-sm font-semibold">Failed to fetch properties for {locationInfo.name}: {error}</p>
            <button onClick={() => dispatch(fetchProperties())} className="btn-red text-xs">
              ↻ Retry Loading Listings
            </button>
          </div>
        )}

        {status === 'succeeded' && matchingProperties.length === 0 && (
          <div className="bg-emerald-50/50 border border-emerald-900/10 p-12 text-center rounded">
            <h3 className="font-display text-xl mb-3 text-emerald-950">No Active Public Listings in {locationInfo.name}</h3>
            <p className="text-stone text-sm max-w-md mx-auto mb-6">
              We frequently handle private off-market listings and custom plot constructions in {locationInfo.name}. Contact our team for introductions.
            </p>
            <Link href="/properties" className="btn-primary">
              Browse All Properties
            </Link>
          </div>
        )}

        {status === 'succeeded' && matchingProperties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matchingProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>

      {/* Other Locations Grid */}
      <section className="bg-ivory py-16 border-t border-emerald-900/10">
        <div className="container-xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="label-eyebrow mb-2 block">Explore Nearby</span>
            <h2 className="font-display text-3xl text-emerald-950">Other Popular Locations in Erode</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {erodeLocations
              .filter((l) => l.slug !== locationInfo.slug)
              .slice(0, 5)
              .map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/locations/${loc.slug}`}
                  className="group bg-white p-4 border border-emerald-900/10 hover:border-ruby text-center transition-all shadow-sm hover:shadow"
                >
                  <span className="font-display text-base block text-emerald-950 group-hover:text-ruby transition-colors">
                    {loc.name}
                  </span>
                  <span className="text-[10px] text-stone uppercase tracking-wider block mt-1">
                    {loc.tagline.split('&')[0]}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
