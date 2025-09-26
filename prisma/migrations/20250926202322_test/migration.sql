/*
  Warnings:

  - You are about to drop the column `groupId` on the `Question` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_groupId_fkey";

-- AlterTable
ALTER TABLE "public"."Question" DROP COLUMN "groupId",
ADD COLUMN     "questionGroupId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_questionGroupId_fkey" FOREIGN KEY ("questionGroupId") REFERENCES "public"."QuestionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
