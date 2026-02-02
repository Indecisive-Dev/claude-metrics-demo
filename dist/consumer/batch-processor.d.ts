import type { PromptMetric } from "../shared/types.js";
export declare class BatchProcessor {
    private buffer;
    private flushTimer;
    private readonly client;
    private readonly batchSize;
    private readonly flushIntervalMs;
    constructor();
    add(record: PromptMetric): Promise<void>;
    flush(): Promise<void>;
    get bufferSize(): number;
}
//# sourceMappingURL=batch-processor.d.ts.map