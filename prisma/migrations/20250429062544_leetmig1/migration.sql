-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerify" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationToken" TEXT;
