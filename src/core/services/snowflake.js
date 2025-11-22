export class Snowflake {
    epoch;
    workerIdBits = 5n;
    datacenterIdBits = 5n;
    sequenceBits = 12n;
    maxWorkerId = -1n ^ (-1n << this.workerIdBits);
    maxDatacenterId = -1n ^ (-1n << this.datacenterIdBits);
    sequenceMask = -1n ^ (-1n << this.sequenceBits);
    workerIdShift = this.sequenceBits;
    datacenterIdShift = this.sequenceBits + this.workerIdBits;
    timestampLeftShift = this.sequenceBits + this.workerIdBits + this.datacenterIdBits;
    lastTimestamp = -1n;
    sequence = 0n;
    workerId;
    datacenterId;
    constructor(workerId, datacenterId, epoch = 1704067200000) {
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
    nextId() {
        let timestamp = this.timeGen();
        if (timestamp < this.lastTimestamp) {
            throw new Error(`Clock moved backwards. Refusing to generate id for ${this.lastTimestamp - timestamp} milliseconds`);
        }
        if (this.lastTimestamp === timestamp) {
            this.sequence = (this.sequence + 1n) & this.sequenceMask;
            if (this.sequence === 0n) {
                timestamp = this.tilNextMillis(this.lastTimestamp);
            }
        }
        else {
            this.sequence = 0n;
        }
        this.lastTimestamp = timestamp;
        return ((timestamp - this.epoch) << this.timestampLeftShift) |
            (this.datacenterId << this.datacenterIdShift) |
            (this.workerId << this.workerIdShift) |
            this.sequence;
    }
    tilNextMillis(lastTimestamp) {
        let timestamp = this.timeGen();
        while (timestamp <= lastTimestamp) {
            timestamp = this.timeGen();
        }
        return timestamp;
    }
    timeGen() {
        return BigInt(Date.now());
    }
}
//# sourceMappingURL=snowflake.js.map