import { CONSUMER_CONFIG } from "../shared/config.js";
import type { PromptMetric } from "../shared/types.js";
import { TinybirdClient } from "./tinybird-client.js";

export class BatchProcessor {
  private buffer: PromptMetric[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly client: TinybirdClient;
  private readonly batchSize: number;
  private readonly flushIntervalMs: number;

  constructor() {
    this.client = new TinybirdClient();
    this.batchSize = CONSUMER_CONFIG.batchSize;
    this.flushIntervalMs = CONSUMER_CONFIG.flushIntervalMs;
  }

  async add(record: PromptMetric): Promise<void> {
    this.buffer.push(record);

    // Start flush timer if not already running
    if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flush(), this.flushIntervalMs);
    }

    // Flush immediately if batch size reached
    if (this.buffer.length >= this.batchSize) {
      await this.flush();
    }
  }

  async flush(): Promise<void> {
    // Clear timer
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    if (this.buffer.length === 0) return;

    // Take records from buffer
    const records = this.buffer;
    this.buffer = [];

    try {
      await this.client.sendBatch(records);
    } catch (error) {
      // On error, put records back in buffer for retry
      console.error("Failed to send batch:", error);
      this.buffer = records.concat(this.buffer);
      throw error;
    }
  }

  get bufferSize(): number {
    return this.buffer.length;
  }
}
