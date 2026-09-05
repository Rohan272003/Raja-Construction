export type PropertyType = 'Villa' | 'Penthouse' | 'Estate' | 'Apartment' | 'Chalet';
export type PropertyStatus = 'For Sale' | 'For Rent';

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  currency: string;
  location: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  description: string;
  images: string[];
  amenities: string[];
  featured: boolean;
  yearBuilt: number;
  createdAt: string;
  ownerId?: string;
  ownerEmail?: string;
}

export interface PropertyFilters {
  search: string;
  type: PropertyType | 'All';
  city: string | 'All';
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
  status: PropertyStatus | 'All';
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'area-desc';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'client' | 'owner';
}

export interface InquiryPayload {
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

export interface InquiryRecord extends InquiryPayload {
  id: string;
  submittedAt: string;
}

export interface ApiError {
  message: string;
}
