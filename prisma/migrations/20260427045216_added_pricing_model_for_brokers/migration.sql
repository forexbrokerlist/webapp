-- CreateEnum
CREATE TYPE "PricingModel" AS ENUM ('MonthlySaas', 'OneTime', 'Custom');

-- AlterTable
ALTER TABLE "forex_brokers" ADD COLUMN     "pricingModel" "PricingModel" NOT NULL DEFAULT 'MonthlySaas';
