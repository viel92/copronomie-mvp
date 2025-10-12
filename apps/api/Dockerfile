# Dockerfile pour API Hono - Multi-stage build optimisé
FROM node:22-alpine AS base
RUN corepack enable

# Stage 1: Dependencies
FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages packages
RUN pnpm install --frozen-lockfile --production=false

# Stage 2: Build
FROM dependencies AS build
WORKDIR /app
COPY apps/api apps/api
RUN pnpm --filter @copronomie/api build

# Stage 3: Production
FROM base AS production
WORKDIR /app

# Copy only production dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages packages
RUN pnpm install --frozen-lockfile --production

# Copy built application
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S api -u 1001
USER api

# Set environment
ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

# Start the application
CMD ["node", "apps/api/dist/index.js"]