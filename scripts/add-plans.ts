import { db as prisma } from "../services/db";

async function main() {
  await prisma.plan.createMany({
    data: [
      {
        name: "Free",
        slug: "free",
        price: 0,
        durationDays: 0,
        features: ["Basic broker listing", "Community visibility"],
      },
      {
        name: "Scale",
        slug: "scale",
        price: 199,
        durationDays: 7,
        blogPosts: 2,
        bannerAds: 1,
        features: [
          "2 Dedicated blogs",
          "Advertisement banner for 7 days",
          "Priority listing",
        ],
      },
      {
        name: "Growth",
        slug: "growth",
        price: 399,
        durationDays: 30,
        blogPosts: 6,
        bannerAds: 1,
        featuredLogoDays: 30,
        features: [
          "6 Dedicated blogs",
          "Advertisement banner",
          "30 days featured logo",
          "Maximum exposure",
        ],
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
