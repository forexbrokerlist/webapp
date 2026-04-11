import { db } from "./services/db";

async function main() {
  const categories = await db.category.findMany({
    select: {
      name: true,
      slug: true,
    },
  });
  console.log(JSON.stringify(categories, null, 2));
}

main();
