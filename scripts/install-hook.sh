#!/bin/bash

# Install Claude Code hook for metrics collection
# This script updates ~/.claude/settings.json to register the hook

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
HOOK_PATH="$PROJECT_DIR/src/hook/index.ts"
SETTINGS_FILE="$HOME/.claude/settings.json"

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "Error: bun is not installed. Install it from https://bun.sh"
    exit 1
fi

# Check if hook exists
if [ ! -f "$HOOK_PATH" ]; then
    echo "Error: Hook not found at $HOOK_PATH"
    exit 1
fi

# Create settings directory if needed
mkdir -p "$(dirname "$SETTINGS_FILE")"

# Check if settings file exists
if [ ! -f "$SETTINGS_FILE" ]; then
    echo "{}" > "$SETTINGS_FILE"
fi

# Create the hook configuration
HOOK_CONFIG=$(cat <<EOF
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "S2_ACCESS_TOKEN=\$S2_ACCESS_TOKEN S2_BASIN=\$S2_BASIN S2_STREAM=\$S2_STREAM bun run $HOOK_PATH",
            "timeout": 2000
          }
        ]
      }
    ]
  }
}
EOF
)

# Check if jq is available for JSON manipulation
if command -v jq &> /dev/null; then
    # Use jq to merge configurations
    CURRENT=$(cat "$SETTINGS_FILE")
    echo "$CURRENT" | jq --argjson new "$HOOK_CONFIG" '. * $new' > "$SETTINGS_FILE.tmp"
    mv "$SETTINGS_FILE.tmp" "$SETTINGS_FILE"
    echo "Hook installed successfully using jq."
else
    # Fallback: show manual instructions
    echo "jq not found. Please manually add the following to $SETTINGS_FILE:"
    echo ""
    echo "$HOOK_CONFIG"
    echo ""
    echo "Or install jq and run this script again: brew install jq"
    exit 1
fi

echo ""
echo "Hook configuration:"
echo "  Command: bun run $HOOK_PATH"
echo "  Timeout: 2000ms"
echo ""
echo "Make sure these environment variables are set in your shell:"
echo "  export S2_ACCESS_TOKEN=<your-token>"
echo "  export S2_BASIN=<your-basin>"
echo "  export S2_STREAM=<your-stream>"
echo ""
echo "Restart Claude Code for the hook to take effect."
