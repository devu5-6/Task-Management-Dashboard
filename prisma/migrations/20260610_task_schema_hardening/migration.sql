-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'completed');

-- Normalize existing rows before applying stricter constraints
UPDATE "Task"
SET "description" = ''
WHERE "description" IS NULL;

UPDATE "Task"
SET "status" = 'pending'
WHERE "status" IS NULL OR "status" NOT IN ('pending', 'completed');

-- AlterTable
ALTER TABLE "Task"
ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" TYPE "TaskStatus" USING ("status"::"TaskStatus"),
ALTER COLUMN "status" SET DEFAULT 'pending';
