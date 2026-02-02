# syntax=docker/dockerfile:1
FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies with cache mount
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --production

# Copy source
COPY src/shared ./src/shared
COPY dashboard ./dashboard

# Expose port
EXPOSE 3000

# Run the dashboard
CMD ["bun", "run", "dashboard/server.ts"]
