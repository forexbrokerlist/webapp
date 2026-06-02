import { NextResponse } from 'next/server';
import { getAllPartners } from '~/server/web/brokers/queries';

export async function GET() {
  const brokers = await getAllPartners();
  return NextResponse.json(brokers);
}
