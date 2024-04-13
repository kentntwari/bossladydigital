/*
  Warnings:

  - You are about to drop the column `hasBeenViewed` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "hasBeenViewed",
ADD COLUMN     "has_been_viewed" BOOLEAN NOT NULL DEFAULT false;
