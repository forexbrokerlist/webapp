const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Basic .env parser for standalone script
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*DATABASE_URL\s*=\s*["']?([^"']+)["']?\s*$/);
    if (match) {
      process.env.DATABASE_URL = match[1];
    }
  });
}

async function main() {
  loadEnv();
  
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not found in .env");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
  });

  console.log("Starting broker order reset via PG (CJS)...");
  
  try {
    // forex_brokers is the table name from @@map in Prisma schema
    const res = await pool.query('UPDATE forex_brokers SET "order" = 1000000 WHERE "order" = 0');
    console.log(`Successfully updated ${res.rowCount} brokers to order 1,000,000`);
  } catch (err) {
    console.error("Update failed:", err);
  } finally {
    await pool.end();
  }
}

main();
