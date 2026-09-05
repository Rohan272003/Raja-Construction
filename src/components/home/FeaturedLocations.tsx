'use client';

import Link from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { erodeLocations } from '../../data/erodeLocations';
import { mockProperties } from '../../data/mockProperties';

export function FeaturedLocations() {
  const topLocations = erodeLocations.slice(0, 4);

  return (
    <section className="bg-ivory py-24 border-t border-emerald-900/10">
      <div className="container-xl">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="label-eyebrow mb-3 block">Explore Erode District</span>
            <h2 className="font-display text-3xl sm:text-4xl text-emerald-950">Location-Wise Real Estate</h2>
          </div>
          <Link
            href="/locations"
            className="text-[11px] uppercase tracking-[0.2em] text-emerald-800 font-semibold hover:text-ruby transition-colors"
          >
            All Erode Locations ({erodeLocations.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topLocations.map((loc) => {
            const count = mockProperties.filter((p) =>
              p.location.toLowerCase().includes(loc.locationQuery.toLowerCase()),
            ).length;

            return (
              <Link
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className="group relative h-80 overflow-hidden border border-emerald-900/10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-6"
              >
                <img
                  src={loc.heroImage}
                  alt={loc.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep/95 via-charcoal-deep/40 to-transparent" />

                <div className="relative z-10">
                  <div className="inline-block bg-ruby text-ivory text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 mb-2">
                    {count} {count === 1 ? 'Listing' : 'Listings'}
                  </div>
                  <h3 className="font-display text-2xl text-ivory group-hover:text-emerald-300 transition-colors">
                    {loc.name}
                  </h3>
                  <p className="text-[12px] text-ivory/70 font-light mt-1 line-clamp-1">
                    {loc.tagline}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
