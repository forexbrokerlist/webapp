-- AlterTable
ALTER TABLE "forex_brokers" ADD COLUMN     "overall_review_rating" DOUBLE PRECISION,
ADD COLUMN     "total_reviews" VARCHAR(20);

-- CreateTable
CREATE TABLE "broker_reviews" (
    "id" TEXT NOT NULL,
    "reviewer_name" VARCHAR(100),
    "reviewer_city" VARCHAR(100),
    "reviewer_country" VARCHAR(100),
    "review_date" TIMESTAMP(3),
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "rating" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "brokerId" INTEGER NOT NULL,

    CONSTRAINT "broker_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "broker_reviews_brokerId_idx" ON "broker_reviews"("brokerId");

-- CreateIndex
CREATE INDEX "broker_reviews_rating_idx" ON "broker_reviews"("rating");

-- AddForeignKey
ALTER TABLE "broker_reviews" ADD CONSTRAINT "broker_reviews_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "forex_brokers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
