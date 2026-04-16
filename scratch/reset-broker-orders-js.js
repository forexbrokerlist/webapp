const { Pool } = require('pg');

// Basic script to update the orders using raw SQL to bypass Prisma initialization issues in scratch scripts
async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
  });

  console.log("Starting broker order reset via PG...");
  
  try {
    const res = await pool.query('UPDATE forex_brokers SET "order" = 1000000 WHERE "order" = 0');
    console.log(`Successfully updated ${res.rowCount} brokers to order 1,000,000`);
  } catch (err) {
    console.error("Update failed:", err);
  } finally {
    await pool.end();
  }
}

main();
