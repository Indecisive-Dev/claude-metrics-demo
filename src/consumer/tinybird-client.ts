import { TINYBIRD_CONFIG } from "../shared/config.js";
import type { PromptMetric } from "../shared/types.js";

export class TinybirdClient {
  private readonly host: string;
  private readonly token: string;
  private readonly datasource: string;

  constructor() {
    this.host = TINYBIRD_CONFIG.host;
    this.token = TINYBIRD_CONFIG.token;
    this.datasource = TINYBIRD_CONFIG.datasource;
  }

  async sendBatch(records: PromptMetric[]): Promise<void> {
    if (records.length === 0) return;

    // Convert to NDJSON format
    const ndjson = records.map((r) => JSON.stringify(r)).join("\n");

    const url = `${this.host}/v0/events?name=${this.datasource}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/x-ndjson",
      },
      body: ndjson,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Tinybird API error: ${response.status} - ${text}`);
    }

    const result = await response.json();
    console.log(`Sent ${records.length} records to Tinybird:`, result);
  }
}
