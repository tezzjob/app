-- CreateTable
CREATE TABLE "shopkeeper" (
    "id" SERIAL NOT NULL,
    "shop_name" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "shop_location" TEXT NOT NULL,
    "owner_mobile" TEXT NOT NULL,

    CONSTRAINT "shopkeeper_pkey" PRIMARY KEY ("id")
);
