'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { deleteProperty, fetchProperties } from '../store/slices/propertiesSlice';
import { AddPropertyModal } from '../components/owner/AddPropertyModal';
import type { Property } from '../types';

export function OwnerDashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { items: properties, status } = useAppSelector((s) => s.properties);

  const [activeTab, setActiveTab] = useState<'all' | 'custom' | 'catalog'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProperties());
    }
  }, [dispatch, status]);

  // Categories
  const customProperties = properties.filter(
    (p) => p.ownerId === user?.id || p.ownerEmail === user?.email || p.id.startsWith('p-custom-')
  );
  const catalogProperties = properties.filter(
    (p) => !p.id.startsWith('p-custom-') && p.ownerId !== user?.id && p.ownerEmail !== user?.email
  );

  // Active list based on selected tab
  let displayedProperties = properties;
  if (activeTab === 'custom') {
    displayedProperties = customProperties;
  } else if (activeTab === 'catalog') {
    displayedProperties = catalogProperties;
  }

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    displayedProperties = displayedProperties.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query)
    );
  }

  const totalImages = properties.reduce((acc, p) => acc + (p.images?.length || 0), 0);

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteProperty(propertyToDelete.id)).unwrap();
      setNotification(`Property "${propertyToDelete.title}" has been successfully removed.`);
      setPropertyToDelete(null);
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      console.error('Failed to remove property:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user || user.role !== 'owner') {
    return (
      <div className="container-xl py-24 text-center max-w-xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-ruby/10 text-ruby flex items-center justify-center text-3xl mb-4">
          🏢
        </div>
        <span className="label-eyebrow mb-2 block">Owner Portal Restricted</span>
        <h1 className="font-display text-3xl mb-4">Owner Login Required</h1>
        <p className="text-stone text-sm mb-8">
          You are currently not signed in as a Property Owner. Please log in with an Owner Account to access the property dashboard.
        </p>
        <Link href="/login?from=/owner/dashboard" className="btn-red">
          Sign In as Owner
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen pb-24">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal text-white px-5 py-3 rounded-lg shadow-xl border border-emerald-500/30 flex items-center gap-3 animate-slideUp">
          <span className="text-emerald-400 font-bold">✓</span>
          <span className="text-xs font-medium">{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-charcoal text-ivory border-b border-emerald-900/30 py-12">
        <div className="container-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-ruby text-white text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded">
                Admin & Owner Portal
              </span>
              <span className="text-[12px] uppercase tracking-[0.2em] text-emerald-300 font-semibold">
                Raja Construction
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-white">
              Welcome, {user.name}
            </h1>
            <p className="text-ivory/70 text-xs tracking-wider mt-1">
              Owner Email: <span className="text-emerald-300 font-mono">{user.email}</span>
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="btn-red shadow-lg !px-6 !py-4 flex items-center gap-2 text-xs"
          >
            <span className="text-lg">+</span>
            <span>Upload New Property & Details</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container-xl pt-10">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white border border-emerald-900/15 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-stone font-semibold">
                Total System Properties
              </span>
              <span className="text-2xl">🏬</span>
            </div>
            <p className="font-display text-4xl text-emerald-900 mt-2">{properties.length}</p>
            <p className="text-[11px] text-stone/70 mt-1">All uploaded & pre-existing listings</p>
          </div>

          <div className="bg-white border border-emerald-900/15 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-stone font-semibold">
                Your Custom Uploads
              </span>
              <span className="text-2xl">✨</span>
            </div>
            <p className="font-display text-4xl text-ruby mt-2">{customProperties.length}</p>
            <p className="text-[11px] text-stone/70 mt-1">Uploaded by owner account</p>
          </div>

          <div className="bg-white border border-emerald-900/15 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-stone font-semibold">
                Catalog Properties
              </span>
              <span className="text-2xl">🏛️</span>
            </div>
            <p className="font-display text-4xl text-emerald-800 mt-2">{catalogProperties.length}</p>
            <p className="text-[11px] text-stone/70 mt-1">Pre-existing architectural listings</p>
          </div>

          <div className="bg-white border border-emerald-900/15 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-stone font-semibold">
                Total Gallery Photos
              </span>
              <span className="text-2xl">📸</span>
            </div>
            <p className="font-display text-4xl text-gold-bright mt-2">{totalImages}</p>
            <p className="text-[11px] text-stone/70 mt-1">High-resolution image assets</p>
          </div>
        </div>

        {/* Filter Tabs & Search Controls */}
        <div className="bg-white border border-emerald-900/15 p-4 rounded-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors ${
                activeTab === 'all'
                  ? 'bg-charcoal text-white shadow-sm'
                  : 'text-stone hover:bg-stone/10'
              }`}
            >
              All Uploaded ({properties.length})
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors ${
                activeTab === 'custom'
                  ? 'bg-ruby text-white shadow-sm'
                  : 'text-stone hover:bg-stone/10'
              }`}
            >
              Owner Uploads ({customProperties.length})
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors ${
                activeTab === 'catalog'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone hover:bg-stone/10'
              }`}
            >
              Catalog Properties ({catalogProperties.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties by title or location..."
              className="field-input !py-2 text-xs pl-8"
            />
            <span className="absolute left-2.5 top-2.5 text-xs text-stone">🔍</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/10 pb-4 mb-6">
          <div>
            <span className="label-eyebrow mb-1 block">Property Management</span>
            <h2 className="font-display text-2xl text-charcoal">
              {activeTab === 'all'
                ? 'All System & Uploaded Properties'
                : activeTab === 'custom'
                ? 'Owner Uploaded Properties'
                : 'Pre-existing Catalog Properties'}
            </h2>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="text-xs uppercase tracking-wider text-ruby hover:text-ruby-deep font-semibold underline underline-offset-4"
          >
            + Upload New Property
          </button>
        </div>

        {/* Properties Grid */}
        {displayedProperties.length === 0 ? (
          <div className="bg-white border border-emerald-900/15 p-12 text-center rounded-xl space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl">
              🔍
            </div>
            <h3 className="font-display text-xl text-charcoal">No Properties Found</h3>
            <p className="text-stone text-xs max-w-md mx-auto">
              No listings matched your search criteria or category filter. Try clearing your search query or upload a new property.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="btn-red !px-8"
            >
              Upload New Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProperties.map((property: Property) => {
              const isCustom = property.id.startsWith('p-custom-') || property.ownerId === user?.id;

              return (
                <div
                  key={property.id}
                  className="bg-white border border-emerald-900/15 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Image Preview */}
                    <div className="relative aspect-[16/10] bg-charcoal overflow-hidden group">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {isCustom ? (
                          <span className="bg-ruby text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold shadow">
                            ★ Owner Upload
                          </span>
                        ) : (
                          <span className="bg-emerald-800 text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold shadow">
                            Catalog
                          </span>
                        )}
                        <span className="bg-charcoal/80 backdrop-blur text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-semibold">
                          {property.type}
                        </span>
                      </div>

                      {/* Delete Quick Button Overlay */}
                      <button
                        onClick={() => setPropertyToDelete(property)}
                        title="Remove Property Listing"
                        className="absolute top-3 right-3 bg-ruby/90 text-white hover:bg-ruby p-2 rounded-full shadow transition-transform hover:scale-110"
                      >
                        🗑️
                      </button>

                      <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded font-mono">
                        📷 {property.images.length} Photos
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4">
                      <div>
                        <span className="text-[11px] uppercase tracking-widest text-emerald-800 font-semibold block mb-1">
                          {property.location}, {property.city}
                        </span>
                        <h3 className="font-display text-xl text-charcoal line-clamp-1">
                          {property.title}
                        </h3>
                        <p className="text-stone text-xs line-clamp-2 mt-2">
                          {property.description}
                        </p>
                      </div>

                      {/* Specs Pill */}
                      <div className="flex items-center justify-between text-xs text-stone/80 border-t border-b border-emerald-900/10 py-2 font-medium">
                        <span>🛏️ {property.bedrooms} Beds</span>
                        <span>🚿 {property.bathrooms} Baths</span>
                        <span>📐 {property.areaSqft.toLocaleString()} sqft</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Price & Action Buttons */}
                  <div className="p-5 pt-0 border-t border-emerald-900/10 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone block">Asking Price</span>
                      <span className="font-display text-xl text-emerald-900 font-bold">
                        ${property.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPropertyToDelete(property)}
                        className="px-3 py-2 border border-ruby/40 text-ruby text-[11px] font-semibold uppercase tracking-wider hover:bg-ruby hover:text-white rounded transition-colors"
                      >
                        Remove
                      </button>
                      <Link
                        href={`/properties/${property.id}`}
                        className="btn-outline !px-3 !py-2 text-[11px]"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Property Modal */}
      <AddPropertyModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />

      {/* Deletion Confirmation Modal */}
      {propertyToDelete && (
        <div className="fixed inset-0 z-50 bg-charcoal-deep/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ivory border border-ruby/30 rounded-xl shadow-2xl p-6 md:p-8 max-w-md w-full space-y-5 animate-scaleUp">
            <div className="w-14 h-14 rounded-full bg-ruby/10 text-ruby flex items-center justify-center text-2xl mx-auto">
              🗑️
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-display text-2xl text-charcoal">Remove Property Listing?</h3>
              <p className="text-stone text-xs leading-relaxed">
                Are you sure you want to remove <strong className="text-charcoal">{propertyToDelete.title}</strong>? This property will be permanently deleted from active catalog listings.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPropertyToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-3 border border-emerald-900/20 text-stone text-xs uppercase tracking-wider font-semibold hover:bg-stone/10 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 btn-red !py-3 text-xs disabled:opacity-60"
              >
                {isDeleting ? 'Removing...' : 'Confirm Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
