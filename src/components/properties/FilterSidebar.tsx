'use client';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { resetFilters, setFilter } from '../../store/slices/propertiesSlice';
import { SelectField } from '../forms/SelectField';
import { FormField } from '../forms/FormField';

const propertyTypes = ['All', 'Villa', 'Penthouse', 'Estate', 'Apartment', 'Chalet'];
const statuses = ['All', 'For Sale', 'For Rent'];

export function FilterSidebar() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.properties.filters);
  const items = useAppSelector((s) => s.properties.items);
  const cities = ['All', ...Array.from(new Set(items.map((p) => p.city))).sort()];

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-7 lg:sticky lg:top-28 self-start">
      <div>
        <div className="label-eyebrow mb-4">Search</div>
        <FormField
          label="Keyword"
          placeholder="Thindal, Gobi, Bhavani, Villa…"
          value={filters.search}
          onChange={(e) => dispatch(setFilter({ search: e.target.value }))}
        />
      </div>

      <SelectField
        label="Property Type"
        value={filters.type}
        onChange={(e) => dispatch(setFilter({ type: e.target.value as typeof filters.type }))}
        options={propertyTypes.map((t) => ({ value: t, label: t }))}
      />

      <SelectField
        label="Status"
        value={filters.status}
        onChange={(e) => dispatch(setFilter({ status: e.target.value as typeof filters.status }))}
        options={statuses.map((t) => ({ value: t, label: t }))}
      />

      <SelectField
        label="City / Region"
        value={filters.city}
        onChange={(e) => dispatch(setFilter({ city: e.target.value }))}
        options={cities.map((c) => ({ value: c, label: c }))}
      />

      <div>
        <div className="label-eyebrow mb-4">Price Range (USD)</div>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Min"
            type="number"
            placeholder="0"
            value={filters.minPrice ?? ''}
            onChange={(e) => dispatch(setFilter({ minPrice: e.target.value ? Number(e.target.value) : null }))}
          />
          <FormField
            label="Max"
            type="number"
            placeholder="Any"
            value={filters.maxPrice ?? ''}
            onChange={(e) => dispatch(setFilter({ maxPrice: e.target.value ? Number(e.target.value) : null }))}
          />
        </div>
      </div>

      <SelectField
        label="Bedrooms (min)"
        value={filters.bedrooms ?? ''}
        onChange={(e) => dispatch(setFilter({ bedrooms: e.target.value ? Number(e.target.value) : null }))}
        options={[
          { value: '', label: 'Any' },
          { value: '2', label: '2+' },
          { value: '3', label: '3+' },
          { value: '4', label: '4+' },
          { value: '5', label: '5+' },
        ]}
      />

      <button onClick={() => dispatch(resetFilters())} className="text-[11px] uppercase tracking-[0.2em] text-charcoal/60 hover:text-gold-deep underline underline-offset-4">
        Reset all filters
      </button>
    </aside>
  );
}
