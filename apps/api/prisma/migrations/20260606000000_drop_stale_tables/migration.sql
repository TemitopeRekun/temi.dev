-- Drop foreign key constraints first
ALTER TABLE "Proposal" DROP CONSTRAINT IF EXISTS "Proposal_jobLeadId_fkey";
ALTER TABLE "OutreachLog" DROP CONSTRAINT IF EXISTS "OutreachLog_jobLeadId_fkey";

-- Drop stale tables (JobLead feature was removed)
DROP TABLE IF EXISTS "OutreachLog";
DROP TABLE IF EXISTS "Proposal";
DROP TABLE IF EXISTS "JobLead";
DROP TABLE IF EXISTS "PlatformStats";

-- Drop stale enums
DROP TYPE IF EXISTS "JobPlatform";
DROP TYPE IF EXISTS "JobStatus";
DROP TYPE IF EXISTS "JobSource";
DROP TYPE IF EXISTS "ProposalVariant";
DROP TYPE IF EXISTS "OutreachChannel";

-- Drop viewCount column removed from BlogPost schema
ALTER TABLE "BlogPost" DROP COLUMN IF EXISTS "viewCount";
