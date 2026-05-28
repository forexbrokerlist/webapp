const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tourCities = await prisma.expo_tourcity.findMany();
  console.log("Tour Cities:", JSON.stringify(tourCities, null, 2));

  const history = await prisma.expo_history.findMany();
  console.log("History:", JSON.stringify(history, null, 2));
}

main().catch(err => {
  console.error(err);
}).finally(async () => {
  await prisma.$disconnect();
});
