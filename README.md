# Claude Metrics Demo

A usage tracking system for Claude Code that captures prompt metrics via hooks, streams data through S2, and provides analytics via Tinybird endpoints.

## Why This Architecture?

```
Claude Code → Hook → S2 Stream → Consumer → Tinybird
```

- **Hook → S2**: Fire-and-forget with 1s timeout ensures Claude Code is never blocked. S2 provides durable buffering if downstream services are slow.
- **S2 → Consumer**: Decouples capture speed from ingestion. Consumer batches records (100/5s) to reduce Tinybird API calls.
- **Consumer → Tinybird**: NDJSON batches are more efficient than individual inserts. Checkpointing enables resumption after restarts.

## Prerequisites

- [Bun](https://bun.sh) - Chosen over Node.js for faster startup (critical for hooks) and native TypeScript support
- [S2](https://s2.dev) account and stream
- [Tinybird](https://tinybird.co) account

## Quick Start

```bash
bun install
cp .env.example .env        # Add your S2 and Tinybird credentials
tb deploy                   # Deploy Tinybird schema and endpoints
./scripts/install-hook.sh   # Register hook with Claude Code (restart Claude Code after)
docker compose up -d        # Start consumer and dashboard
```

Open http://localhost:3000 for the dashboard.

## Commands

| Command | Description |
|---------|-------------|
| `bun run hook` | Run hook manually (reads JSON from stdin) |
| `bun run consumer` | Run consumer locally |
| `bun run dashboard` | Run dashboard locally (http://localhost:3000) |
| `bun run dev:consumer` | Consumer with watch mode |
| `bun run dev:dashboard` | Dashboard with watch mode |
| `docker compose up -d` | Run consumer + dashboard in Docker |
| `tb deploy` | Deploy Tinybird resources |

## Dashboard

The dashboard proxies Tinybird requests through a Bun backend to keep tokens server-side. Auto-refreshes every 15s with a pause button to avoid rate limits during debugging.

```bash
bun run dashboard                              # Local
docker compose up dashboard -d                 # Docker
DASHBOARD_PORT=3001 docker compose up dashboard -d  # Custom port
```

## Metrics Schema

| Field | Description |
|-------|-------------|
| `timestamp` | ISO 8601 timestamp |
| `session_id` | Claude Code session ID |
| `cwd` | Working directory |
| `permission_mode` | Permission mode (default, plan, etc.) |
| `prompt` | Full prompt text |
| `word_count`, `char_count`, `line_count` | Text metrics |
| `estimated_tokens` | Approximation using chars/3.5 (avoids API calls) |
| `hostname`, `username` | Machine identifiers |

## Tinybird Endpoints

| Endpoint | Description |
|----------|-------------|
| `prompts_per_day` | Daily prompt counts and unique sessions |
| `prompts_per_hour` | Hourly counts (last 7 days) |
| `avg_words_per_prompt` | Average words by day |
| `avg_chars_per_prompt` | Average chars by day |
| `avg_tokens_per_prompt` | Average tokens by day |

## CI/CD

Two workflows enable build time comparison between GitHub Actions and [Blacksmith](https://blacksmith.sh):

| Workflow | Runner | Why |
|----------|--------|-----|
| `build-github.yml` | `ubuntu-24.04` | Standard GitHub-hosted runner baseline |
| `build-blacksmith.yml` | `blacksmith-2vcpu-ubuntu-2204` | Optimized runners with built-in Docker layer caching |

Both build consumer and dashboard images in parallel, pushing to `ghcr.io/<owner>/claude-metrics-demo/{consumer,dashboard}`.

Blacksmith requires installing their [GitHub App](https://app.blacksmith.sh) first.

## Troubleshooting

**Quarantined rows in Tinybird:**
```bash
tb datasource quarantine prompt_metrics
```
The hook uses `"unknown"` as fallback for null/undefined fields to prevent schema mismatches.

**Consumer not processing:** Check S2 credentials and stream existence. View logs with `docker compose logs -f consumer`.

**Port 3000 in use:** Kill it with `lsof -ti:3000 | xargs kill -9` or use `DASHBOARD_PORT=3001`.
