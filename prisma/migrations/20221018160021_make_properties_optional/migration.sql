-- AlterTable
ALTER TABLE "games" ALTER COLUMN "result_player_1" DROP NOT NULL,
ALTER COLUMN "result_player_2" DROP NOT NULL,
ALTER COLUMN "result_player_3" DROP NOT NULL,
ALTER COLUMN "result_player_4" DROP NOT NULL,
ALTER COLUMN "finished" DROP NOT NULL;
