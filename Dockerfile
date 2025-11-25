# syntax=docker/dockerfile:1
FROM node:20-alpine AS build
WORKDIR /app
ENV NODE_ENV=production

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate && pnpm install --frozen-lockfile

# Copy source and build frontend
COPY . .
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

# Copy built app (including node_modules and dist)
COPY --from=build /app /app

# Expose API port
EXPOSE 3001

# Start server with tsx
CMD ["node", "./node_modules/.bin/tsx", "api/server.ts"]

