export declare class Snowflake {
    private readonly epoch;
    private readonly workerIdBits;
    private readonly datacenterIdBits;
    private readonly sequenceBits;
    private readonly maxWorkerId;
    private readonly maxDatacenterId;
    private readonly sequenceMask;
    private readonly workerIdShift;
    private readonly datacenterIdShift;
    private readonly timestampLeftShift;
    private lastTimestamp;
    private sequence;
    private readonly workerId;
    private readonly datacenterId;
    constructor(workerId: number, datacenterId: number, epoch?: number);
    nextId(): bigint;
    private tilNextMillis;
    private timeGen;
}
//# sourceMappingURL=snowflake.d.ts.map