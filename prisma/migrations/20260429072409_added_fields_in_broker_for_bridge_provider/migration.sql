-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BusinessSize" ADD VALUE 'RetailBrokers';
ALTER TYPE "BusinessSize" ADD VALUE 'WhiteLabelOps';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PricingModel" ADD VALUE 'License';
ALTER TYPE "PricingModel" ADD VALUE 'VolumeBased';

-- AlterTable
ALTER TABLE "forex_brokers" ADD COLUMN     "asset_classes" TEXT[],
ADD COLUMN     "latency" TEXT,
ADD COLUMN     "setup_time" TEXT,
ADD COLUMN     "solution_type" TEXT,
ADD COLUMN     "target_clients" TEXT[],
ADD COLUMN     "white_label" BOOLEAN;
