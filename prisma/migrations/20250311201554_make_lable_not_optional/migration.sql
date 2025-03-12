/*
  Warnings:

  - Made the column `label` on table `Permission` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Permission" ALTER COLUMN "label" SET NOT NULL;
