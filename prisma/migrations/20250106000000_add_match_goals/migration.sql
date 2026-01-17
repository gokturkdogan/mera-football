-- CreateTable
CREATE TABLE "MatchGoal" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "minute" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchGoal_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "MatchScore" DROP COLUMN "teamAGoals",
DROP COLUMN "teamBGoals";

-- CreateIndex
CREATE INDEX "MatchGoal_matchId_idx" ON "MatchGoal"("matchId");

-- CreateIndex
CREATE INDEX "MatchGoal_userId_idx" ON "MatchGoal"("userId");

-- CreateIndex
CREATE INDEX "MatchGoal_matchId_userId_idx" ON "MatchGoal"("matchId", "userId");

-- AddForeignKey
ALTER TABLE "MatchGoal" ADD CONSTRAINT "MatchGoal_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchGoal" ADD CONSTRAINT "MatchGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
