-- CreateTable
CREATE TABLE "employee_job_posting_mapping" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "job_posting_id" INTEGER NOT NULL,
    "is_shortlisted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "employee_job_posting_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_job_posting_mapping_employee_id_job_posting_id_key" ON "employee_job_posting_mapping"("employee_id", "job_posting_id");

-- AddForeignKey
ALTER TABLE "employee_job_posting_mapping" ADD CONSTRAINT "employee_job_posting_mapping_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_job_posting_mapping" ADD CONSTRAINT "employee_job_posting_mapping_job_posting_id_fkey" FOREIGN KEY ("job_posting_id") REFERENCES "job_postings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
