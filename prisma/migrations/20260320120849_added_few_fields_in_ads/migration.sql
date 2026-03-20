-- AlterTable
ALTER TABLE "Ad" ADD COLUMN     "subcategoryId" TEXT;

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
