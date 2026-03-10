/*
  Warnings:

  - A unique constraint covering the columns `[userId,brokerId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `brokerId` to the `Bookmark` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "brokerId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Bookmark_brokerId_idx" ON "Bookmark"("brokerId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_brokerId_key" ON "Bookmark"("userId", "brokerId");

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "forex_brokers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
