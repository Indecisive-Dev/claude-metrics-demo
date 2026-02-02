export interface PromptMetric {
  timestamp: string;           // ISO 8601: "2025-02-01T12:30:45.123Z"
  session_id: string;          // Claude Code session ID
  cwd: string;                 // Working directory
  permission_mode: string;     // e.g., "default", "plan"
  prompt: string;              // Full prompt text
  word_count: number;
  char_count: number;
  line_count: number;
  estimated_tokens: number;    // chars / 3.5 approximation
  hostname: string;
  username: string;
}

// Claude Code hook payload for UserPromptSubmit
export interface UserPromptSubmitPayload {
  hook_type: "UserPromptSubmit";
  session_id: string;
  prompt: string;
  cwd: string;
  permission_mode: string;
}
