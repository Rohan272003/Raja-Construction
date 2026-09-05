'use client';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setSortBy } from '../../store/slices/propertiesSlice';
import type { SortOption } from '../../types';

export function SortBar({ resultCount }: { resultCount: number }) {
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector((s) => s.properties.sortBy);

  return (
    <div className="flex items-center justify-between mb-8 pb-6 border-b border-charcoal/10">
      <p className="text-[13px] text-stone">
        {resultCount} {resultCount === 1 ? 'property' : 'properties'} found
      </p>
      <div className="flex items-center gap-3">
        <label htmlFor="sort" className="text-[11px] uppercase tracking-[0.2em] text-stone">
          Sort
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value as SortOption))}
          className="border border-charcoal/15 bg-white px-3 py-2 text-[13px] focus:outline-none focus:border-gold-deep"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="area-desc">Largest Area</option>
        </select>
      </div>
    </div>
  );
}
