/*
  Warnings:

  - You are about to drop the column `subcategoryId` on the `Participant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_subcategoryId_fkey";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "subcategoryId",
ADD COLUMN     "categoryToSubcategoryId" INTEGER;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_categoryToSubcategoryId_fkey" FOREIGN KEY ("categoryToSubcategoryId") REFERENCES "CategoryToSubcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
