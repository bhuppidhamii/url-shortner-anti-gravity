"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCache = void 0;
const redis_1 = require("redis");
class RedisCache {
    constructor() {
        this.client = (0, redis_1.createClient)({
            url: 'redis://localhost:6379',
        });
        this.client.on('error', (err) => console.error('Redis Client Error', err));
        this.client.connect().catch(console.error);
    }
    async set(key, value, ttlSeconds) {
        await this.client.set(key, value, { EX: ttlSeconds });
    }
    async get(key) {
        return await this.client.get(key);
    }
    async increment(key) {
        return await this.client.incr(key);
    }
    async expire(key, ttlSeconds) {
        await this.client.expire(key, ttlSeconds);
    }
}
exports.RedisCache = RedisCache;
