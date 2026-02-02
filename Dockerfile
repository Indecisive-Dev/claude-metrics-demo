FROM oven/bun:1-alpine

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile --production

# Copy source
COPY src ./src

# Create directory for checkpoint persistence
RUN mkdir -p /data

# Set environment variable for checkpoint file location
ENV CHECKPOINT_FILE=/data/checkpoint.json

# Run the consumer
CMD ["bun", "run", "src/consumer/index.ts"]
