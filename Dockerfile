FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Ensure build arguments are available as environment variables for the build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_TELEMETRY_DISABLED 1

# During build, we use a temporary SQLite database to satisfy Next.js prerendering
# of pages that fetch data from Prisma. This ensures static generation succeeds.
# Since we now use PostgreSQL in schema.prisma, we must override the provider
# during build to use SQLite for this temporary step.
RUN export DATABASE_URL="file:./build.db" && \
    export DIRECT_URL="file:./build.db" && \
    cp prisma/schema.prisma prisma/schema.prisma.original && \
    sed -i 's/provider = "postgresql"/provider = "sqlite"/' prisma/schema.prisma && \
    sed -i '/directUrl = env("DIRECT_URL")/d' prisma/schema.prisma && \
    npx prisma generate && \
    npx prisma db push --accept-data-loss && \
    npm run build && \
    cp prisma/schema.prisma.original prisma/schema.prisma && \
    npx prisma generate && \
    mkdir -p .next/standalone/prisma && \
    cp prisma/schema.prisma .next/standalone/prisma/schema.prisma && \
    mkdir -p .next/standalone/node_modules/.prisma/client && \
    cp -R node_modules/.prisma/client/* .next/standalone/node_modules/.prisma/client/

# Production image, copy all the files and run next
FROM base AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
