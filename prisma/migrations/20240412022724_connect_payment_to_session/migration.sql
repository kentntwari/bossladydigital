/*
  Warnings:

  - A unique constraint covering the columns `[payment_id]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payment_id` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "payment_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_payment_id_key" ON "Session"("payment_id");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
