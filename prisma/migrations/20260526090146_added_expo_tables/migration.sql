-- CreateTable
CREATE TABLE "expo_getrotation" (
    "id" SERIAL NOT NULL,
    "url" TEXT,
    "expo_id" TEXT,
    "content" TEXT,
    "start_time" TIMESTAMPTZ,
    "end_time" TIMESTAMPTZ,
    "linkurl" TEXT,
    "name" TEXT,

    CONSTRAINT "expo_getrotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expo_tourcity" (
    "id" SERIAL NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "expoid" TEXT,
    "flag" TEXT,
    "expoimg" TEXT,
    "starting_date" TIMESTAMPTZ,
    "content" TEXT,

    CONSTRAINT "expo_tourcity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expo_news" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "imgurl" TEXT,
    "summary" TEXT,
    "content" TEXT,

    CONSTRAINT "expo_news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expo_countrydata" (
    "id" SERIAL NOT NULL,
    "country_code" TEXT,
    "name" TEXT,
    "coords" JSONB,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expo_countrydata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expo_history" (
    "id" SERIAL NOT NULL,
    "expo_id" TEXT,
    "year" INTEGER,
    "img" TEXT,
    "city" TEXT,
    "country" TEXT,
    "flag" TEXT,
    "linkurl" TEXT,
    "content" TEXT,
    "start_time" TIMESTAMPTZ,
    "end_time" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expo_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "expo_getrotation_expo_id_key" ON "expo_getrotation"("expo_id");

-- CreateIndex
CREATE UNIQUE INDEX "expo_tourcity_expoid_key" ON "expo_tourcity"("expoid");

-- CreateIndex
CREATE UNIQUE INDEX "expo_countrydata_country_code_key" ON "expo_countrydata"("country_code");

-- CreateIndex
CREATE UNIQUE INDEX "expo_history_expo_id_key" ON "expo_history"("expo_id");
