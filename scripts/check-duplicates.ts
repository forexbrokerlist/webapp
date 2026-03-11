import { db as prisma } from "../services/db";

async function main() {
  const duplicates: any[] = await prisma.$queryRaw`
    SELECT slug, COUNT(*) as count 
    FROM forex_brokers 
    GROUP BY slug 
    HAVING COUNT(*) > 1;
  `;

  console.log('Duplicate slugs found:', JSON.stringify(duplicates, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2));

  if (Array.isArray(duplicates) && duplicates.length > 0) {
    for (const dup of duplicates) {
      const records = await prisma.brokers.findMany({
        where: { slug: dup.slug },
        select: { id: true, broker_name: true, slug: true }
      });
      console.log(`Records for slug "${dup.slug}":`, JSON.stringify(records, null, 2));
    }
  } else {
    console.log('No duplicate slugs found.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
