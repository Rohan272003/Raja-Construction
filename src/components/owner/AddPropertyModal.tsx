'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addProperty } from '../../store/slices/propertiesSlice';
import { FormField } from '../forms/FormField';

const PRESET_IMAGES = [
  { id: '1', title: 'Modern Villa Exterior', url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=80' },
  { id: '2', title: 'Luxury Penthouse Interior', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80' },
  { id: '3', title: 'Infinity Pool & Lawn', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80' },
  { id: '4', title: 'Contemporary Living Room', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80' },
  { id: '5', title: 'Heritage Estate Pavilion', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80' },
  { id: '6', title: 'Riverfront Oasis', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80' },
];

const DEFAULT_AMENITIES = [
  'Infinity Pool',
  'Private Garden',
  'Smart Home System',
  'Solar Power',
  'Home Cinema',
  'Staff Quarters',
  'Rooftop Garden',
  'Temple Views',
  'Concierge Service',
  'Private Gym',
  'EV Charging Station',
  'CCTV Security',
];

const currentYear = new Date().getFullYear();

const propertySchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Title must be at least 5 characters long')
    .max(100, 'Title cannot exceed 100 characters'),
  type: z.enum(['Villa', 'Penthouse', 'Estate', 'Apartment', 'Chalet'], {
    required_error: 'Please select a valid property type',
  }),
  status: z.enum(['For Sale', 'For Rent'], {
    required_error: 'Please select a status',
  }),
  price: z.coerce
    .number({ invalid_type_error: 'Price must be a number' })
    .min(1000, 'Price must be at least $1,000')
    .max(100000000, 'Price cannot exceed $100,000,000'),
  currency: z.string().min(1, 'Currency is required').default('USD'),
  location: z
    .string()
    .trim()
    .min(3, 'Location / Address is required (min 3 characters)'),
  city: z.string().min(2, 'City selection is required'),
  bedrooms: z.coerce
    .number({ invalid_type_error: 'Bedrooms must be a number' })
    .min(1, 'Minimum 1 bedroom required')
    .max(50, 'Bedrooms cannot exceed 50'),
  bathrooms: z.coerce
    .number({ invalid_type_error: 'Bathrooms must be a number' })
    .min(1, 'Minimum 1 bathroom required')
    .max(50, 'Bathrooms cannot exceed 50'),
  areaSqft: z.coerce
    .number({ invalid_type_error: 'Area must be a number' })
    .min(100, 'Area must be at least 100 sq ft')
    .max(500000, 'Area cannot exceed 500,000 sq ft'),
  yearBuilt: z.coerce
    .number({ invalid_type_error: 'Year must be a number' })
    .min(1800, 'Year must be 1800 or later')
    .max(currentYear + 2, `Year cannot exceed ${currentYear + 2}`),
  description: z
    .string()
    .trim()
    .min(20, 'Description must be at least 20 characters long')
    .max(3000, 'Description cannot exceed 3000 characters'),
  featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof propertySchema>;

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPropertyModal({ isOpen, onClose }: AddPropertyModalProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Smart Home System', 'CCTV Security']);
  const [customAmenity, setCustomAmenity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom non-field errors
  const [imageError, setImageError] = useState('');
  const [amenityError, setAmenityError] = useState('');
  const [submitSummaryError, setSubmitSummaryError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(propertySchema),
    mode: 'onTouched',
    defaultValues: {
      type: 'Villa',
      status: 'For Sale',
      currency: 'USD',
      city: 'Erode',
      bedrooms: 4,
      bathrooms: 4,
      areaSqft: 4500,
      yearBuilt: currentYear,
      featured: true,
    },
  });

  if (!isOpen) return null;

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageError('');
    let added = 0;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setImageError('Please select valid image files (JPG, PNG, WEBP).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setImageError('Image size should be less than 10MB per file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
          added++;
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrl = () => {
    const cleanUrl = urlInput.trim();
    if (!cleanUrl) {
      setImageError('Please paste an image URL first.');
      return;
    }
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      setImageError('URL must start with http:// or https://');
      return;
    }
    setImageError('');
    setImages((prev) => [...prev, cleanUrl]);
    setUrlInput('');
  };

  const handleTogglePreset = (url: string) => {
    setImageError('');
    if (images.includes(url)) {
      setImages((prev) => prev.filter((img) => img !== url));
    } else {
      setImages((prev) => [...prev, url]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages((prev) => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
  };

  // Amenities Handlers
  const toggleAmenity = (amenity: string) => {
    setAmenityError('');
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleAddCustomAmenity = () => {
    const clean = customAmenity.trim();
    if (!clean) return;
    if (clean.length < 2) {
      setAmenityError('Amenity name must be at least 2 characters.');
      return;
    }
    setAmenityError('');
    if (!selectedAmenities.includes(clean)) {
      setSelectedAmenities((prev) => [...prev, clean]);
    }
    setCustomAmenity('');
  };

  const validateFormExtras = (): boolean => {
    let valid = true;
    setSubmitSummaryError('');

    if (images.length === 0) {
      setImageError('⚠️ At least 1 property image is required. Upload a file, enter a URL, or pick a preset photo.');
      valid = false;
    } else {
      setImageError('');
    }

    if (selectedAmenities.length === 0) {
      setAmenityError('⚠️ Please select at least 1 feature or amenity for this property.');
      valid = false;
    } else {
      setAmenityError('');
    }

    return valid;
  };

  const onSubmit = async (values: FormValues) => {
    const extrasValid = validateFormExtras();
    if (!extrasValid) {
      setSubmitSummaryError('Please fix missing images or amenities requirements before publishing.');
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        addProperty({
          ...values,
          images,
          amenities: selectedAmenities,
          ownerId: user?.id,
          ownerEmail: user?.email,
        })
      ).unwrap();

      reset();
      setImages([]);
      setSelectedAmenities(['Smart Home System', 'CCTV Security']);
      setSubmitSummaryError('');
      onClose();
    } catch (err) {
      console.error('Failed to add property:', err);
      setSubmitSummaryError('Failed to publish property. Please check inputs and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-deep/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6">
      <div className="bg-ivory text-charcoal border border-emerald-900/20 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-charcoal text-ivory px-6 py-5 flex items-center justify-between border-b border-emerald-800/30">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-bright font-semibold">
              Owner Listing Portal
            </span>
            <h2 className="font-display text-2xl text-white">Upload New Property & Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-ivory/70 hover:text-white text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Global Submit Summary Error Banner */}
        {(submitSummaryError || Object.keys(errors).length > 0) && (
          <div className="bg-ruby/10 border-b border-ruby/30 text-ruby px-6 py-3 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>
              {submitSummaryError ||
                `Form has ${Object.keys(errors).length} invalid field(s). Please review highlighted inputs below.`}
            </span>
          </div>
        )}

        {/* Modal Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-6 md:p-8 space-y-8 flex-1">
          {/* Section 1: Property Images Upload & Selection */}
          <div className="space-y-4">
            <div className="border-b border-emerald-900/10 pb-2 flex items-center justify-between">
              <h3 className="font-display text-xl text-emerald-900 flex items-center gap-2">
                <span>📸</span> 1. Property Images *
              </h3>
              <span className={`text-xs font-bold ${images.length > 0 ? 'text-emerald-800' : 'text-ruby'}`}>
                {images.length} Image(s) Attached
              </span>
            </div>

            {/* Upload Method 1 & 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-emerald-800/30 hover:border-emerald-800 bg-white p-5 rounded-lg text-center transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  id="file-upload-input"
                  className="hidden"
                />
                <label htmlFor="file-upload-input" className="cursor-pointer space-y-2 block">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl">
                    📁
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-900">
                    Upload Local Image Files
                  </div>
                  <p className="text-[11px] text-stone">JPG, PNG, WEBP files up to 10MB.</p>
                </label>
              </div>

              <div className="bg-white border border-emerald-900/15 p-5 rounded-lg flex flex-col justify-between">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-emerald-900 block">
                    Add Direct Image URL
                  </label>
                  <p className="text-[11px] text-stone">Paste image link from Unsplash, Imgur, or cloud storage.</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="field-input !py-2 text-xs flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    className="btn-primary !py-2 !px-4 text-xs shrink-0"
                  >
                    Add URL
                  </button>
                </div>
              </div>
            </div>

            {/* Method 3: Presets */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone block">
                Quick Select Sample High-Res Photos:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {PRESET_IMAGES.map((preset) => {
                  const isSelected = images.includes(preset.url);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleTogglePreset(preset.url)}
                      className={`relative aspect-video rounded overflow-hidden border-2 transition-all ${isSelected ? 'border-ruby scale-95 shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                    >
                      <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-ruby/30 flex items-center justify-center text-white font-bold text-xs">
                          ✓ Added
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Image Validation Error */}
            {imageError && (
              <div className="p-3 bg-ruby/10 border border-ruby/30 text-ruby text-xs rounded font-medium">
                {imageError}
              </div>
            )}

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-stone font-medium">
                  <span>Gallery Preview (First photo is Main Cover):</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((imgUrl, index) => (
                    <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border border-emerald-900/20 shadow-sm bg-black">
                      <img src={imgUrl} alt={`Property preview ${index + 1}`} className="w-full h-full object-cover" />
                      {index === 0 && (
                        <span className="absolute top-1 left-1 bg-ruby text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          Main Cover
                        </span>
                      )}
                      <div className="absolute inset-0 bg-charcoal-deep/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(index)}
                            title="Set as Main Cover Photo"
                            className="bg-white text-charcoal px-2 py-1 text-[10px] rounded font-semibold hover:bg-gold-bright"
                          >
                            ★ Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          title="Remove image"
                          className="bg-ruby text-white p-1 rounded-full text-xs hover:bg-ruby-deep"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: General Information */}
          <div className="space-y-4">
            <div className="border-b border-emerald-900/10 pb-2">
              <h3 className="font-display text-xl text-emerald-900 flex items-center gap-2">
                <span>📋</span> 2. Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FormField
                  label="Property Title *"
                  placeholder="e.g. Thindal Royal Crest Villa"
                  required
                  error={errors.title?.message}
                  {...register('title')}
                />
              </div>

              <div>
                <label className="field-label">Property Type *</label>
                <select
                  {...register('type')}
                  className={`field-input ${errors.type ? 'border-ruby ring-1 ring-ruby' : ''}`}
                >
                  <option value="Villa">Villa</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Estate">Estate</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Chalet">Chalet</option>
                </select>
                {errors.type && <p className="field-error">{errors.type.message}</p>}
              </div>

              <div>
                <label className="field-label">Listing Status *</label>
                <select
                  {...register('status')}
                  className={`field-input ${errors.status ? 'border-ruby ring-1 ring-ruby' : ''}`}
                >
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                </select>
                {errors.status && <p className="field-error">{errors.status.message}</p>}
              </div>

              <div>
                <FormField
                  label="Price ($ USD) *"
                  type="number"
                  placeholder="e.g. 4850000"
                  required
                  error={errors.price?.message}
                  {...register('price')}
                />
              </div>

              <div>
                <FormField
                  label="Location / Street Address *"
                  placeholder="e.g. Thindal Bypass Road, Near Temple"
                  required
                  error={errors.location?.message}
                  {...register('location')}
                />
              </div>

              <div>
                <label className="field-label">City / Region *</label>
                <select
                  {...register('city')}
                  className={`field-input ${errors.city ? 'border-ruby ring-1 ring-ruby' : ''}`}
                >
                  <option value="Erode">Erode</option>
                  <option value="Perundurai">Perundurai</option>
                  <option value="Gobichettipalayam">Gobichettipalayam</option>
                  <option value="Bhavani">Bhavani</option>
                  <option value="Sathyamangalam">Sathyamangalam</option>
                  <option value="Chennimalai">Chennimalai</option>
                  <option value="Modakurichi">Modakurichi</option>
                  <option value="Kodumudi">Kodumudi</option>
                  <option value="Bhavanisagar">Bhavanisagar</option>
                  <option value="Kavindapadi">Kavindapadi</option>
                </select>
                {errors.city && <p className="field-error">{errors.city.message}</p>}
              </div>

              <div>
                <FormField
                  label="Year Built *"
                  type="number"
                  placeholder="2026"
                  required
                  error={errors.yearBuilt?.message}
                  {...register('yearBuilt')}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Specifications */}
          <div className="space-y-4">
            <div className="border-b border-emerald-900/10 pb-2">
              <h3 className="font-display text-xl text-emerald-900 flex items-center gap-2">
                <span>📐</span> 3. Specifications & Dimensions
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                label="Bedrooms *"
                type="number"
                placeholder="4"
                required
                error={errors.bedrooms?.message}
                {...register('bedrooms')}
              />
              <FormField
                label="Bathrooms *"
                type="number"
                placeholder="5"
                required
                error={errors.bathrooms?.message}
                {...register('bathrooms')}
              />
              <FormField
                label="Area (Sq. Ft.) *"
                type="number"
                placeholder="5200"
                required
                error={errors.areaSqft?.message}
                {...register('areaSqft')}
              />
            </div>

            <div>
              <label className="field-label">Description *</label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Describe key architectural features, materials, view, neighborhood, and unique selling points..."
                className={`field-input ${errors.description ? 'border-ruby ring-1 ring-ruby' : ''}`}
              />
              {errors.description && <p className="field-error">{errors.description.message}</p>}
            </div>
          </div>

          {/* Section 4: Amenities */}
          <div className="space-y-4">
            <div className="border-b border-emerald-900/10 pb-2 flex items-center justify-between">
              <h3 className="font-display text-xl text-emerald-900 flex items-center gap-2">
                <span>✨</span> 4. Amenities & Features *
              </h3>
              <span className={`text-xs font-bold ${selectedAmenities.length > 0 ? 'text-emerald-800' : 'text-ruby'}`}>
                {selectedAmenities.length} Selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {DEFAULT_AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all ${isSelected
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm font-medium'
                        : 'bg-white text-stone border-emerald-900/20 hover:border-emerald-800'
                      }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {amenity}
                  </button>
                );
              })}
            </div>

            {/* Custom Amenity Input */}
            <div className="flex gap-2 max-w-sm pt-2">
              <input
                type="text"
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                placeholder="Add custom amenity..."
                className="field-input !py-2 text-xs"
              />
              <button
                type="button"
                onClick={handleAddCustomAmenity}
                className="btn-primary !py-2 !px-4 text-xs shrink-0"
              >
                Add Tag
              </button>
            </div>

            {amenityError && <p className="text-xs text-ruby font-medium">{amenityError}</p>}
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-3 bg-stone/5 p-4 rounded border border-stone/20">
            <input
              type="checkbox"
              id="featured-checkbox"
              {...register('featured')}
              className="w-4 h-4 text-ruby border-emerald-900/30 rounded focus:ring-ruby cursor-pointer"
            />
            <label htmlFor="featured-checkbox" className="text-xs font-semibold uppercase tracking-wider text-emerald-900 cursor-pointer">
              Mark as Featured Property (Highlights on Home Page Showcase)
            </label>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-emerald-900/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-emerald-900/20 text-stone text-xs uppercase tracking-wider font-semibold hover:bg-stone/10 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-red !px-8 disabled:opacity-60"
            >
              {isSubmitting ? 'Validating & Publishing...' : 'Publish Property Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
