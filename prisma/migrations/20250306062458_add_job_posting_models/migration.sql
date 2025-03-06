-- CreateTable
CREATE TABLE "JobPosting" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "techs" TEXT[],
    "salary" TEXT,
    "crawledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "matches" INTEGER,

    CONSTRAINT "JobPosting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobAnalysis" (
    "id" TEXT NOT NULL,
    "coverLetter" TEXT NOT NULL,
    "keyPoints" TEXT[],
    "questions" JSONB NOT NULL,
    "techFit" INTEGER NOT NULL,
    "cultureFit" INTEGER NOT NULL,
    "roleFit" INTEGER NOT NULL,
    "overallFit" INTEGER NOT NULL,
    "suggestedApproach" TEXT NOT NULL,

    CONSTRAINT "JobAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobPosting_url_key" ON "JobPosting"("url");

-- AddForeignKey
ALTER TABLE "JobAnalysis" ADD CONSTRAINT "JobAnalysis_id_fkey" FOREIGN KEY ("id") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
