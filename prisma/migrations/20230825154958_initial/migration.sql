-- CreateTable
CREATE TABLE "tb_item" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_character_item" (
    "id" SERIAL NOT NULL,
    "equpped" BOOLEAN,
    "user_character_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_user_character_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_user_character_item" ADD CONSTRAINT "tb_user_character_item_user_character_id_fkey" FOREIGN KEY ("user_character_id") REFERENCES "tb_user_character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_character_item" ADD CONSTRAINT "tb_user_character_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "tb_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
