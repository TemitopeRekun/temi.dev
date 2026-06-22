# ADR-0003: pgvector for RAG retrieval

- **Status:** Accepted
- **Date:** 2026-06-22

## Context

The "Digital Brain" assistant answers questions over blog posts and projects via
retrieval-augmented generation. We already run Postgres (Supabase) for primary
data and want to avoid operating a separate vector database.

## Decision

Store embeddings in **Postgres with the `pgvector` extension**:

- `BlogPost.embedding` / `Project.embedding` are `vector(768)` columns
  (`gemini-embedding-001`, 768-dim).
- Retrieval uses cosine distance (`<=>`) with **HNSW indexes**
  (`vector_cosine_ops`, `m=16, ef_construction=64`), added in a hand-written
  Prisma migration (vector index types are not first-class in Prisma).
- A keyword `ILIKE` fallback runs when pgvector is unavailable, so the feature
  degrades gracefully.
- A RAG request embeds the question **once** and searches both tables with that
  single vector (one paid embedding call per ask).

## Consequences

- One datastore to operate and back up; transactional consistency between
  content and its embedding.
- HNSW keeps nearest-neighbour search sub-linear as the corpus grows.
- Vector indexes live in raw SQL migrations, slightly outside Prisma's model.
- If the corpus reaches millions of rows or needs multi-tenant isolation, a
  dedicated vector store could be revisited.
