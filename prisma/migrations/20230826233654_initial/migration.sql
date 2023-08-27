/*
  Warnings:

  - You are about to alter the column `description` on the `tb_group` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "tb_group" ALTER COLUMN "description" SET DATA TYPE VARCHAR(255);
