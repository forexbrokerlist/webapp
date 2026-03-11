-- AlterTable
ALTER TABLE "forex_brokers" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "status" "ToolStatus" NOT NULL DEFAULT 'Draft',
ADD COLUMN     "submitterEmail" TEXT,
ADD COLUMN     "submitterName" TEXT,
ADD COLUMN     "submitterNote" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "forex_brokers_slug_idx" ON "forex_brokers"("slug");

-- CreateIndex
CREATE INDEX "forex_brokers_broker_name_idx" ON "forex_brokers"("broker_name");

-- CreateIndex
CREATE INDEX "forex_brokers_status_idx" ON "forex_brokers"("status");

-- CreateIndex
CREATE INDEX "forex_brokers_ownerId_idx" ON "forex_brokers"("ownerId");

-- CreateIndex
CREATE INDEX "forex_brokers_createdAt_idx" ON "forex_brokers"("createdAt");

-- AddForeignKey
ALTER TABLE "forex_brokers" ADD CONSTRAINT "forex_brokers_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
