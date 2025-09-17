-- CreateEnum
CREATE TYPE "public"."Roles" AS ENUM ('admin', 'manager', 'applicant', 'student');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "roles" "public"."Roles"[] DEFAULT ARRAY['applicant']::"public"."Roles"[];
