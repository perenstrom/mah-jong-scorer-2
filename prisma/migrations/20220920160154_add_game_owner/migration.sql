/*
  Warnings:

  - Added the required column `owner_user_id` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "games" ADD COLUMN     "owner_user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
