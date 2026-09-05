'use client';

import Link from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
import type { Property } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleShortlist } from '../../store/slices/shortlistSlice';
import { formatPrice } from '../../utils/format';

export function PropertyCard({ property }: { property: Property }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const location = usePathname();
  const user = useAppSelector((s) => s.auth.user);
  const isShortlisted = useAppSelector((s) => s.shortlist.ids.includes(property.id));

  const handleShortlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push(`/login?from=${encodeURIComponent(location)}`);
      return;
    }
    dispatch(toggleShortlist(property.id));
  };

  return (
    <div className="group bg-white border border-charcoal/10 hover:shadow-card transition-shadow">
      <div className="relative h-72 overflow-hidden">
        <Link href={`/properties/${property.id}`}>
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        <span className="absolute top-4 left-4 bg-emerald-950/90 text-emerald-300 text-[10px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 border border-emerald-800/40">
          {property.status}
        </span>
        <button
          onClick={handleShortlistToggle}
          aria-label="Toggle shortlist"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-ivory/90 hover:bg-ivory transition-colors shadow-sm"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill={isShortlisted ? '#DC2626' : 'none'}
            stroke="#DC2626"
            strokeWidth="1.5"
          >
            <path d="M12 21s-7.5-4.6-10-9.2C0.3 8.1 2 4.5 5.6 4c2-.3 3.9.6 5 2.3C11.7 4.6 13.6 3.7 15.6 4c3.6.5 5.3 4.1 3.6 7.8C21.5 16.4 12 21 12 21Z" />
          </svg>
        </button>
      </div>

      <div className="p-6">
        <div className="text-[11px] uppercase tracking-[0.2em] text-ruby font-semibold mb-2">{property.type}</div>
        <Link href={`/properties/${property.id}`}>
          <h3 className="font-display text-xl mb-1.5 leading-snug hover:text-emerald-800 transition-colors">{property.title}</h3>
        </Link>
        <p className="text-[13px] text-stone mb-4">
          {property.location}, {property.city}
        </p>

        <div className="flex items-center gap-4 text-[13px] text-charcoal/80 mb-5">
          <span>{property.bedrooms} Beds</span>
          <span className="w-1 h-1 rounded-full bg-emerald-700/40" />
          <span>{property.bathrooms} Baths</span>
          <span className="w-1 h-1 rounded-full bg-emerald-700/40" />
          <span>{property.areaSqft.toLocaleString()} sqft</span>
        </div>

        <div className="flex items-center justify-between border-t border-emerald-900/10 pt-4">
          <span className="font-display text-lg text-emerald-950">
            {formatPrice(property.price, property.currency)}
            {property.status === 'For Rent' && <span className="text-[12px] text-stone"> / mo</span>}
          </span>
          <Link href={`/properties/${property.id}`} className="text-[11px] uppercase tracking-[0.2em] text-emerald-800 font-semibold hover:text-ruby transition-colors">
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}
