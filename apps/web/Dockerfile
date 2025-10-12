# Dockerfile pour Next.js Web - Multi-stage build optimisé
FROM node:22-alpine AS base
RUN corepack enable

# Stage 1: Dependencies
FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages packages
RUN pnpm install --frozen-lockfile --production=false

# Stage 2: Build
FROM dependencies AS build
WORKDIR /app
COPY apps/web apps/web

# Build-time arguments for Next.js public variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Set build-time environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}

# Build the application
RUN pnpm --filter @copronomie/web build

# Stage 3: Production
FROM base AS production
WORKDIR /app

# Copy package.json files for workspace resolution
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/package.json ./apps/api/package.json
COPY packages packages

# Install production dependencies
RUN pnpm install --frozen-lockfile --production

# Copy built application
COPY --from=build /app/apps/web/.next ./apps/web/.next
COPY --from=build /app/apps/web/public ./apps/web/public
COPY --from=build /app/apps/web/next.config.js ./apps/web/next.config.js

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S web -u 1001

# Set proper permissions for Next.js
RUN chown -R web:nodejs /app/apps/web/.next
USER web

# Set environment
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
WORKDIR /app
CMD ["pnpm", "--filter", "@copronomie/web", "start"]