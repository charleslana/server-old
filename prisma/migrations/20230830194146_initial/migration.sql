/*
  Warnings:

  - A unique constraint covering the columns `[user_character_id,group_id]` on the table `tb_group_invitation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tb_group_invitation_user_character_id_group_id_key" ON "tb_group_invitation"("user_character_id", "group_id");
