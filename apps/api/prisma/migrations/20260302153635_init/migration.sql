-- CreateEnum
CREATE TYPE "JobPlatform" AS ENUM ('UPWORK', 'FIVERR', 'LINKEDIN', 'REMOTEOK', 'WELLFOUND', 'DIRECT', 'OTHER');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('NEW', 'DRAFTING', 'APPLIED', 'INTERVIEWING', 'CLOSED', 'REJECTED');

-- CreateEnum
CREATE TYPE "JobSource" AS ENUM ('MANUAL', 'CSV', 'RSS');

-- CreateEnum
CREATE TYPE "ProposalVariant" AS ENUM ('SHORT', 'TECHNICAL', 'FRIENDLY', 'CTO_PITCH');

-- CreateEnum
CREATE TYPE "OutreachChannel" AS ENUM ('EMAIL', 'LINKEDIN', 'PLATFORM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "techStack" TEXT[],
    "liveUrl" TEXT,
    "repoUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "tags" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "message" TEXT NOT NULL,
    "service" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobLead" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "platform" "JobPlatform" NOT NULL,
    "description" TEXT NOT NULL,
    "techStack" TEXT[],
    "budgetMin" INTEGER,
    "budgetMax" INTEGER,
    "currency" TEXT,
    "url" TEXT,
    "contactEmail" TEXT,
    "contactName" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "scoreReason" TEXT,
    "pitchAngle" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'NEW',
    "source" "JobSource" NOT NULL DEFAULT 'MANUAL',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "jobLeadId" TEXT NOT NULL,
    "variant" "ProposalVariant" NOT NULL,
    "content" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutreachLog" (
    "id" TEXT NOT NULL,
    "jobLeadId" TEXT NOT NULL,
    "channel" "OutreachChannel" NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL,
    "subject" TEXT,
    "body" TEXT,
    "response" TEXT,
    "responseAt" TIMESTAMP(3),
    "outcome" TEXT,

    CONSTRAINT "OutreachLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformStats" (
    "id" TEXT NOT NULL,
    "platform" "JobPlatform" NOT NULL,
    "proposalsSent" INTEGER NOT NULL DEFAULT 0,
    "replies" INTEGER NOT NULL DEFAULT 0,
    "interviews" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformStats_platform_key" ON "PlatformStats"("platform");

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_jobLeadId_fkey" FOREIGN KEY ("jobLeadId") REFERENCES "JobLead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutreachLog" ADD CONSTRAINT "OutreachLog_jobLeadId_fkey" FOREIGN KEY ("jobLeadId") REFERENCES "JobLead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
