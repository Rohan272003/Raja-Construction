'use client';

import { useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProperties, setFilter } from '../store/slices/propertiesSlice';
import { FilterSidebar } from '../components/properties/FilterSidebar';
import { SortBar } from '../components/properties/SortBar';
import { PropertyCard } from '../components/properties/PropertyCard';

function ListingsContent() {
  const dispatch = useAppDispatch();
  const { items, status, error, filters, sortBy } = useAppSelector((s) => s.properties);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProperties());
  }, [status, dispatch]);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) dispatch(setFilter({ search: q }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...items];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q),
      );
    }
    if (filters.type !== 'All') result = result.filter((p) => p.type === filters.type);
    if (filters.status !== 'All') result = result.filter((p) => p.status === filters.status);
    if (filters.city !== 'All') result = result.filter((p) => p.city === filters.city);
    if (filters.minPrice != null) result = result.filter((p) => p.price >= filters.minPrice!);
    if (filters.maxPrice != null) result = result.filter((p) => p.price <= filters.maxPrice!);
    if (filters.bedrooms != null) result = result.filter((p) => p.bedrooms >= filters.bedrooms!);

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'area-desc':
        result.sort((a, b) => b.areaSqft - a.areaSqft);
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [items, filters, sortBy]);

  return (
    <div className="container-xl py-16">
      <div className="mb-12">
        <span className="label-eyebrow mb-3 block">The Full Collection</span>
        <h1 className="font-display text-4xl">Properties</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <FilterSidebar />

        <div className="flex-1">
          <SortBar resultCount={filtered.length} />

          {status === 'loading' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[430px] bg-charcoal/5 animate-pulse" />
              ))}
            </div>
          )}

          {status === 'failed' && (
            <div className="text-center py-24 border border-charcoal/10">
              <p className="text-stone mb-4">{error}</p>
              <button onClick={() => dispatch(fetchProperties())} className="btn-outline">
                Try Again
              </button>
            </div>
          )}

          {status === 'succeeded' && filtered.length === 0 && (
            <div className="text-center py-24 border border-charcoal/10">
              <p className="font-display text-2xl mb-2">No properties match your search</p>
              <p className="text-stone text-[14px]">Try adjusting or resetting your filters.</p>
            </div>
          )}

          {status === 'succeeded' && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filtered.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ListingsPage() {
  return (
    <Suspense fallback={<div className="container-xl py-16 text-stone text-center">Loading properties…</div>}>
      <ListingsContent />
    </Suspense>
  );
}
