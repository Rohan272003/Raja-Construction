import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Inquiry from '../../../lib/models/Inquiry';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const inquiry = await Inquiry.create(body);

    return NextResponse.json(inquiry.toJSON(), { status: 201 });
  } catch (error) {
    console.error('POST /api/inquiries error:', error);
    return NextResponse.json({ message: 'Failed to record inquiry' }, { status: 400 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).lean();

    const result = inquiries.map((inq: any) => ({
      ...inq,
      id: inq._id.toString(),
      submittedAt: inq.createdAt
        ? new Date(inq.createdAt).toISOString()
        : new Date().toISOString(),
      _id: undefined,
      __v: undefined,
      updatedAt: undefined,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/inquiries error:', error);
    return NextResponse.json({ message: 'Failed to fetch inquiries' }, { status: 500 });
  }
}
