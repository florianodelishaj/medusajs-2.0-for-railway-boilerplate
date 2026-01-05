# ------------------------
# 1. Dependencies
# ------------------------
FROM node:20-alpine AS deps
WORKDIR /app

# Enable corepack for Yarn Berry
RUN corepack enable

# COPY SOLO i file necessari
COPY package.json .yarnrc.yml ./

# Install dependencies
RUN yarn install --immutable

# ------------------------
# 2. Build
# ------------------------
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY --from=deps /app ./
COPY . .

RUN yarn build

# ------------------------
# 3. Production
# ------------------------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable

COPY --from=builder /app ./

# Railway injects PORT
EXPOSE 3000

CMD ["npm", "run", "start"]
