/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Question" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Question_code_key" ON "public"."Question"("code");
