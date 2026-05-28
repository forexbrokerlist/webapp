import { db } from '~/services/db';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // Fetch all country data
  const data = await db.expo_countrydata.findMany({
    select: {
      country_code: true,
      name: true,
      coords: true,
      data: true,
    },
  });
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
