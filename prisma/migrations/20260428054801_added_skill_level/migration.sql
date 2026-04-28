-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- AlterTable
ALTER TABLE "forex_brokers" ADD COLUMN     "skill_level" "SkillLevel"[];
