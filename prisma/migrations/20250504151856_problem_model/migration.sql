-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateTable
CREATE TABLE "Problem" (
    "Id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "UserId" TEXT NOT NULL,
    "tag" TEXT[],
    "examples" JSONB NOT NULL,
    "contraints" TEXT NOT NULL,
    "hint" TEXT,
    "editorial" TEXT,
    "testcase" JSONB NOT NULL,
    "codeSnippit" JSONB NOT NULL,
    "referenceSolution" JSONB NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
