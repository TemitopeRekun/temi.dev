FROM node:20-alpine AS base
RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/config/package.json packages/config/package.json

RUN pnpm install --frozen-lockfile --filter api

COPY apps/api/ ./apps/api/
COPY packages/config/ ./packages/config/

RUN pnpm --filter api prisma:generate && pnpm --filter api build

EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
