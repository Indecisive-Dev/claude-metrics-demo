// Bun automatically loads .env files

export const S2_CONFIG = {
  accessToken: process.env.S2_ACCESS_TOKEN || "",
  basin: process.env.S2_BASIN || "claude-metrics",
  stream: process.env.S2_STREAM || "prompts",
};

export const TINYBIRD_CONFIG = {
  host: process.env.TINYBIRD_HOST || "https://api.us-west-2.aws.tinybird.co",
  token: process.env.TINYBIRD_TOKEN || "",
  datasource: process.env.TINYBIRD_DATASOURCE || "prompt_metrics",
};

export const CONSUMER_CONFIG = {
  batchSize: 100,
  flushIntervalMs: 5000,
  checkpointFile: process.env.CHECKPOINT_FILE || "./checkpoint.json",
};
