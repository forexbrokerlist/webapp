import { db as prisma } from "../services/db";
import * as fs from "fs";
import { parse } from "csv-parse/sync";

async function main() {
  // Update this path to point to your actual CSV file
  const csvFilePath = "./scripts/dailyforex_brokers_updated.csv"; 

  if (!fs.existsSync(csvFilePath)) {
    console.error(`CSV file not found at path: ${csvFilePath}`);
    console.log("Please update the 'csvFilePath' variable to the correct path.");
    process.exit(1);
  }

  console.log(`Reading CSV file from ${csvFilePath}...`);
  const fileContent = fs.readFileSync(csvFilePath, "utf-8");

  // Parse the CSV content
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as any[];

  console.log(`Found ${records.length} records in the CSV.`);

  console.log("Clearing existing brokers data...");
  const deleteResult = await prisma.brokers.deleteMany({});
  console.log(`Cleared ${deleteResult.count} existing brokers.`);

  for (const record of records) {
    console.log("🚀 ~ main ~ record:", record)
    // Map CSV fields to the Brokers model fields
    const mappedData: any = {
      average_trading_cost_bitcoin: record.average_trading_cost_bitcoin || null,
      average_trading_cost_eur_usd: record.average_trading_cost_eur_usd || null,
      average_trading_cost_gbp_usd: record.average_trading_cost_gbp_usd || null,
      average_trading_cost_gold: record.average_trading_cost_gold || null,
      average_trading_cost_wti_crude_oil: record.average_trading_cost_wti_crude_oil || null,
      broker_name: record.broker_name || null,
      cons: record.cons || null,
      daily_loss_limit: record.daily_loss_limit || null,
      deposit_options: record.deposit_options || null,
      description: record.description || null,
      execution_types: record.execution_types || null,
      funded_account_options: record.funded_account_options || null,
      funding_methods: record.funding_methods || null,
      headquarters: record.headquarters || null,
      minimum_commission_for_forex: record.minimum_commission_for_forex || null,
      minimum_deposit: record.minimum_deposit || null,
      minimum_raw_spreads: record.minimum_raw_spreads || null,
      minimum_standard_spreads: record.minimum_standard_spreads || null,
      overall_rating: record.overall_rating || null,
      profit_share: record["profit-share"] || record["fees.Profit-share"] || record.profit_share || null,
      pros: record.pros || null,
      regulators: record.regulators || null,
      regulators_table: record.regulators_table || null,
      retail_loss_rate: record.retail_loss_rate || null,
      scraped_at: record.scraped_at ? new Date(record.scraped_at) : new Date(),
      trader_table: record.trader_table || null,
      trading_hours: record.trading_hours || null,
      trading_platforms: record.trading_platforms || null,
      url: record.url || null,
      withdrawal_options: record.withdrawal_options || null,
      year_established: record.year_established ? parseFloat(record.year_established) : null,
      deposit_fees: record.deposit_fees || null,
      inactivity_fee: record.inactivity_fee || null,
      maximum_evaluation_fee: record["fees.Maximum Evaluation Fee"] || record.maximum_evaluation_fee || null,
      withdrawal_fee: record.withdrawal_fee || null,
      broker_website: record.broker_website || null,
      slug: record.broker_name ? record.broker_name.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : null,
    };

    try {
      await prisma.brokers.create({
        data: mappedData,
      });
      console.log(`Successfully imported: ${mappedData.broker_name || 'Unknown Broker'}`);
    } catch (error) {
      console.error(`Failed to import broker: ${mappedData.broker_name || 'Unknown Broker'}`, error);
    }
  }

  console.log("Finished importing all data.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
