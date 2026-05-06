-- DropForeignKey
ALTER TABLE "BrokerClaim" DROP CONSTRAINT "BrokerClaim_brokerId_fkey";

-- DropForeignKey
ALTER TABLE "BrokerSubscription" DROP CONSTRAINT "BrokerSubscription_brokerId_fkey";

-- DropForeignKey
ALTER TABLE "FAQ" DROP CONSTRAINT "FAQ_brokerId_fkey";

-- AddForeignKey
ALTER TABLE "FAQ" ADD CONSTRAINT "FAQ_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "forex_brokers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrokerSubscription" ADD CONSTRAINT "BrokerSubscription_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "forex_brokers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrokerClaim" ADD CONSTRAINT "BrokerClaim_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "forex_brokers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
