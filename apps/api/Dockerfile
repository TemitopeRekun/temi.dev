FROM node:20-alpine AS base
RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/ai/package.json packages/ai/package.json

# `api...` selects the API plus its workspace dependencies (@temi/types,
# @temi/ai, @temi/config) so their devDependencies (TypeScript) are available to
# build them below.
RUN pnpm install --frozen-lockfile --filter "api..."

COPY apps/api/ ./apps/api/
COPY packages/config/ ./packages/config/
COPY packages/types/ ./packages/types/
COPY packages/ai/ ./packages/ai/

# Build the shared workspace packages (in dependency order) before the API so
# the compiled prompts/types/constants exist for `nest build` and are present
# in node_modules for `require()` at runtime. This is what makes the AI prompts
# ship reliably in the image (previously read from a missing cwd-relative path).
RUN pnpm --filter api prisma:generate \
 && pnpm --filter "@temi/types" build \
 && pnpm --filter "@temi/ai" build \
 && pnpm --filter api build

EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
