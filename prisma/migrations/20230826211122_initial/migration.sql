/*
  Warnings:

  - You are about to alter the column `name` on the `tb_user_character` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(20)`.

*/
-- CreateEnum
CREATE TYPE "RoleGroupEnum" AS ENUM ('Leader', 'Master', 'Member');

-- AlterTable
ALTER TABLE "tb_user_character" ALTER COLUMN "name" SET DATA TYPE VARCHAR(20);

-- CreateTable
CREATE TABLE "tb_group" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "requiredLevel" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_character_group" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "name" "RoleGroupEnum" NOT NULL DEFAULT 'Member',
    "user_character_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_user_character_group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_character_group_user_character_id_key" ON "tb_user_character_group"("user_character_id");

-- AddForeignKey
ALTER TABLE "tb_user_character_group" ADD CONSTRAINT "tb_user_character_group_user_character_id_fkey" FOREIGN KEY ("user_character_id") REFERENCES "tb_user_character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_character_group" ADD CONSTRAINT "tb_user_character_group_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "tb_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
