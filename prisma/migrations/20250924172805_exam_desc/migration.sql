-- DropForeignKey
ALTER TABLE "public"."Topic" DROP CONSTRAINT "Topic_examId_fkey";

-- AlterTable
ALTER TABLE "public"."Exam" ADD COLUMN     "description" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Topic" ADD CONSTRAINT "Topic_examId_fkey" FOREIGN KEY ("examId") REFERENCES "public"."Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
