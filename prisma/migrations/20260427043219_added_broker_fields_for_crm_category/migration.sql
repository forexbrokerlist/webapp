-- CreateEnum
CREATE TYPE "DeploymentType" AS ENUM ('Cloud', 'SelfHosted', 'Both', 'Other');

-- CreateEnum
CREATE TYPE "BusinessSize" AS ENUM ('Startup', 'MidSize', 'Enterprise');

-- CreateEnum
CREATE TYPE "SupportChannel" AS ENUM ('Email', 'Phone', 'LiveChat');

-- AlterTable
ALTER TABLE "forex_brokers" ADD COLUMN     "api_access" BOOLEAN,
ADD COLUMN     "bestFor" "BusinessSize"[],
ADD COLUMN     "company_name" VARCHAR(50),
ADD COLUMN     "deployment_type" "DeploymentType" NOT NULL DEFAULT 'Both',
ADD COLUMN     "free_trial_available" BOOLEAN,
ADD COLUMN     "languages_supported" TEXT[],
ADD COLUMN     "starting_price" TEXT,
ADD COLUMN     "support_channels" "SupportChannel"[],
ADD COLUMN     "support_hours" TEXT;
