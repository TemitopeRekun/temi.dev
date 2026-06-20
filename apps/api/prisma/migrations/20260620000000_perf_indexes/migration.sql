-- Relational indexes matching the @@index declarations in schema.prisma.
-- These back the list queries that filter/sort on these columns.

-- CreateIndex
CREATE INDEX "Project_featured_order_idx" ON "Project"("featured", "order");

-- CreateIndex
CREATE INDEX "BlogPost_published_publishedAt_idx" ON "BlogPost"("published", "publishedAt");

-- CreateIndex
CREATE INDEX "Lead_status_createdAt_idx" ON "Lead"("status", "createdAt");

-- HNSW vector indexes for approximate-nearest-neighbour semantic search.
-- NOTE: the `vector_cosine_ops` opclass matches the `<=>` (cosine distance)
-- operator used by semanticSearch(). At the current corpus size (<10K rows) an
-- exact sequential scan is perfectly acceptable; these indexes are
-- future-proofing for when the corpus grows. They are managed outside the
-- Prisma schema because pgvector index types are not yet first-class in Prisma.
CREATE INDEX IF NOT EXISTS blogpost_embedding_hnsw
  ON "BlogPost" USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS project_embedding_hnsw
  ON "Project" USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
