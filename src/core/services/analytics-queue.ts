import { Repository, Click } from '../ports/repository';

export class AnalyticsQueue {
    private queue: Omit<Click, 'id' | 'createdAt'>[] = [];
    private repository: Repository;
    private batchSize: number = 10;
    private flushInterval: number = 5000; // 5 seconds

    constructor(repository: Repository) {
        this.repository = repository;
        this.startWorker();
    }

    public push(click: Omit<Click, 'id' | 'createdAt'>): void {
        this.queue.push(click);
        if (this.queue.length >= this.batchSize) {
            this.flush();
        }
    }

    private startWorker(): void {
        setInterval(() => {
            if (this.queue.length > 0) {
                this.flush();
            }
        }, this.flushInterval);
    }

    private async flush(): Promise<void> {
        const batch = this.queue.splice(0, this.batchSize);
        if (batch.length === 0) return;

        console.log(`Flushing ${batch.length} clicks to DB...`);

        // In a real system, we might want to do bulk insert.
        // For now, we'll loop (Prisma createMany is better but let's stick to interface)
        // Actually, let's just use Promise.all for concurrency
        try {
            await Promise.all(batch.map(click => this.repository.saveClick(click)));
            console.log('Flush complete.');
        } catch (error) {
            console.error('Failed to flush analytics:', error);
            // In real world, we might want to retry or DLQ
        }
    }
}
