/*
  Warnings:

  - You are about to drop the column `nama` on the `Kelas` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `SubKelas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Kelas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Kelas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `SubKelas` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Kelas_nama_key";

-- AlterTable
ALTER TABLE "Kelas" DROP COLUMN "nama",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubKelas" DROP COLUMN "nama",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Kelas_name_key" ON "Kelas"("name");
