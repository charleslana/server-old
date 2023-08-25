-- DropForeignKey
ALTER TABLE "tb_user_character" DROP CONSTRAINT "tb_user_character_character_id_fkey";

-- DropForeignKey
ALTER TABLE "tb_user_character" DROP CONSTRAINT "tb_user_character_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tb_user_character_item" DROP CONSTRAINT "tb_user_character_item_item_id_fkey";

-- DropForeignKey
ALTER TABLE "tb_user_character_item" DROP CONSTRAINT "tb_user_character_item_user_character_id_fkey";

-- DropForeignKey
ALTER TABLE "tb_user_role" DROP CONSTRAINT "tb_user_role_user_id_fkey";

-- AddForeignKey
ALTER TABLE "tb_user_role" ADD CONSTRAINT "tb_user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_character" ADD CONSTRAINT "tb_user_character_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_character" ADD CONSTRAINT "tb_user_character_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "tb_character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_character_item" ADD CONSTRAINT "tb_user_character_item_user_character_id_fkey" FOREIGN KEY ("user_character_id") REFERENCES "tb_user_character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_character_item" ADD CONSTRAINT "tb_user_character_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "tb_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
