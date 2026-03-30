-- CreateTable
CREATE TABLE "StandaloneFAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StandaloneFAQ_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StandaloneFAQ_order_idx" ON "StandaloneFAQ"("order");

-- CreateIndex
CREATE INDEX "StandaloneFAQ_isActive_idx" ON "StandaloneFAQ"("isActive");
