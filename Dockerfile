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

# Build the unchanged PostgreSQL client without connecting to a live database.
# Prerendering uses existing unavailable-data fallbacks; no schema push or seed.
RUN export DATABASE_URL="postgresql://synthetic:synthetic@127.0.0.1:9/kindline_build?connect_timeout=1" && \
    export DIRECT_URL="$DATABASE_URL" && \
    npx prisma generate && \
    npm run build && \
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

# Verify the shipped client/provider and native upload decoder without opening a DB.
RUN node -e "const fs=require('fs'); const s=fs.readFileSync('node_modules/.prisma/client/schema.prisma','utf8'); if(!/provider\\s*=\\s*\"postgresql\"/.test(s)) throw Error('PRISMA_PROVIDER_MISMATCH'); const sharp=require('sharp'); console.log(JSON.stringify({provider:'postgresql',sharp:sharp.versions.sharp,vips:sharp.versions.vips}));"

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
