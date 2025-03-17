/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Participant_subcategoryId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Participant_nik_key" ON "Participant"("nik");
