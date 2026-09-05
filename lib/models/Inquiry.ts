import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInquiry extends Document {
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  submittedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    propertyId: { type: String, required: true },
    propertyTitle: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    message: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

InquirySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id.toString();
    ret.submittedAt = ret.createdAt
      ? new Date(ret.createdAt).toISOString()
      : new Date().toISOString();
    delete ret._id;
    return ret;
  },
});

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);

export default Inquiry;
