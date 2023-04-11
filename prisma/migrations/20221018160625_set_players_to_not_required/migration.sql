-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_player_1_user_id_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_player_2_user_id_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_player_3_user_id_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_player_4_user_id_fkey";

-- AlterTable
ALTER TABLE "games" ALTER COLUMN "player_1" DROP NOT NULL,
ALTER COLUMN "player_1_user_id" DROP NOT NULL,
ALTER COLUMN "player_2" DROP NOT NULL,
ALTER COLUMN "player_2_user_id" DROP NOT NULL,
ALTER COLUMN "player_3" DROP NOT NULL,
ALTER COLUMN "player_3_user_id" DROP NOT NULL,
ALTER COLUMN "player_4" DROP NOT NULL,
ALTER COLUMN "player_4_user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player_1_user_id_fkey" FOREIGN KEY ("player_1_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player_2_user_id_fkey" FOREIGN KEY ("player_2_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player_3_user_id_fkey" FOREIGN KEY ("player_3_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player_4_user_id_fkey" FOREIGN KEY ("player_4_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
