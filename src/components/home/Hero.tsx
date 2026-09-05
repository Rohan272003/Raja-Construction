'use client';

import Link from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const ThreeBackground = dynamic(
  () => import('./ThreeBackground').then((mod) => mod.ThreeBackground),
  { ssr: false }
);

export function Hero() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query ? `/properties?search=${encodeURIComponent(query)}` : '/properties');
  };

  return (
    <section className="relative min-h-[86vh] overflow-hidden bg-[#061d15]">
      {/* Luxury overlay gradient */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(100deg, rgba(6,29,21,0.95) 0%, rgba(6,29,21,0.7) 45%, rgba(6,29,21,0.1) 85%)",
        }}
      />

      {/* 3D Animated Background */}
      <ThreeBackground />
      <div className="relative z-10 container-xl h-full flex flex-col justify-center pt-40 pb-24 min-h-[86vh]">
        <span className="label-eyebrow !text-ruby-bright mb-6">A Private Portfolio of Fine Residences</span>
        <h1 className="font-display text-5xl md:text-6xl leading-[1.1] text-ivory max-w-2xl mb-6">
          Homes considered <em className="italic text-emerald-bright font-medium">worth finding</em>
        </h1>
        <p className="text-ivory/70 max-w-md text-[16px] leading-relaxed mb-10 font-light">
          Villas, estates and penthouses selected for their architecture, setting and story — represented with quiet discretion.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by area (e.g. Thindal, Perundurai, Gobi, Bhavani)…"
            className="flex-1 bg-ivory/10 border border-ivory/25 text-ivory placeholder:text-ivory/50 px-5 py-4 text-[14px] focus:outline-none focus:border-ruby-bright"
          />
          <button type="submit" className="btn-red whitespace-nowrap">
            Search Residences
          </button>
        </form>

        <div className="flex gap-10 mt-14 pt-8 border-t border-ivory/15 max-w-xl">
          <div>
            <div className="font-display text-3xl text-emerald-bright">180+</div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-ivory/60 mt-1">Exclusive Listings</div>
          </div>
          <div>
            <div className="font-display text-3xl text-ruby-bright">24</div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-ivory/60 mt-1">Countries</div>
          </div>
          <div>
            <div className="font-display text-3xl text-emerald-bright">15</div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-ivory/60 mt-1">Years of Trust</div>
          </div>
        </div>
      </div>
    </section>
  );
}
