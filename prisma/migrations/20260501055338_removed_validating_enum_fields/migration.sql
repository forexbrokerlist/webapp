/*
  Warnings:

  - The `bestFor` column on the `forex_brokers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deployment_type` column on the `forex_brokers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `support_channels` column on the `forex_brokers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `pricingModel` column on the `forex_brokers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `learning_format` column on the `forex_brokers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `skill_level` column on the `forex_brokers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `provider_type` column on the `forex_brokers` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "forex_brokers" DROP COLUMN "bestFor",
ADD COLUMN     "bestFor" TEXT[],
DROP COLUMN "deployment_type",
ADD COLUMN     "deployment_type" TEXT[],
DROP COLUMN "support_channels",
ADD COLUMN     "support_channels" TEXT[],
DROP COLUMN "pricingModel",
ADD COLUMN     "pricingModel" TEXT[],
DROP COLUMN "learning_format",
ADD COLUMN     "learning_format" TEXT[],
DROP COLUMN "skill_level",
ADD COLUMN     "skill_level" TEXT[],
DROP COLUMN "provider_type",
ADD COLUMN     "provider_type" TEXT[];
