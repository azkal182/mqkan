-- CreateEnum
CREATE TYPE "PenilaianTipe" AS ENUM ('PENYISIHAN', 'FINAL');

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "subKelasId" TEXT;

-- CreateTable
CREATE TABLE "Kelas" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Kelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubKelas" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kelasId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubKelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penilaian" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "nilai" DOUBLE PRECISION NOT NULL,
    "tipe" "PenilaianTipe" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Penilaian_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kelas_nama_key" ON "Kelas"("nama");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_subKelasId_fkey" FOREIGN KEY ("subKelasId") REFERENCES "SubKelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubKelas" ADD CONSTRAINT "SubKelas_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "Kelas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penilaian" ADD CONSTRAINT "Penilaian_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
