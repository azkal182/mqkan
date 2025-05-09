-- AlterTable
ALTER TABLE "Participant" ALTER COLUMN "kkUrl" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Official" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "aggree" BOOLEAN NOT NULL DEFAULT false,
    "regionId" TEXT,

    CONSTRAINT "Official_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Official" ADD CONSTRAINT "Official_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;
