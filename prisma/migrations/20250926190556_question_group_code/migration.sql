/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `QuestionGroup` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `QuestionGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."QuestionGroup" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "QuestionGroup_code_key" ON "public"."QuestionGroup"("code");
