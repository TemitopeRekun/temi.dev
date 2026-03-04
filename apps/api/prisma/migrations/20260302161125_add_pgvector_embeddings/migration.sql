-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "embedding" vector(768);

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "embedding" vector(768);
