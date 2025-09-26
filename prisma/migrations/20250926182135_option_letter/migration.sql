/*
  Warnings:

  - The values [gragNDrop] on the enum `QuestionType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `letter` to the `Option` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Letter" AS ENUM ('a', 'b', 'c', 'd', 'e');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."QuestionType_new" AS ENUM ('singleChoice', 'multipleChoice', 'dragNDrop', 'match');
ALTER TABLE "public"."Question" ALTER COLUMN "type" TYPE "public"."QuestionType_new" USING ("type"::text::"public"."QuestionType_new");
ALTER TYPE "public"."QuestionType" RENAME TO "QuestionType_old";
ALTER TYPE "public"."QuestionType_new" RENAME TO "QuestionType";
DROP TYPE "public"."QuestionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Option" ADD COLUMN     "letter" "public"."Letter" NOT NULL;
