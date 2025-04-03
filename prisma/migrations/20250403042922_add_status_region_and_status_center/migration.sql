-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "statusCenter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "statusRegion" BOOLEAN NOT NULL DEFAULT false;
