# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code usage tracking: hooks capture prompts → S2 buffers → consumer batches to Tinybird → dashboard visualizes.

## Commands

```bash
bun install                    # Install dependencies
bun run hook                   # Test hook (reads JSON from stdin)
bun run consumer               # Run consumer locally
bun run dashboard              # Run dashboard at http://localhost:3000
bun run dev:consumer           # Consumer with watch mode
bun run dev:dashboard          # Dashboard with watch mode
docker compose up -d           # Run both in Docker
tb deploy                      # Deploy Tinybird resources
./scripts/install-hook.sh      # Register hook in Claude Code settings
```

## Architecture

### Hook (`src/hook/`)
Claude Code `UserPromptSubmit` hook. Fire-and-forget to S2 with 1s timeout—must never block Claude Code, always exits 0. Uses `"unknown"` fallback for null fields to prevent Tinybird quarantine.

### Consumer (`src/consumer/`)
Reads S2 stream, batches to Tinybird (100 records / 5s). Checkpoints to `checkpoint.json` for crash recovery.

### Dashboard (`dashboard/`)
Bun server proxies Tinybird API (keeps tokens server-side). Chart.js frontend with 15s auto-refresh and pause control.

### Shared (`src/shared/`)
- `types.ts`: `PromptMetric` and `UserPromptSubmitPayload` interfaces
- `config.ts`: Env config (Bun auto-loads `.env`)

### Tinybird (`tinybird/`)
- `datasources/prompt_metrics.datasource`: Metrics schema
- `pipes/*.pipe`: Analytics endpoints

## Environment Variables

```bash
S2_ACCESS_TOKEN, S2_BASIN, S2_STREAM      # S2 stream config
TINYBIRD_HOST, TINYBIRD_TOKEN, TINYBIRD_DATASOURCE  # Tinybird API
DASHBOARD_PORT                             # Optional, defaults to 3000
```

## CI/CD

Two workflows for build time comparison:

| File | Runner | Purpose |
|------|--------|---------|
| `.github/workflows/build-github.yml` | `ubuntu-24.04` | GitHub Actions baseline |
| `.github/workflows/build-blacksmith.yml` | `blacksmith-2vcpu-ubuntu-2204` | Blacksmith optimized builds |

Both push to `ghcr.io/<owner>/claude-metrics-demo/{consumer,dashboard}`.

## Key Design Decisions

- **Bun over Node**: Faster cold start for hooks, native TypeScript
- **S2 buffer**: Decouples hook speed from Tinybird ingestion, provides durability
- **Token estimation (chars/3.5)**: Avoids API calls, good enough for analytics
- **Dashboard proxy**: Keeps Tinybird token server-side
- **"unknown" fallbacks**: Prevents null values from causing Tinybird quarantine

## Troubleshooting

- **Quarantined rows**: `tb datasource quarantine prompt_metrics`
- **Kill port 3000**: `lsof -ti:3000 | xargs kill -9`
