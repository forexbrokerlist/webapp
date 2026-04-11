import { db } from '../services/db';

async function main() {
  const sponsors = await db.sponsor.findMany({ select: { name: true, bannerImage: true, logoUrl: true }});
  console.log(JSON.stringify(sponsors, null, 2));
}

main().catch(console.error).finally(() => process.exit(0));
