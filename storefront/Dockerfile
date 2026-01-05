# =========================
# 1. Dependencies (production + dev)
# =========================
FROM node:20-alpine AS deps
WORKDIR /app

# Copia package files
COPY package.json package-lock.json ./

# Installa tutte le dependencies
RUN npm ci

# =========================
# 2. Production Dependencies Only
# =========================
FROM node:20-alpine AS prod-deps
WORKDIR /app

COPY package.json package-lock.json ./

# Installa SOLO production dependencies (senza devDependencies)
RUN npm ci --omit=dev

# =========================
# 3. Build
# =========================
FROM node:20-alpine AS builder
WORKDIR /app

# Set NODE_ENV per saltare check-env-variables durante build
ENV NODE_ENV=production

# Copia le dipendenze complete (serve per build)
COPY --from=deps /app/node_modules ./node_modules

# Copia il resto del progetto
COPY . .

# Build arguments per Next.js - Railway li passa automaticamente
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_MEILISEARCH_HOST
ARG NEXT_PUBLIC_MINIO_ENDPOINT
ARG NEXT_PUBLIC_DEFAULT_REGION
ARG MEDUSA_BACKEND_URL

# Set come environment variables per la build
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_MEILISEARCH_HOST=$NEXT_PUBLIC_MEILISEARCH_HOST
ENV NEXT_PUBLIC_MINIO_ENDPOINT=$NEXT_PUBLIC_MINIO_ENDPOINT
ENV NEXT_PUBLIC_DEFAULT_REGION=$NEXT_PUBLIC_DEFAULT_REGION
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL

# Build Next.js tramite launcher (esegue internamente next build)
RUN npm run build

# =========================
# 4. Runtime / Production
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Crea user non-root per sicurezza
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copia SOLO node_modules production (molto più leggero!)
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copia package.json per npm run start
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Copia files necessari
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js

USER nextjs

# Railway injecta automaticamente PORT
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start Next.js tramite launcher (esegue internamente next start -p $PORT)
CMD ["npm", "run", "start"]
