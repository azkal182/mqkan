/*
  Warnings:

  - You are about to drop the column `disrtrictId` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `districtId` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_disrtrictId_fkey";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "disrtrictId",
ADD COLUMN     "districtId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE CASCADE ON UPDATE CASCADE;
