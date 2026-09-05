import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Property from '../../../lib/models/Property';

export async function GET() {
  try {
    await dbConnect();
    const properties = await Property.find({}).sort({ createdAt: -1 }).lean();

    // Transform _id to id for frontend compatibility
    const result = properties.map((p: any) => ({
      ...p,
      id: p._id.toString(),
      createdAt:
        p.createdAt instanceof Date
          ? p.createdAt.toISOString().split('T')[0]
          : p.createdAt,
      _id: undefined,
      __v: undefined,
      updatedAt: undefined,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/properties error:', error);
    return NextResponse.json({ message: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const property = await Property.create({
      ...body,
      createdAt: new Date(),
    });

    return NextResponse.json(property.toJSON(), { status: 201 });
  } catch (error) {
    console.error('POST /api/properties error:', error);
    return NextResponse.json({ message: 'Invalid property payload' }, { status: 400 });
  }
}
