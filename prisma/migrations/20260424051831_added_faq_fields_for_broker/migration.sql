-- AlterTable
ALTER TABLE "FAQ" ADD COLUMN     "brokerId" INTEGER;

-- CreateIndex
CREATE INDEX "FAQ_brokerId_idx" ON "FAQ"("brokerId");

-- AddForeignKey
ALTER TABLE "FAQ" ADD CONSTRAINT "FAQ_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "forex_brokers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
