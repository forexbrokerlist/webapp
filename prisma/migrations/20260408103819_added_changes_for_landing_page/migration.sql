-- AlterTable
ALTER TABLE "Sponsor" ADD COLUMN     "bannerImage" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "highlightedPoint" TEXT,
ADD COLUMN     "title" TEXT;
