import { createClient, RedisClientType } from 'redis';

export class RedisCache {
    private client: RedisClientType;

    constructor() {
        this.client = createClient({
            url: 'redis://localhost:6379',
        });

        this.client.on('error', (err) => console.error('Redis Client Error', err));

        this.client.connect().catch(console.error);
    }

    async set(key: string, value: string, ttlSeconds: number): Promise<void> {
        await this.client.set(key, value, { EX: ttlSeconds });
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async increment(key: string): Promise<number> {
        return await this.client.incr(key);
    }

    async expire(key: string, ttlSeconds: number): Promise<void> {
        await this.client.expire(key, ttlSeconds);
    }
}
