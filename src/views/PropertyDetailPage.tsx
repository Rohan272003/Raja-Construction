'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProperties } from '../store/slices/propertiesSlice';
import { toggleShortlist } from '../store/slices/shortlistSlice';
import { formatPrice } from '../utils/format';

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((s) => s.auth.user);
  const { items, status } = useAppSelector((s) => s.properties);
  const isShortlisted = useAppSelector((s) => s.shortlist.ids.includes(id ?? ''));
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProperties());
  }, [status, dispatch]);

  const property = items.find((p) => p.id === id);

  const handleShortlistToggle = () => {
    if (!property) return;
    if (!user) {
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }
    dispatch(toggleShortlist(property.id));
  };

  if (status === 'loading' || status === 'idle') {
    return <div className="container-xl py-32 text-center text-stone">Loading residence details…</div>;
  }

  if (!property) {
    return (
      <div className="container-xl py-32 text-center">
        <p className="font-display text-2xl mb-4">Property not found</p>
        <Link href="/properties" className="btn-outline">
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="relative h-[60vh] min-h-[440px]">
        <img src={property.images[activeImage]} alt={property.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container-xl pb-10 flex items-end justify-between text-ivory">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-gold-bright">{property.type} · {property.status}</span>
            <h1 className="font-display text-4xl md:text-5xl mt-2">{property.title}</h1>
            <p className="text-ivory/70 mt-1">{property.location}, {property.city}</p>
          </div>
          <div className="font-display text-3xl hidden sm:block">
            {formatPrice(property.price, property.currency)}
            {property.status === 'For Rent' && <span className="text-[13px] text-ivory/70"> / mo</span>}
          </div>
        </div>
      </div>

      {property.images.length > 1 && (
        <div className="container-xl flex gap-3 py-4 overflow-x-auto">
          {property.images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActiveImage(i)}
              className={`h-20 w-28 shrink-0 overflow-hidden border-2 ${i === activeImage ? 'border-gold-deep' : 'border-transparent'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="container-xl grid grid-cols-1 lg:grid-cols-3 gap-16 mt-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-3 divide-x divide-charcoal/10 border-y border-charcoal/10 py-6 mb-10">
            <div className="text-center">
              <div className="font-display text-2xl">{property.bedrooms}</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-stone mt-1">Bedrooms</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl">{property.bathrooms}</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-stone mt-1">Bathrooms</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl">{property.areaSqft.toLocaleString()}</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-stone mt-1">Sqft</div>
            </div>
          </div>

          <span className="label-eyebrow mb-4 block">About This Residence</span>
          <p className="text-[15px] leading-relaxed text-charcoal/80 font-light mb-10">{property.description}</p>

          <span className="label-eyebrow mb-4 block">Amenities</span>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
            {property.amenities.map((a) => (
              <li key={a} className="flex items-center gap-2 text-[13.5px] text-charcoal/80">
                <span className="w-1 h-1 rounded-full bg-gold-deep shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </div>

        <aside className="border border-charcoal/10 p-8 h-fit sticky top-28">
          <div className="font-display text-2xl mb-1">
            {formatPrice(property.price, property.currency)}
            {property.status === 'For Rent' && <span className="text-[13px] text-stone"> / mo</span>}
          </div>
          <p className="text-[13px] text-stone mb-6">Built {property.yearBuilt} · {property.status}</p>

          <button onClick={() => router.push(`/schedule-visit/${property.id}`)} className="btn-primary w-full mb-3">
            Schedule a Private Viewing
          </button>
          <button
            onClick={handleShortlistToggle}
            className="btn-outline w-full"
          >
            {isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
          </button>

          <div className="mt-8 pt-6 border-t border-charcoal/10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone mb-2">Project Advisor</p>
            <p className="font-display text-lg">Raja Construction Team</p>
            <p className="text-[13px] text-stone">contact@rajaconstruction.com</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
