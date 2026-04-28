-- CreateEnum
CREATE TYPE "LearningFormat" AS ENUM ('Video', 'Text', 'LiveSessions', 'Webinar');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PricingModel" ADD VALUE 'Freemium';
ALTER TYPE "PricingModel" ADD VALUE 'Subscription';
ALTER TYPE "PricingModel" ADD VALUE 'Free';

-- AlterTable
ALTER TABLE "forex_brokers" ADD COLUMN     "certificate_available" BOOLEAN,
ADD COLUMN     "community_access" BOOLEAN,
ADD COLUMN     "learning_format" "LearningFormat"[],
ADD COLUMN     "mentorship_available" BOOLEAN,
ADD COLUMN     "outcomes" TEXT[],
ADD COLUMN     "topics_covered" TEXT[];

-- CreateTable
CREATE TABLE "course_modules" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" "DifficultyLevel" NOT NULL,
    "duration" TEXT NOT NULL,
    "topics" TEXT[],
    "order" INTEGER NOT NULL,
    "brokerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_modules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "course_modules_brokerId_idx" ON "course_modules"("brokerId");

-- CreateIndex
CREATE INDEX "course_modules_order_idx" ON "course_modules"("order");

-- AddForeignKey
ALTER TABLE "course_modules" ADD CONSTRAINT "course_modules_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "forex_brokers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
