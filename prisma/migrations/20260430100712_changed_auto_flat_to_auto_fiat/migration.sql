/*
  Warnings:

  - You are about to drop the column `auto_flat_conversion` on the `forex_brokers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "forex_brokers" DROP COLUMN "auto_flat_conversion",
ADD COLUMN     "auto_fiat_conversion" BOOLEAN;
