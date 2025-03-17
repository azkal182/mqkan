/*
  Warnings:

  - You are about to drop the column `phone_parrent` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `nik` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parrent_phone` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "phone_parrent",
ADD COLUMN     "nik" TEXT NOT NULL,
ADD COLUMN     "parrent_phone" TEXT NOT NULL;
