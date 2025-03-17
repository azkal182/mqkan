-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('PUTRA', 'PUTRI');

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "no_registration" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "password" TEXT,
    "birth_place" TEXT NOT NULL,
    "birt_date" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "father_name" TEXT NOT NULL,
    "mother_name" TEXT NOT NULL,
    "phone_parrent" TEXT NOT NULL,
    "provinceId" INTEGER NOT NULL,
    "regencyId" INTEGER NOT NULL,
    "disrtictId" INTEGER NOT NULL,
    "villageId" INTEGER NOT NULL,
    "kkUrl" TEXT NOT NULL,
    "ijazahUrl" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "institution_name" TEXT NOT NULL,
    "institution_address" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryToSubcategory" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "subcategoryId" INTEGER NOT NULL,

    CONSTRAINT "CategoryToSubcategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryToSubcategory_categoryId_subcategoryId_key" ON "CategoryToSubcategory"("categoryId", "subcategoryId");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "Regency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_disrtictId_fkey" FOREIGN KEY ("disrtictId") REFERENCES "District"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "Village"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryToSubcategory" ADD CONSTRAINT "CategoryToSubcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryToSubcategory" ADD CONSTRAINT "CategoryToSubcategory_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
