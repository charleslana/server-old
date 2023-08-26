-- AlterTable
ALTER TABLE "tb_user" ADD COLUMN     "diamond" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "tb_user_character" ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "gold" INTEGER NOT NULL DEFAULT 100;
