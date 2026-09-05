import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Property from '../../../../lib/models/Property';
import mongoose from 'mongoose';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id: propertyId } = await params;

    let property;
    // Support both MongoDB ObjectId and legacy string IDs
    if (mongoose.Types.ObjectId.isValid(propertyId)) {
      property = await Property.findById(propertyId);
    }
    if (!property) {
      // Fallback: search by legacy id field if stored
      property = await Property.findOne({ _id: propertyId });
    }

    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(property.toJSON());
  } catch (error) {
    console.error('GET /api/properties/[id] error:', error);
    return NextResponse.json({ message: 'Property not found' }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id: propertyId } = await params;

    let result;
    if (mongoose.Types.ObjectId.isValid(propertyId)) {
      result = await Property.findByIdAndDelete(propertyId);
    }

    if (!result) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ id: propertyId, message: 'Property removed successfully' });
  } catch (error) {
    console.error('DELETE /api/properties/[id] error:', error);
    return NextResponse.json({ message: 'Failed to delete property' }, { status: 500 });
  }
}
