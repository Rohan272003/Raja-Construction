'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { Hero } from '../components/home/Hero';
import { FeaturedProperties } from '../components/home/FeaturedProperties';
import { FeaturedLocations } from '../components/home/FeaturedLocations';
import { WhyUs } from '../components/home/WhyUs';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProperties } from '../store/slices/propertiesSlice';

export function HomePage() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.properties.status);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProperties());
  }, [status, dispatch]);

  return (
    <>
      <Hero />
      <FeaturedProperties />
      <FeaturedLocations />
      <WhyUs />

      <section className="container-xl py-24 text-center">
        <span className="label-eyebrow mb-4 block">Ready When You Are</span>
        <h2 className="font-display text-4xl max-w-xl mx-auto mb-8">
          Begin your search, or speak with a private advisor
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/properties" className="btn-primary">
            Browse Properties
          </Link>
          <Link href="/signup" className="btn-outline">
            Create an Account
          </Link>
        </div>
      </section>
    </>
  );
}
