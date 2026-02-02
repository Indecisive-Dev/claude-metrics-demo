export function countWords(text) {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}
export function countChars(text) {
    return text.length;
}
export function countLines(text) {
    if (text.length === 0)
        return 0;
    return text.split("\n").length;
}
export function estimateTokens(text) {
    // Approximation: ~3.5 characters per token on average
    return Math.ceil(text.length / 3.5);
}
//# sourceMappingURL=metrics.js.map