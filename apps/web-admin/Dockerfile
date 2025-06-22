# Stage 1: Base image for pruning and dependency installation
FROM node:20-alpine AS base

RUN apk update && apk add --no-cache libc6-compat

WORKDIR /app

# Install pnpm and turbo globally
RUN npm install -g pnpm@10.4.1 turbo@2.1.3

# Copy the entire monorepo
COPY . .

# Prune the monorepo to only include the specified app and its dependencies
ARG APP
RUN turbo prune "$APP" --docker

# Stage 2: Install dependencies
FROM node:20-alpine AS installer

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install pnpm globally in this stage too
RUN npm install -g pnpm@10.4.1

# Copy only the package.json and lockfile from pruned output
COPY --from=base /app/out/json/ .

# Install dependencies with pnpm
RUN pnpm install --frozen-lockfile

# Stage 3: Build the app
FROM installer AS builder

WORKDIR /app

# Copy the rest of the source code from pruned output
COPY --from=base /app/out/full/ .

# Build the Next.js application
ARG APP
RUN pnpm turbo run build --filter="${APP}..."

# Stage 4: Production image
FROM node:20-alpine AS runner


WORKDIR /app

# Copy the standalone build output from the builder stage
ARG APP
COPY --from=builder /app/apps/$APP/.next/standalone ./
COPY --from=builder /app/apps/$APP/.next/static ./apps/$APP/.next/static

# Set user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app/apps/$APP

USER nextjs

# Expose the port
EXPOSE 3000

# Command to start the app
CMD ["node", "server.js"]
