/*
  Warnings:

  - You are about to drop the column `questionGroupId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `QuestionGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_questionGroupId_fkey";

-- DropForeignKey
ALTER TABLE "public"."QuestionGroup" DROP CONSTRAINT "QuestionGroup_examId_fkey";

-- DropForeignKey
ALTER TABLE "public"."QuestionGroup" DROP CONSTRAINT "QuestionGroup_topicId_fkey";

-- AlterTable
ALTER TABLE "public"."Question" DROP COLUMN "questionGroupId",
ADD COLUMN     "groupId" TEXT;

-- DropTable
DROP TABLE "public"."QuestionGroup";

-- CreateTable
CREATE TABLE "public"."Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "topicId" TEXT,
    "code" TEXT NOT NULL,
    "examId" TEXT,
    "content" TEXT,
    "resourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_code_key" ON "public"."Group"("code");

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Group" ADD CONSTRAINT "Group_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Group" ADD CONSTRAINT "Group_examId_fkey" FOREIGN KEY ("examId") REFERENCES "public"."Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
