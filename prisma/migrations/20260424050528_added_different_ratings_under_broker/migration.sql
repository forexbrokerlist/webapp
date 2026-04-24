-- AlterTable
ALTER TABLE "forex_brokers" ADD COLUMN     "automated_traders_rating" DOUBLE PRECISION,
ADD COLUMN     "copy_traders_rating" DOUBLE PRECISION,
ADD COLUMN     "day_traders_rating" DOUBLE PRECISION,
ADD COLUMN     "investors_rating" DOUBLE PRECISION,
ADD COLUMN     "newer_traders_rating" DOUBLE PRECISION,
ADD COLUMN     "news_traders_rating" DOUBLE PRECISION,
ADD COLUMN     "scalpers_rating" DOUBLE PRECISION,
ADD COLUMN     "swing_traders_rating" DOUBLE PRECISION;
