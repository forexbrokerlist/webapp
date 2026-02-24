import { PrismaClient } from '@prisma/client';
import { Client } from 'pg';

// Using the provided database URL for the old DB and Neon DB for Prisma.
const OLD_DATABASE_URL =
  process.env.OLD_DATABASE_URL ||
  'postgresql://neondb_owner:npg_ocmj3JBL6lFz@ep-morning-dew-aebhayy5-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

const OLD_TABLE_NAME = 'dailyforex_brokers';

const prisma = new PrismaClient();

function generateSlug(name: string): string {
  if (!name) return `broker-${Date.now()}`;
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  console.log('Connecting to the old database...');
  const oldDb = new Client({
    connectionString: OLD_DATABASE_URL,
  });

  await oldDb.connect();
  console.log('Connected to the old database.');

  try {
    console.log(`Fetching records from table: ${OLD_TABLE_NAME}...`);
    const result = await oldDb.query(`SELECT * FROM ${OLD_TABLE_NAME}`);
    const oldRecords = result.rows;
    console.log(`Found ${oldRecords.length} records to migrate.`);

    for (const record of oldRecords) {
      if (!record.broker_name) {
        console.warn(`Skipping record with ID ${record.id} due to missing broker_name.`);
        continue;
      }

      let slug = generateSlug(record.broker_name);
      
      // Check if slug exists to avoid unique constraint violations
      let existingTool = await prisma.tool.findUnique({ where: { slug } });
      let counter = 1;
      while (existingTool) {
        slug = `${generateSlug(record.broker_name)}-${counter}`;
        existingTool = await prisma.tool.findUnique({ where: { slug } });
        counter++;
      }

      // Compile unstructured data into "content" Markdown
      const contentParts = [];
      if (record.description) contentParts.push(record.description);
      
      if (record.pros || record.cons) {
        contentParts.push('## Pros & Cons');
        if (record.pros) contentParts.push(`### Pros\n${record.pros}`);
        if (record.cons) contentParts.push(`### Cons\n${record.cons}`);
      }

      contentParts.push('## Broker Details');
      const details = [
        record.year_established && `- **Year Established:** ${record.year_established}`,
        record.headquarters && `- **Headquarters:** ${record.headquarters}`,
        record.regulators && `- **Regulators:** ${record.regulators}`,
        record.minimum_deposit && `- **Minimum Deposit:** ${record.minimum_deposit}`,
        record.deposit_options && `- **Deposit Options:** ${record.deposit_options}`,
        record.withdrawal_options && `- **Withdrawal Options:** ${record.withdrawal_options}`,
        record.trading_platforms && `- **Trading Platforms:** ${record.trading_platforms}`,
        record.overall_rating && `- **Overall Rating:** ${record.overall_rating}`,
      ].filter(Boolean);

      if (details.length > 0) {
        contentParts.push(details.join('\n'));
      }

      const content = contentParts.join('\n\n');

      await prisma.tool.create({
        data: {
          name: record.broker_name,
          slug,
          websiteUrl: record.url || '#',
          description: record.description ? record.description.substring(0, 500) : null,
          content: content || null,
          status: 'Published', // Set as published since they are from old DB
        },
      });

      console.log(`Migrated broker: ${record.broker_name} -> slug: ${slug}`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await oldDb.end();
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
