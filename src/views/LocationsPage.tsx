'use client';

import Link from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { erodeLocations } from '../data/erodeLocations';
import { mockProperties } from '../data/mockProperties';

export function LocationsPage() {
  return (
    <div>
      {/* Hero Header */}
      <section className="bg-charcoal-deep text-ivory py-20 border-b border-emerald-900/30">
        <div className="container-xl text-center max-w-2xl mx-auto">
          <span className="label-eyebrow !text-ruby-bright mb-3 block">Erode District Coverage</span>
          <h1 className="font-display text-4xl sm:text-5xl mb-6 leading-tight">
            Explore Properties by Location
          </h1>
          <p className="text-[15px] leading-relaxed text-ivory/70 font-light">
            Raja Construction brings you luxury villas, penthouses, and custom plots across the most sought-after
            townships and hubs in Erode District, Tamil Nadu.
          </p>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="container-xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {erodeLocations.map((loc) => {
            const count = mockProperties.filter((p) =>
              p.location.toLowerCase().includes(loc.locationQuery.toLowerCase()),
            ).length;

            return (
              <Link
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className="group bg-white border border-emerald-900/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={loc.heroImage}
                    alt={loc.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep/90 via-charcoal-deep/30 to-transparent" />
                  <div className="absolute top-4 right-4 bg-ruby text-ivory text-[10px] uppercase font-semibold tracking-wider px-3 py-1 shadow-md">
                    {count} {count === 1 ? 'Property' : 'Properties'}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display text-2xl text-ivory mb-1 group-hover:text-emerald-300 transition-colors">
                      {loc.name}
                    </h3>
                    <p className="text-[12px] text-ruby-bright uppercase tracking-wider font-semibold">
                      {loc.tagline}
                    </p>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-[13px] text-stone leading-relaxed line-clamp-3">
                    {loc.description}
                  </p>

                  <div className="space-y-3 pt-2 border-t border-emerald-900/10">
                    <div className="flex flex-wrap gap-1.5">
                      {loc.highlights.slice(0, 3).map((h) => (
                        <span
                          key={h}
                          className="text-[10px] bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 border border-emerald-200/60"
                        >
                          {h}
                        </span>
                      ))}
                    </div>

                    <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-800 font-semibold group-hover:text-ruby transition-colors flex items-center justify-between pt-1">
                      <span>View Location Properties</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Custom Construction CTA */}
      <section className="bg-emerald-950 text-ivory py-16 border-t border-emerald-900/30">
        <div className="container-xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-xl">
            <span className="label-eyebrow !text-ruby-bright mb-2 block">Custom Engineering & Construction</span>
            <h2 className="font-display text-3xl mb-3">Own a plot in Erode district?</h2>
            <p className="text-[14px] text-ivory/70 font-light">
              Raja Construction offers full-service architectural design, structural engineering, and luxury home construction anywhere in Erode district.
            </p>
          </div>
          <Link href="/properties" className="btn-red shrink-0">
            Contact Project Team
          </Link>
        </div>
      </section>
    </div>
  );
}
