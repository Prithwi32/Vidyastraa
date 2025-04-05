-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'MODERATE', 'ADVANCED', 'UNKNOWN');

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "difficulty" "Difficulty" NOT NULL DEFAULT 'UNKNOWN';
