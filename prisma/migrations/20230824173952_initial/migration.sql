-- CreateTable
CREATE TABLE "tb_character" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_character" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "userId" INTEGER NOT NULL,
    "character_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_user_character_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_character_name_key" ON "tb_character"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_character_name_key" ON "tb_user_character"("name");

-- AddForeignKey
ALTER TABLE "tb_user_character" ADD CONSTRAINT "tb_user_character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_character" ADD CONSTRAINT "tb_user_character_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "tb_character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
