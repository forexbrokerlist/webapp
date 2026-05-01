/*
  Warnings:

  - You are about to drop the column `flat_currencies` on the `forex_brokers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "forex_brokers" DROP COLUMN "flat_currencies",
ADD COLUMN     "fiat_currencies" TEXT,
ALTER COLUMN "supported_cryptos" DROP NOT NULL,
ALTER COLUMN "supported_cryptos" SET DATA TYPE TEXT;
