"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snowflake = void 0;
class Snowflake {
    constructor(workerId, datacenterId, epoch = 1704067200000) {
        this.workerIdBits = 5n;
        this.datacenterIdBits = 5n;
        this.sequenceBits = 12n;
        this.maxWorkerId = -1n ^ (-1n << this.workerIdBits);
        this.maxDatacenterId = -1n ^ (-1n << this.datacenterIdBits);
        this.sequenceMask = -1n ^ (-1n << this.sequenceBits);
        this.workerIdShift = this.sequenceBits;
        this.datacenterIdShift = this.sequenceBits + this.workerIdBits;
        this.timestampLeftShift = this.sequenceBits + this.workerIdBits + this.datacenterIdBits;
        this.lastTimestamp = -1n;
        this.sequence = 0n;
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
exports.Snowflake = Snowflake;
