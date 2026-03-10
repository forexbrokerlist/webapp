/*
  Warnings:

  - You are about to drop the column `maximum_funded_account` on the `forex_brokers` table. All the data in the column will be lost.
  - You are about to drop the column `maximum_trailing_drawdown` on the `forex_brokers` table. All the data in the column will be lost.
  - You are about to drop the column `minimum_evaluation_fee` on the `forex_brokers` table. All the data in the column will be lost.
  - You are about to drop the column `minimum_funded_account` on the `forex_brokers` table. All the data in the column will be lost.
  - You are about to drop the column `mobile_app_comparison` on the `forex_brokers` table. All the data in the column will be lost.
  - You are about to drop the column `other_fees` on the `forex_brokers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "forex_brokers" DROP COLUMN "maximum_funded_account",
DROP COLUMN "maximum_trailing_drawdown",
DROP COLUMN "minimum_evaluation_fee",
DROP COLUMN "minimum_funded_account",
DROP COLUMN "mobile_app_comparison",
DROP COLUMN "other_fees",
ADD COLUMN     "broker_website" TEXT,
ADD COLUMN     "deposit_fees" TEXT,
ADD COLUMN     "inactivity_fee" TEXT,
ADD COLUMN     "maximum_evaluation_fee" TEXT,
ADD COLUMN     "withdrawal_fee" TEXT;
