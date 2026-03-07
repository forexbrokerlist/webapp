import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../.generated/prisma/client";
import { uniqueSlugsExtension } from "../prisma/extensions/unique-slugs";

// Create standalone database connection for script usage
const createScriptDb = () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is required");
    process.exit(1);
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl });
  const client = new PrismaClient({ adapter });
  
  return client.$extends(uniqueSlugsExtension);
};

const prisma = createScriptDb();

async function main() {
  console.log("Starting broker status update to 'Published'...");

  // Get all brokers with Draft status
  const draftBrokers = await prisma.brokers.findMany({
    where: {
      status: 'Draft'
    }
  });

  console.log(`Found ${draftBrokers.length} brokers with Draft status.`);

  if (draftBrokers.length === 0) {
    console.log("No brokers found with Draft status. Nothing to update.");
    return;
  }

  // Update all Draft brokers to Published
  const updateResult = await prisma.brokers.updateMany({
    where: {
      status: 'Draft'
    },
    data: {
      status: 'Published',
      publishedAt: new Date()
    }
  });

  console.log(`Successfully updated ${updateResult.count} brokers to 'Published' status.`);

  // Display updated brokers
  const updatedBrokers = await prisma.brokers.findMany({
    where: {
      status: 'Published'
    },
    select: {
      id: true,
      broker_name: true,
      status: true,
      publishedAt: true
    }
  });

  console.log("\nUpdated brokers:");
  updatedBrokers.forEach(broker => {
    console.log(`- ID: ${broker.id}, Name: ${broker.broker_name || 'N/A'}, Status: ${broker.status}, Published: ${broker.publishedAt}`);
  });
}

main()
  .catch((e) => {
    console.error("Error updating broker status:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
