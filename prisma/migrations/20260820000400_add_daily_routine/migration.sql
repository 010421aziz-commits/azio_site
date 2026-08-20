CREATE TABLE "DailyRoutine" (
  "id" SERIAL NOT NULL,
  "time" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DailyRoutine_pkey" PRIMARY KEY ("id")
);