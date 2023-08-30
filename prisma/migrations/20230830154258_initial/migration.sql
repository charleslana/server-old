-- CreateTable
CREATE TABLE "tb_group_invitation" (
    "id" SERIAL NOT NULL,
    "user_character_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_group_invitation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_group_invitation" ADD CONSTRAINT "tb_group_invitation_user_character_id_fkey" FOREIGN KEY ("user_character_id") REFERENCES "tb_user_character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_group_invitation" ADD CONSTRAINT "tb_group_invitation_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "tb_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
