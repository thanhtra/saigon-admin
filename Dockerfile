FROM node:18-alpine AS builder

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Production image ----
FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S app && adduser -S app -G app

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER app

EXPOSE 3002
CMD ["node", "server.js"]



# FROM node:18-alpine AS builder

# ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# WORKDIR /app

# RUN npm install -g npm@8.19.4 \
#     && npm config set registry https://registry.npmjs.org/ \
#     && npm config set fetch-retries 5 \
#     && npm config set fetch-retry-mintimeout 20000 \
#     && npm config set fetch-retry-maxtimeout 120000 \
#     && npm config set timeout 600000

# COPY package.json package-lock.json ./
# RUN npm ci --legacy-peer-deps

# COPY . .
# RUN npm run build

# FROM node:18-alpine

# WORKDIR /app
# ENV NODE_ENV=production

# RUN apk add --no-cache curl

# RUN addgroup -S app && adduser -S app -G app

# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/node_modules ./node_modules

# USER app

# EXPOSE 3005
# CMD ["npm", "run", "start"]
