-- AlterTable
ALTER TABLE "forex_brokers" ADD COLUMN     "auto_flat_conversion" BOOLEAN,
ADD COLUMN     "company_type" TEXT,
ADD COLUMN     "flat_currencies" TEXT[],
ADD COLUMN     "integration_type" TEXT[],
ADD COLUMN     "kyb_required" BOOLEAN,
ADD COLUMN     "mass_payout" BOOLEAN,
ADD COLUMN     "settlement_time" TEXT,
ADD COLUMN     "supported_cryptos" TEXT[];
