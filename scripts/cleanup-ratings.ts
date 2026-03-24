import { db as prisma } from "../services/db";

async function main() {
  console.log("Starting rating cleanup...");

  try {
    const brokers = await prisma.brokers.findMany({
      where: {
        overall_rating: {
          contains: "/",
        },
      },
    });

    console.log(`Found ${brokers.length} brokers with "/" in rating.`);

    let updatedCount = 0;

    for (const broker of brokers) {
      if (!broker.overall_rating) continue;

      const croppedRating = broker.overall_rating.split("/")[0].trim();

      try {
        await prisma.brokers.update({
          where: { id: broker.id },
          data: { overall_rating: croppedRating },
        });
        console.log(`Updated ${broker.broker_name}: ${broker.overall_rating} -> ${croppedRating}`);
        updatedCount++;
      } catch (error) {
        console.error(`Failed to update ${broker.broker_name}:`, error);
      }
    }

    console.log(`Finished cleanup. Updated ${updatedCount} brokers.`);
  } catch (err) {
    console.error("Fatal error during cleanup:", err);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
