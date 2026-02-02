import { S2 } from "@s2-dev/streamstore";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { S2_CONFIG, CONSUMER_CONFIG } from "../shared/config.js";
import type { PromptMetric } from "../shared/types.js";
import { BatchProcessor } from "./batch-processor.js";

interface Checkpoint {
  seqNum: number;
  timestamp: string;
}

function loadCheckpoint(): Checkpoint | null {
  try {
    if (existsSync(CONSUMER_CONFIG.checkpointFile)) {
      const data = readFileSync(CONSUMER_CONFIG.checkpointFile, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to load checkpoint:", error);
  }
  return null;
}

function saveCheckpoint(seqNum: number): void {
  const checkpoint: Checkpoint = {
    seqNum,
    timestamp: new Date().toISOString(),
  };
  try {
    writeFileSync(CONSUMER_CONFIG.checkpointFile, JSON.stringify(checkpoint, null, 2));
  } catch (error) {
    console.error("Failed to save checkpoint:", error);
  }
}

async function main(): Promise<void> {
  console.log("Starting S2 consumer...");
  console.log(`Basin: ${S2_CONFIG.basin}`);
  console.log(`Stream: ${S2_CONFIG.stream}`);

  const s2 = new S2({ accessToken: S2_CONFIG.accessToken });
  const stream = s2.basin(S2_CONFIG.basin).stream(S2_CONFIG.stream);

  const processor = new BatchProcessor();

  // Load last checkpoint
  const checkpoint = loadCheckpoint();
  const startSeqNum = checkpoint ? checkpoint.seqNum + 1 : 0;
  console.log(`Starting from sequence number: ${startSeqNum}`);

  // Open read session with continuous waiting
  const session = await stream.readSession({
    start: { from: { seqNum: startSeqNum }, clamp: true },
    stop: { waitSecs: 30 }, // Wait up to 30s for new records
  });

  let lastSeqNum = startSeqNum - 1;
  let recordCount = 0;

  console.log("Reading from stream...");

  try {
    for await (const record of session) {
      try {
        const metric: PromptMetric = JSON.parse(record.body);
        await processor.add(metric);
        lastSeqNum = record.seqNum;
        recordCount++;

        // Checkpoint every 10 records
        if (recordCount % 10 === 0) {
          await processor.flush();
          saveCheckpoint(lastSeqNum);
          console.log(`Processed ${recordCount} records, checkpointed at seqNum ${lastSeqNum}`);
        }
      } catch (parseError) {
        console.error(`Failed to parse record ${record.seqNum}:`, parseError);
        // Continue to next record
      }
    }
  } catch (error) {
    console.error("Error reading from stream:", error);
  } finally {
    // Final flush and checkpoint
    await processor.flush();
    if (lastSeqNum >= startSeqNum) {
      saveCheckpoint(lastSeqNum);
      console.log(`Final checkpoint at seqNum ${lastSeqNum}`);
    }
  }

  console.log(`Consumer finished. Processed ${recordCount} records total.`);

  // In production, we'd want to restart the read session to continue consuming
  // For now, just restart the whole process
  console.log("Restarting consumer in 5 seconds...");
  setTimeout(() => main(), 5000);
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("Received SIGINT, shutting down...");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, shutting down...");
  process.exit(0);
});

main().catch((error) => {
  console.error("Consumer failed:", error);
  process.exit(1);
});
