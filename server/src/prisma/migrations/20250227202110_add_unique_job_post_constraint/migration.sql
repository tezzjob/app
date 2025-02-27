/*
  Warnings:

  - A unique constraint covering the columns `[job_title,shop_id]` on the table `job_postings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "job_postings_job_title_shop_id_key" ON "job_postings"("job_title", "shop_id");
