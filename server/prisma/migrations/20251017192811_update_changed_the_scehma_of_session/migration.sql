-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "inputTechStack" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "inputLanguage" SET DEFAULT ARRAY[]::TEXT[];
