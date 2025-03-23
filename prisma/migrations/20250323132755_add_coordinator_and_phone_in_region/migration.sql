/*
  Warnings:

  - Added the required column `coordinator` to the `Region` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Region` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Region" ADD COLUMN     "coordinator" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;
