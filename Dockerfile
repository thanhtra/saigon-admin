# =========================
# BUILD STAGE
# =========================
FROM node:18-alpine AS builder

WORKDIR /app

# Giảm lỗi mạng npm
RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build


# =========================
# RUNTIME STAGE
# =========================
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S app && adduser -S app -G app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

USER app

EXPOSE 3002

CMD ["npm", "run", "start"]
