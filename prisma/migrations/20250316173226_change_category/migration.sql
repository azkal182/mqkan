/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Participant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subcategoryId]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subcategoryId` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_categoryId_fkey";

-- DropIndex
DROP INDEX "Participant_categoryId_key";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "categoryId",
ADD COLUMN     "subcategoryId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Participant_subcategoryId_key" ON "Participant"("subcategoryId");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "CategoryToSubcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
