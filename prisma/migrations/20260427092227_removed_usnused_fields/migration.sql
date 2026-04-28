/*
  Warnings:

  - You are about to drop the column `keyFeatures` on the `forex_brokers` table. All the data in the column will be lost.
  - You are about to drop the column `platformIntegrations` on the `forex_brokers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "forex_brokers" DROP COLUMN "keyFeatures",
DROP COLUMN "platformIntegrations";
