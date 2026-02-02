import type { PromptMetric } from "../shared/types.js";
export declare class TinybirdClient {
    private readonly host;
    private readonly token;
    private readonly datasource;
    constructor();
    sendBatch(records: PromptMetric[]): Promise<void>;
}
//# sourceMappingURL=tinybird-client.d.ts.map