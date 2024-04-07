/*
  Warnings:

  - Added the required column `currency` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "currency" TEXT NOT NULL;
