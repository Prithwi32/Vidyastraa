/*
  Warnings:

  - You are about to drop the column `description` on the `Course` table. All the data in the column will be lost.
  - Added the required column `category` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detailedDescription` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficultyLevel` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortDescription` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('BEGINNER', 'MODERATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('JEE', 'NEET', 'CRASH_COURSES', 'OTHER');

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "description",
ADD COLUMN     "category" "Category" NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "detailedDescription" TEXT NOT NULL,
ADD COLUMN     "difficultyLevel" "DifficultyLevel" NOT NULL,
ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "keyTopics" TEXT[],
ADD COLUMN     "shortDescription" TEXT NOT NULL,
ADD COLUMN     "subtitle" TEXT,
ADD COLUMN     "thumbnail" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
