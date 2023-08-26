/*
  Warnings:

  - You are about to drop the column `equpped` on the `tb_user_character_item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tb_user_character_item" DROP COLUMN "equpped",
ADD COLUMN     "equipped" BOOLEAN;

-- CreateTable
CREATE TABLE "tb_skill" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_character_skill" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "user_character_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_user_character_skill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_user_character_skill" ADD CONSTRAINT "tb_user_character_skill_user_character_id_fkey" FOREIGN KEY ("user_character_id") REFERENCES "tb_user_character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_character_skill" ADD CONSTRAINT "tb_user_character_skill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "tb_skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
