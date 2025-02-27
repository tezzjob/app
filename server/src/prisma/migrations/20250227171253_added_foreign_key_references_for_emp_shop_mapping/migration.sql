-- AddForeignKey
ALTER TABLE "employee_shop_mapping" ADD CONSTRAINT "employee_shop_mapping_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_shop_mapping" ADD CONSTRAINT "employee_shop_mapping_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
