/*
  Warnings:

  - You are about to drop the `_SubjectToTest` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TestSubject" AS ENUM ('PHYSICS', 'CHEMISTRY', 'MATHS', 'BIOLOGY');

-- DropForeignKey
ALTER TABLE "_SubjectToTest" DROP CONSTRAINT "_SubjectToTest_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectToTest" DROP CONSTRAINT "_SubjectToTest_B_fkey";

-- AlterTable
ALTER TABLE "tests" ADD COLUMN     "subjects" "TestSubject"[];

-- DropTable
DROP TABLE "_SubjectToTest";

-- DropEnum
DROP TYPE "SubjectEnum";
