export interface PromptMetric {
    timestamp: string;
    session_id: string;
    cwd: string;
    permission_mode: string;
    prompt: string;
    word_count: number;
    char_count: number;
    line_count: number;
    estimated_tokens: number;
    hostname: string;
    username: string;
}
export interface UserPromptSubmitPayload {
    hook_type: "UserPromptSubmit";
    session_id: string;
    prompt: string;
    cwd: string;
    permission_mode: string;
}
//# sourceMappingURL=types.d.ts.map