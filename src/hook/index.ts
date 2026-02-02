#!/usr/bin/env node
import { S2, AppendInput, AppendRecord } from "@s2-dev/streamstore";
import { hostname, userInfo } from "os";
import type { PromptMetric, UserPromptSubmitPayload } from "../shared/types.js";
import { countWords, countChars, countLines, estimateTokens } from "./metrics.js";

// Load env vars directly (avoid dotenv overhead in hook)
const S2_ACCESS_TOKEN = process.env.S2_ACCESS_TOKEN || "";
const S2_BASIN = process.env.S2_BASIN || "claude-metrics";
const S2_STREAM = process.env.S2_STREAM || "prompts";

async function sendToS2(metric: PromptMetric): Promise<void> {
  const s2 = new S2({ accessToken: S2_ACCESS_TOKEN });
  const stream = s2.basin(S2_BASIN).stream(S2_STREAM);

  const input = AppendInput.create([
    AppendRecord.string({
      body: JSON.stringify(metric),
      headers: [["content-type", "application/json"]],
    }),
  ]);

  await stream.append(input);
}

async function main(): Promise<void> {
  // Read JSON payload from stdin
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  if (!input.trim()) {
    process.exit(0);
  }

  let payload: UserPromptSubmitPayload;
  try {
    payload = JSON.parse(input);
  } catch {
    // Invalid JSON, exit silently
    process.exit(0);
  }

  // Build metric record with safe fallbacks
  const promptText = payload.prompt ?? "";
  const metric: PromptMetric = {
    timestamp: new Date().toISOString(),
    session_id: payload.session_id ?? "unknown",
    cwd: payload.cwd ?? "unknown",
    permission_mode: payload.permission_mode ?? "unknown",
    prompt: promptText,
    word_count: countWords(promptText),
    char_count: countChars(promptText),
    line_count: countLines(promptText),
    estimated_tokens: estimateTokens(promptText),
    hostname: hostname() ?? "unknown",
    username: userInfo().username ?? "unknown",
  };

  // Fire-and-forget with 1s timeout
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, 1000));

  try {
    await Promise.race([sendToS2(metric), timeout]);
  } catch {
    // Silently ignore errors - never block Claude Code
  }
}

main().then(() => process.exit(0)).catch(() => process.exit(0));
