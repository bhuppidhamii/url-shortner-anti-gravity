export class Snowflake {
    private readonly epoch: bigint;
    private readonly workerIdBits: bigint = 5n;
    private readonly datacenterIdBits: bigint = 5n;
    private readonly sequenceBits: bigint = 12n;

    private readonly maxWorkerId: bigint = -1n ^ (-1n << this.workerIdBits);
    private readonly maxDatacenterId: bigint = -1n ^ (-1n << this.datacenterIdBits);
    private readonly sequenceMask: bigint = -1n ^ (-1n << this.sequenceBits);

    private readonly workerIdShift: bigint = this.sequenceBits;
    private readonly datacenterIdShift: bigint = this.sequenceBits + this.workerIdBits;
    private readonly timestampLeftShift: bigint = this.sequenceBits + this.workerIdBits + this.datacenterIdBits;

    private lastTimestamp: bigint = -1n;
    private sequence: bigint = 0n;
    private readonly workerId: bigint;
    private readonly datacenterId: bigint;

    constructor(workerId: number, datacenterId: number, epoch: number = 1704067200000) { // Epoch: 2024-01-01
        this.workerId = BigInt(workerId);
        this.datacenterId = BigInt(datacenterId);
        this.epoch = BigInt(epoch);

        if (this.workerId > this.maxWorkerId || this.workerId < 0n) {
            throw new Error(`Worker ID must be between 0 and ${this.maxWorkerId}`);
        }
        if (this.datacenterId > this.maxDatacenterId || this.datacenterId < 0n) {
            throw new Error(`Datacenter ID must be between 0 and ${this.maxDatacenterId}`);
        }
    }

    public nextId(): bigint {
        let timestamp = this.timeGen();

        if (timestamp < this.lastTimestamp) {
            throw new Error(`Clock moved backwards. Refusing to generate id for ${this.lastTimestamp - timestamp} milliseconds`);
        }

        if (this.lastTimestamp === timestamp) {
            this.sequence = (this.sequence + 1n) & this.sequenceMask;
            if (this.sequence === 0n) {
                timestamp = this.tilNextMillis(this.lastTimestamp);
            }
        } else {
            this.sequence = 0n;
        }

        this.lastTimestamp = timestamp;

        return ((timestamp - this.epoch) << this.timestampLeftShift) |
            (this.datacenterId << this.datacenterIdShift) |
            (this.workerId << this.workerIdShift) |
            this.sequence;
    }

    private tilNextMillis(lastTimestamp: bigint): bigint {
        let timestamp = this.timeGen();
        while (timestamp <= lastTimestamp) {
            timestamp = this.timeGen();
        }
        return timestamp;
    }

    private timeGen(): bigint {
        return BigInt(Date.now());
    }
}
