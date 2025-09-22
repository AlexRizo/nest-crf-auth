/*
  Warnings:

  - You are about to drop the column `roles` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "roles",
ADD COLUMN     "role" "public"."Roles" NOT NULL DEFAULT 'applicant',
ALTER COLUMN "first_name" DROP DEFAULT,
ALTER COLUMN "last_name" DROP DEFAULT;
