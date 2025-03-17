/*
  Warnings:

  - A unique constraint covering the columns `[categoryId]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Participant_categoryId_key" ON "Participant"("categoryId");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryToSubcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
