-- CreateTable
CREATE TABLE "_BrokersToTag" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BrokersToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BrokersToCategory" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BrokersToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BrokersToTag_B_index" ON "_BrokersToTag"("B");

-- CreateIndex
CREATE INDEX "_BrokersToCategory_B_index" ON "_BrokersToCategory"("B");

-- AddForeignKey
ALTER TABLE "_BrokersToTag" ADD CONSTRAINT "_BrokersToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "forex_brokers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrokersToTag" ADD CONSTRAINT "_BrokersToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrokersToCategory" ADD CONSTRAINT "_BrokersToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "forex_brokers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrokersToCategory" ADD CONSTRAINT "_BrokersToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
