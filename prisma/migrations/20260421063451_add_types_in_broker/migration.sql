-- AlterTable
ALTER TABLE "forex_brokers" ADD COLUMN     "accountTypes" TEXT[],
ADD COLUMN     "availableInIndia" BOOLEAN,
ADD COLUMN     "copyTrading" BOOLEAN,
ADD COLUMN     "demoAccount" BOOLEAN,
ADD COLUMN     "islamicAccount" BOOLEAN,
ADD COLUMN     "maxLeverage" TEXT,
ADD COLUMN     "totalInstruments" TEXT;
