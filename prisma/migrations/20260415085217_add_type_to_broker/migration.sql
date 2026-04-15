-- CreateEnum
CREATE TYPE "BrokerType" AS ENUM ('Broker', 'CRM', 'EducationPlatforms', 'ForexBridge', 'Liquidity', 'PSP', 'Trading', 'BotProvider');

-- AlterTable
ALTER TABLE "forex_brokers" ADD COLUMN     "type" "BrokerType";
