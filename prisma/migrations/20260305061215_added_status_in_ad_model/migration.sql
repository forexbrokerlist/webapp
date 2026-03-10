-- CreateEnum
CREATE TYPE "AdStatus" AS ENUM ('Draft', 'Scheduled', 'Pending', 'Published');

-- AlterTable
ALTER TABLE "Ad" ADD COLUMN     "status" "AdStatus" NOT NULL DEFAULT 'Draft';
