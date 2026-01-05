# =========================
# 1. Dependencies
# =========================
FROM node:20-alpine AS deps
WORKDIR /app

# Enable Corepack per Yarn Berry
RUN corepack enable

# Copia solo i file necessari per installare dipendenze
COPY package.json .yarnrc.yml ./

# Installa le dipendenze in modalità immutable
RUN yarn install --immutable

# =========================
# 2. Build
# =========================
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

# Copia le dipendenze installate
COPY --from=deps /app ./

# Copia il resto del progetto
COPY . .

# Build per produzione: usa lo script build:prod (salta await-backend)
RUN npm run build:prod

# =========================
# 3. Runtime / Production
# =========================
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Abilita Corepack per sicurezza
RUN corepack enable

# Copia tutto dalla build
COPY --from=builder /app ./

# Railway injecta automaticamente PORT
EXPOSE 3000

# Comando di start: legge le variabili runtime (MEDUSA_BACKEND_URL ecc.)
CMD ["npm", "run", "start"]
