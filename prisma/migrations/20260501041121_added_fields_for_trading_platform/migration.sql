-- AlterTable
ALTER TABLE "forex_brokers" ADD COLUMN     "brokers_onboarded" TEXT,
ADD COLUMN     "charting_tools" TEXT[],
ADD COLUMN     "clients_count" TEXT,
ADD COLUMN     "hosting_included" BOOLEAN,
ADD COLUMN     "mt5_backend" BOOLEAN,
ADD COLUMN     "platform_type" TEXT[],
ADD COLUMN     "prop_firm_support" TEXT[],
ADD COLUMN     "server_license" TEXT,
ADD COLUMN     "trader_accounts" TEXT,
ADD COLUMN     "white_label_price" TEXT,
ADD COLUMN     "yearly_commitment" BOOLEAN;
