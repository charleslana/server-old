/*
  Warnings:

  - You are about to drop the column `level` on the `tb_user_character_group` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `tb_user_character_group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tb_group" ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "tb_user_character_group" DROP COLUMN "level",
DROP COLUMN "name",
ADD COLUMN     "point" INTEGER;
