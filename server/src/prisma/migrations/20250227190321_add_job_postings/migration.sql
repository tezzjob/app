-- AlterTable
ALTER TABLE "shop" ADD COLUMN     "business_category" TEXT,
ADD COLUMN     "working_hours" TEXT;

-- CreateTable
CREATE TABLE "job_postings" (
    "id" SERIAL NOT NULL,
    "job_title" TEXT NOT NULL,
    "salary_per_month" TEXT NOT NULL,
    "timing_from" TEXT NOT NULL,
    "timing_to" TEXT NOT NULL,
    "shop_id" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "job_postings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
