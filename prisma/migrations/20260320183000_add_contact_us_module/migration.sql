-- CreateTable
CREATE TABLE "ContactUs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactUs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactUs_email_idx" ON "ContactUs"("email");

-- CreateIndex
CREATE INDEX "ContactUs_createdAt_idx" ON "ContactUs"("createdAt");
