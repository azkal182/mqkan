/*
  Warnings:

  - You are about to drop the column `disrtictId` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `disrtrictId` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_disrtictId_fkey";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "disrtictId",
ADD COLUMN     "disrtrictId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_disrtrictId_fkey" FOREIGN KEY ("disrtrictId") REFERENCES "District"("id") ON DELETE CASCADE ON UPDATE CASCADE;
