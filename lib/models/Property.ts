import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  type: 'Villa' | 'Penthouse' | 'Estate' | 'Apartment' | 'Chalet';
  status: 'For Sale' | 'For Rent';
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
  ownerId?: string;
  ownerEmail?: string;
  createdAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ['Villa', 'Penthouse', 'Estate', 'Apartment', 'Chalet'],
    },
    status: {
      type: String,
      required: true,
      enum: ['For Sale', 'For Rent'],
    },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    location: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    areaSqft: { type: Number, required: true },
    description: { type: String, default: '' },
    images: [{ type: String }],
    amenities: [{ type: String }],
    featured: { type: Boolean, default: false },
    yearBuilt: { type: Number, default: new Date().getFullYear() },
    ownerId: { type: String },
    ownerEmail: { type: String },
  },
  {
    timestamps: true,
  }
);

// Virtual to expose `id` as a string (matching the frontend type)
PropertySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id.toString();
    ret.createdAt =
      ret.createdAt instanceof Date
        ? ret.createdAt.toISOString().split('T')[0]
        : ret.createdAt;
    delete ret._id;
    return ret;
  },
});

const Property: Model<IProperty> =
  mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);

export default Property;
