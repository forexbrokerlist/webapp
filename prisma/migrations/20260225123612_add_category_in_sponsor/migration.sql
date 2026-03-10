-- CreateEnum
CREATE TYPE "SponsorCategory" AS ENUM ('BrokerListing', 'AlgoSelling', 'Education');

-- AlterTable
ALTER TABLE "Sponsor" ADD COLUMN     "category" "SponsorCategory" NOT NULL DEFAULT 'BrokerListing';
