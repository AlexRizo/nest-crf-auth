-- AlterTable
ALTER TABLE "public"."QuestionGroup" ADD COLUMN     "examId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."QuestionGroup" ADD CONSTRAINT "QuestionGroup_examId_fkey" FOREIGN KEY ("examId") REFERENCES "public"."Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
