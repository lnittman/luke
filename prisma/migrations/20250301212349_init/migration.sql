-- CreateTable
CREATE TABLE "GeneratedProject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL DEFAULT '#',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "overviewItems" TEXT[],
    "coreItems" TEXT[],
    "architectureItems" TEXT[],
    "techItems" TEXT[],
    "initDocument" TEXT,
    "designDocument" TEXT,
    "implementationDocument" TEXT,
    "userPrompt" TEXT NOT NULL,
    "userIp" TEXT,
    "userFingerprint" TEXT,

    CONSTRAINT "GeneratedProject_pkey" PRIMARY KEY ("id")
);
