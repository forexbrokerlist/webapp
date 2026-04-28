-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('OnlineAcademy', 'Mentor', 'Youtube', 'Academy');

-- AlterTable
ALTER TABLE "forex_brokers" ADD COLUMN     "provider_type" "ProviderType" NOT NULL DEFAULT 'OnlineAcademy';
