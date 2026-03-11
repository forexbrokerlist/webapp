/*
  Warnings:

  - You are about to drop the column `toolId` on the `Bookmark` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bookmark" DROP CONSTRAINT "Bookmark_toolId_fkey";

-- DropIndex
DROP INDEX "Bookmark_toolId_idx";

-- DropIndex
DROP INDEX "Bookmark_userId_toolId_key";

-- AlterTable
ALTER TABLE "Bookmark" DROP COLUMN "toolId";
