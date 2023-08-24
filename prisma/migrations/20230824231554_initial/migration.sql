/*
  Warnings:

  - You are about to drop the column `userId` on the `tb_user_character` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `tb_user_character` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tb_user_character" DROP CONSTRAINT "tb_user_character_userId_fkey";

-- AlterTable
ALTER TABLE "tb_user_character" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "tb_user_character" ADD CONSTRAINT "tb_user_character_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
