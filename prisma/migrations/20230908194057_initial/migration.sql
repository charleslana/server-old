-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('Admin', 'User');

-- CreateEnum
CREATE TYPE "RoleGroupEnum" AS ENUM ('Leader', 'Master', 'Member');

-- CreateEnum
CREATE TYPE "CharacterClassEnum" AS ENUM ('Warrior', 'Blader', 'Wizard', 'ForceArcher', 'ForceShielder', 'ForceBlader', 'Gladiator', 'ForceGunner', 'DarkMage');

-- CreateTable
CREATE TABLE "tb_user" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "diamond" INTEGER NOT NULL DEFAULT 0,
    "banned_time" TIMESTAMP(3),
    "auth_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_role" (
    "id" SERIAL NOT NULL,
    "name" "RoleEnum" NOT NULL DEFAULT 'User',
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_character" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "character_class" "CharacterClassEnum" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_character" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "strength" INTEGER NOT NULL DEFAULT 1,
    "intelligence" INTEGER NOT NULL DEFAULT 1,
    "dexterity" INTEGER NOT NULL DEFAULT 1,
    "point" INTEGER NOT NULL DEFAULT 10,
    "spentPoint" INTEGER,
    "gold" INTEGER NOT NULL DEFAULT 100,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "user_id" INTEGER NOT NULL,
    "character_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_user_character_pkey" PRIMARY KEY ("id")
);

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
    "equipped" BOOLEAN,
    "user_character_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_user_character_item_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "tb_group" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "description" VARCHAR(255),
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "requiredLevel" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_character_group" (
    "id" SERIAL NOT NULL,
    "point" INTEGER,
    "role" "RoleGroupEnum" NOT NULL DEFAULT 'Member',
    "user_character_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_user_character_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_group_invitation" (
    "id" SERIAL NOT NULL,
    "user_character_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_group_invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_message" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "sender_character_id" INTEGER,
    "receiver_character_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_message_item" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_message_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_email_key" ON "tb_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tb_character_name_key" ON "tb_character"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_character_name_key" ON "tb_user_character"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_character_group_user_character_id_key" ON "tb_user_character_group"("user_character_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_group_invitation_user_character_id_group_id_key" ON "tb_group_invitation"("user_character_id", "group_id");

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

-- AddForeignKey
ALTER TABLE "tb_user_character_skill" ADD CONSTRAINT "tb_user_character_skill_user_character_id_fkey" FOREIGN KEY ("user_character_id") REFERENCES "tb_user_character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_character_skill" ADD CONSTRAINT "tb_user_character_skill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "tb_skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_character_group" ADD CONSTRAINT "tb_user_character_group_user_character_id_fkey" FOREIGN KEY ("user_character_id") REFERENCES "tb_user_character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_character_group" ADD CONSTRAINT "tb_user_character_group_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "tb_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_group_invitation" ADD CONSTRAINT "tb_group_invitation_user_character_id_fkey" FOREIGN KEY ("user_character_id") REFERENCES "tb_user_character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_group_invitation" ADD CONSTRAINT "tb_group_invitation_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "tb_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_message" ADD CONSTRAINT "tb_message_sender_character_id_fkey" FOREIGN KEY ("sender_character_id") REFERENCES "tb_user_character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_message" ADD CONSTRAINT "tb_message_receiver_character_id_fkey" FOREIGN KEY ("receiver_character_id") REFERENCES "tb_user_character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_message_item" ADD CONSTRAINT "tb_message_item_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "tb_message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_message_item" ADD CONSTRAINT "tb_message_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "tb_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
