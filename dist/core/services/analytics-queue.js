"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsQueue = void 0;
class AnalyticsQueue {
    constructor(repository) {
        this.queue = [];
        this.batchSize = 10;
        this.flushInterval = 5000; // 5 seconds
        this.repository = repository;
        this.startWorker();
    }
    push(click) {
        this.queue.push(click);
        if (this.queue.length >= this.batchSize) {
            this.flush();
        }
    }
    startWorker() {
        setInterval(() => {
            if (this.queue.length > 0) {
                this.flush();
            }
        }, this.flushInterval);
    }
    async flush() {
        const batch = this.queue.splice(0, this.batchSize);
        if (batch.length === 0)
            return;
        console.log(`Flushing ${batch.length} clicks to DB...`);
        // In a real system, we might want to do bulk insert.
        // For now, we'll loop (Prisma createMany is better but let's stick to interface)
        // Actually, let's just use Promise.all for concurrency
        try {
            await Promise.all(batch.map(click => this.repository.saveClick(click)));
            console.log('Flush complete.');
        }
        catch (error) {
            console.error('Failed to flush analytics:', error);
            // In real world, we might want to retry or DLQ
        }
    }
}
exports.AnalyticsQueue = AnalyticsQueue;
