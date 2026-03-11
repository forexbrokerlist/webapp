import { db as prisma } from "../services/db";
import * as fs from "fs";
import { parse } from "csv-parse/sync";

async function main() {
  // Update this path to point to your actual CSV file
  const csvFilePath = "./scripts/dailyforex_brokers_updated.csv"; 

  // if (!fs.existsSync(csvFilePath)) {
  //   console.error(`CSV file not found at path: ${csvFilePath}`);
  //   console.log("Please update the 'csvFilePath' variable to the correct path.");
  //   process.exit(1);
  // }

  // console.log(`Reading CSV file from ${csvFilePath}...`);
  // const fileContent = fs.readFileSync(csvFilePath, "utf-8");

  // Parse the CSV content
  // const records = parse(fileContent, {
  //   columns: true,
  //   skip_empty_lines: true,
  //   trim: true,
  // }) as any[];

  // console.log(`Found ${records.length} records in the CSV.`);

  // console.log("Clearing existing brokers data...");
  // const deleteResult = await prisma.brokers.deleteMany({});
  // console.log(`Cleared ${deleteResult.count} existing brokers.`);

  // for (const record of records) {
  // Map CSV fields to the Brokers model fields
  //   const mappedData: any = {
  //     average_trading_cost_bitcoin: record.average_trading_cost_bitcoin || null,
  //     average_trading_cost_eur_usd: record.average_trading_cost_eur_usd || null,
  //     average_trading_cost_gbp_usd: record.average_trading_cost_gbp_usd || null,
  //     average_trading_cost_gold: record.average_trading_cost_gold || null,
  //     average_trading_cost_wti_crude_oil: record.average_trading_cost_wti_crude_oil || null,
  //     broker_name: record.broker_name || null,
  //     cons: record.cons || null,
  //     daily_loss_limit: record.daily_loss_limit || null,
  //     deposit_options: record.deposit_options || null,
  //     description: record.description || null,
  //     execution_types: record.execution_types || null,
  //     funded_account_options: record.funded_account_options || null,
  //     funding_methods: record.funding_methods || null,
  //     headquarters: record.headquarters || null,
  //     minimum_commission_for_forex: record.minimum_commission_for_forex || null,
  //     minimum_deposit: record.minimum_deposit || null,
  //     minimum_raw_spreads: record.minimum_raw_spreads || null,
  //     minimum_standard_spreads: record.minimum_standard_spreads || null,
  //     overall_rating: record.overall_rating || null,
  //     profit_share: record["profit-share"] || record["fees.Profit-share"] || record.profit_share || null,
  //     pros: record.pros || null,
  //     regulators: record.regulators || null,
  //     regulators_table: record.regulators_table || null,
  //     retail_loss_rate: record.retail_loss_rate || null,
  //     scraped_at: record.scraped_at ? new Date(record.scraped_at) : new Date(),
  //     trader_table: record.trader_table || null,
  //     trading_hours: record.trading_hours || null,
  //     trading_platforms: record.trading_platforms || null,
  //     url: record.url || null,
  //     withdrawal_options: record.withdrawal_options || null,
  //     year_established: record.year_established ? parseFloat(record.year_established) : null,
  //     deposit_fees: record.deposit_fees || null,
  //     inactivity_fee: record.inactivity_fee || null,
  //     maximum_evaluation_fee: record["fees.Maximum Evaluation Fee"] || record.maximum_evaluation_fee || null,
  //     withdrawal_fee: record.withdrawal_fee || null,
  //     broker_website: record.broker_website || null,
  //     slug: record.broker_name ? record.broker_name.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : null,
  //   };

  //   try {
  //     await prisma.brokers.create({
  //       data: mappedData,
  //     });
  //     console.log(`Successfully imported: ${mappedData.broker_name || 'Unknown Broker'}`);
  //   } catch (error) {
  //     console.error(`Failed to import broker: ${mappedData.broker_name || 'Unknown Broker'}`, error);
  //   }
  // }
  const tags = [
  { "name": "1-on-1 Coaching", "slug": "1-on-1-coaching" },
  { "name": "24/5 Support", "slug": "24-5-support" },
  { "name": "24/7 Support", "slug": "24-7-support" },
  { "name": "A-Book Execution", "slug": "a-book-execution" },
  { "name": "Affiliate Network", "slug": "affiliate-network" },
  { "name": "AI Powered Analysis", "slug": "ai-powered-analysis" },
  { "name": "AI Research Tool", "slug": "ai-research-tool" },
  { "name": "AI Verified Listing", "slug": "ai-verified-listing" },
  { "name": "Algorithmic Trading", "slug": "algorithmic-trading" },
  { "name": "AML Compliance", "slug": "aml-compliance" },
  { "name": "API Trading", "slug": "api-trading" },
  { "name": "ASIC Regulated", "slug": "asic-regulated" },
  { "name": "Automated Trading", "slug": "automated-trading" },
  { "name": "B-Book Execution", "slug": "b-book-execution" },
  { "name": "Back Office Software", "slug": "back-office-software" },
  { "name": "Backtesting Platform", "slug": "backtesting-platform" },
  { "name": "Bank Wire Transfer", "slug": "bank-wire-transfer" },
  { "name": "Beginner Friendly", "slug": "beginner-friendly" },
  { "name": "Bitcoin Trading", "slug": "bitcoin-trading" },
  { "name": "Bonus Offering", "slug": "bonus-offering" },
  { "name": "Bridge Technology", "slug": "bridge-technology" },
  { "name": "Broker CRM", "slug": "broker-crm" },
  { "name": "Broker Incorporation", "slug": "broker-incorporation" },
  { "name": "Broker License Consultant", "slug": "broker-license-consultant" },
  { "name": "Broker Startup Technology", "slug": "broker-startup-technology" },
  { "name": "Cashback Rebates", "slug": "cashback-rebates" },
  { "name": "Cent Account", "slug": "cent-account" },
  { "name": "Certification Course", "slug": "certification-course" },
  { "name": "CFD Broker", "slug": "cfd-broker" },
  { "name": "Client Portal", "slug": "client-portal" },
  { "name": "COT Data Tool", "slug": "cot-data-tool" },
  { "name": "Commodity CFDs", "slug": "commodity-cfds" },
  { "name": "Commodity Trading", "slug": "commodity-trading" },
  { "name": "Community Reviewed", "slug": "community-reviewed" },
  { "name": "Company Formation", "slug": "company-formation" },
  { "name": "Compensation Scheme", "slug": "compensation-scheme" },
  { "name": "Compliance Advisory", "slug": "compliance-advisory" },
  { "name": "Copy Trading", "slug": "copy-trading" },
  { "name": "Corporate Account", "slug": "corporate-account" },
  { "name": "cTrader Platform", "slug": "ctrader-platform" },
  { "name": "Cryptocurrency CFDs", "slug": "cryptocurrency-cfds" },
  { "name": "Cryptocurrency Deposit", "slug": "cryptocurrency-deposit" },
  { "name": "Currency Screener", "slug": "currency-screener" },
  { "name": "Custom Algo Development", "slug": "custom-algo-development" },
  { "name": "CySEC Regulated", "slug": "cysec-regulated" },
  { "name": "Daily Signals", "slug": "daily-signals" },
  { "name": "Day Trading", "slug": "day-trading" },
  { "name": "Demo Account", "slug": "demo-account" },
  { "name": "Deposit Bonus", "slug": "deposit-bonus" },
  { "name": "DMA Broker", "slug": "dma-broker" },
  { "name": "eBook and Course", "slug": "ebook-and-course" },
  { "name": "ECN Account", "slug": "ecn-account" },
  { "name": "ECN Broker", "slug": "ecn-broker" },
  { "name": "Economic Calendar", "slug": "economic-calendar" },
  { "name": "Editor Pick", "slug": "editor-pick" },
  { "name": "Educational Resources", "slug": "educational-resources" },
  { "name": "Email Support", "slug": "email-support" },
  { "name": "Energy CFDs", "slug": "energy-cfds" },
  { "name": "ETF CFDs", "slug": "etf-cfds" },
  { "name": "Expert Advisors", "slug": "expert-advisors" },
  { "name": "Exotic Pairs", "slug": "exotic-pairs" },
  { "name": "Fast Execution", "slug": "fast-execution" },
  { "name": "Fast Withdrawal", "slug": "fast-withdrawal" },
  { "name": "FCA Regulated", "slug": "fca-regulated" },
  { "name": "Featured Listing", "slug": "featured-listing" },
  { "name": "FIX API", "slug": "fix-api" },
  { "name": "Fixed Spread", "slug": "fixed-spread" },
  { "name": "Forex Affiliate", "slug": "forex-affiliate" },
  { "name": "Forex Blog", "slug": "forex-blog" },
  { "name": "Forex Conference", "slug": "forex-conference" },
  { "name": "Forex Podcast", "slug": "forex-podcast" },
  { "name": "Forex Signals", "slug": "forex-signals" },
  { "name": "Forex YouTube Channel", "slug": "forex-youtube-channel" },
  { "name": "FSCA Regulated", "slug": "fsca-regulated" },
  { "name": "Funded Account", "slug": "funded-account" },
  { "name": "Gold Trading", "slug": "gold-trading" },
  { "name": "Hedging Allowed", "slug": "hedging-allowed" },
  { "name": "High Leverage", "slug": "high-leverage" },
  { "name": "High Risk Warning", "slug": "high-risk-warning" },
  { "name": "IB Management", "slug": "ib-management" },
  { "name": "IB Portal", "slug": "ib-portal" },
  { "name": "Index CFDs", "slug": "index-cfds" },
  { "name": "Influencer Marketing", "slug": "influencer-marketing" },
  { "name": "Investor Protection", "slug": "investor-protection" },
  { "name": "Islamic Account", "slug": "islamic-account" },
  { "name": "Joint Account", "slug": "joint-account" },
  { "name": "KYC Technology", "slug": "kyc-technology" },
  { "name": "Lead Generation", "slug": "lead-generation" },
  { "name": "Legal Counsel", "slug": "legal-counsel" },
  { "name": "Leverage 1:100", "slug": "leverage-1-100" },
  { "name": "Leverage 1:500", "slug": "leverage-1-500" },
  { "name": "Leverage 1:1000", "slug": "leverage-1-1000" },
  { "name": "License Advisory", "slug": "license-advisory" },
  { "name": "Live Chat Support", "slug": "live-chat-support" },
  { "name": "Live Trading Room", "slug": "live-trading-room" },
  { "name": "Low Commission", "slug": "low-commission" },
  { "name": "Low Latency Execution", "slug": "low-latency-execution" },
  { "name": "Low Minimum Deposit", "slug": "low-minimum-deposit" },
  { "name": "Loyalty Program", "slug": "loyalty-program" },
  { "name": "MAM Account", "slug": "mam-account" },
  { "name": "Market Analysis", "slug": "market-analysis" },
  { "name": "Market Maker", "slug": "market-maker" },
  { "name": "Market Sentiment Tool", "slug": "market-sentiment-tool" },
  { "name": "Mentorship Program", "slug": "mentorship-program" },
  { "name": "MetaTrader 4", "slug": "metatrader-4" },
  { "name": "MetaTrader 5", "slug": "metatrader-5" },
  { "name": "Micro Account", "slug": "micro-account" },
  { "name": "Minor Pairs", "slug": "minor-pairs" },
  { "name": "Mobile App Android", "slug": "mobile-app-android" },
  { "name": "Mobile App iOS", "slug": "mobile-app-ios" },
  { "name": "Mobile Trading", "slug": "mobile-trading" },
  { "name": "Multi-Asset Broker", "slug": "multi-asset-broker" },
  { "name": "Multi-Currency Account", "slug": "multi-currency-account" },
  { "name": "Multi-Regulated", "slug": "multi-regulated" },
  { "name": "Multilingual Support", "slug": "multilingual-support" },
  { "name": "NDD Broker", "slug": "ndd-broker" },
  { "name": "Negative Balance Protection", "slug": "negative-balance-protection" },
  { "name": "Neteller Payments", "slug": "neteller-payments" },
  { "name": "Newly Listed", "slug": "newly-listed" },
  { "name": "NFA Regulated", "slug": "nfa-regulated" },
  { "name": "No Deposit Bonus", "slug": "no-deposit-bonus" },
  { "name": "No Minimum Deposit", "slug": "no-minimum-deposit" },
  { "name": "No Requotes", "slug": "no-requotes" },
  { "name": "Offshore Regulated", "slug": "offshore-regulated" },
  { "name": "Oil Trading", "slug": "oil-trading" },
  { "name": "Online Trading Academy", "slug": "online-trading-academy" },
  { "name": "Options Trading", "slug": "options-trading" },
  { "name": "Paid Advertising Agency", "slug": "paid-advertising-agency" },
  { "name": "PAMM Account", "slug": "pamm-account" },
  { "name": "Payment Gateway", "slug": "payment-gateway" },
  { "name": "PayPal Payments", "slug": "paypal-payments" },
  { "name": "Professional Account", "slug": "professional-account" },
  { "name": "Prop Trading Firm", "slug": "prop-trading-firm" },
  { "name": "Proprietary Platform", "slug": "proprietary-platform" },
  { "name": "PSP Integration", "slug": "psp-integration" },
  { "name": "Publicly Listed Broker", "slug": "publicly-listed-broker" },
  { "name": "Quantitative Research", "slug": "quantitative-research" },
  { "name": "Raw Spread Account", "slug": "raw-spread-account" },
  { "name": "Recently Updated", "slug": "recently-updated" },
  { "name": "Refer a Friend Program", "slug": "refer-a-friend-program" },
  { "name": "Regulatory Reporting", "slug": "regulatory-reporting" },
  { "name": "Risk Management System", "slug": "risk-management-system" },
  { "name": "Same Day Withdrawal", "slug": "same-day-withdrawal" },
  { "name": "Scalping Allowed", "slug": "scalping-allowed" },
  { "name": "Scam Warning", "slug": "scam-warning" },
  { "name": "SEBI Regulated", "slug": "sebi-regulated" },
  { "name": "SEO Agency", "slug": "seo-agency" },
  { "name": "Segregated Client Funds", "slug": "segregated-client-funds" },
  { "name": "Signal Service", "slug": "signal-service" },
  { "name": "Silver Trading", "slug": "silver-trading" },
  { "name": "Skrill Payments", "slug": "skrill-payments" },
  { "name": "Social Media Marketing", "slug": "social-media-marketing" },
  { "name": "Social Trading", "slug": "social-trading" },
  { "name": "Standard Account", "slug": "standard-account" },
  { "name": "Stock CFDs", "slug": "stock-cfds" },
  { "name": "Strategy Marketplace", "slug": "strategy-marketplace" },
  { "name": "STP Broker", "slug": "stp-broker" },
  { "name": "Swap Free", "slug": "swap-free" },
  { "name": "Swing Trading", "slug": "swing-trading" },
  { "name": "Technical Analysis Platform", "slug": "technical-analysis-platform" },
  { "name": "Tier-1 Regulated", "slug": "tier-1-regulated" },
  { "name": "Trade Journal Software", "slug": "trade-journal-software" },
  { "name": "Trading Bot", "slug": "trading-bot" },
  { "name": "Trading Community", "slug": "trading-community" },
  { "name": "Trading Contest", "slug": "trading-contest" },
  { "name": "Trading Webinar", "slug": "trading-webinar" },
  { "name": "Turnkey Broker Solution", "slug": "turnkey-broker-solution" },
  { "name": "UPI Payments", "slug": "upi-payments" },
  { "name": "Variable Spread", "slug": "variable-spread" },
  { "name": "Video Course", "slug": "video-course" },
  { "name": "VPS Hosting", "slug": "vps-hosting" },
  { "name": "Web Trader", "slug": "web-trader" },
  { "name": "White Label MT4", "slug": "white-label-mt4" },
  { "name": "White Label MT5", "slug": "white-label-mt5" },
  { "name": "White Label Platform", "slug": "white-label-platform" },
  { "name": "Zero Commission", "slug": "zero-commission" }
]

const response = await prisma.tag.createMany({
  data: tags,
  skipDuplicates: true
})
console.log("Finished importing all data." , response);
}   

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
