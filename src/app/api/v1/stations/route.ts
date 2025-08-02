import { NextResponse } from 'next/server';
import { getStations } from '@/common/services/getStations';

export async function GET() {
  try {
    const data = await getStations();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/stations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stations' },
      { status: 500 }
    );
  }
}
