/*
  Warnings:

  - The values [e] on the enum `Letter` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `examId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Letter_new" AS ENUM ('a', 'b', 'c', 'd');
ALTER TABLE "public"."Option" ALTER COLUMN "letter" TYPE "public"."Letter_new" USING ("letter"::text::"public"."Letter_new");
ALTER TYPE "public"."Letter" RENAME TO "Letter_old";
ALTER TYPE "public"."Letter_new" RENAME TO "Letter";
DROP TYPE "public"."Letter_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Question" ADD COLUMN     "examId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_examId_fkey" FOREIGN KEY ("examId") REFERENCES "public"."Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
