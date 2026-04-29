/*
  Warnings:

  - You are about to drop the column `is_verified` on the `broker_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `review_date` on the `broker_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `reviewer_city` on the `broker_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `reviewer_country` on the `broker_reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "broker_reviews" DROP COLUMN "is_verified",
DROP COLUMN "review_date",
DROP COLUMN "reviewer_city",
DROP COLUMN "reviewer_country",
ADD COLUMN     "reviewer_location" VARCHAR(100);
