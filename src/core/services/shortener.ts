import { Snowflake } from './snowflake';
import { Base62 } from './base62';
import { Repository, Link } from '../ports/repository';
import { RedisCache } from '../../adapters/storage/redis';
import { AnalyticsQueue } from './analytics-queue';

export class ShortenerService {
    private snowflake: Snowflake;
    private repository: Repository;
    private cache: RedisCache;
    private analyticsQueue: AnalyticsQueue;

    constructor(repository: Repository, cache: RedisCache, analyticsQueue: AnalyticsQueue) {
        this.snowflake = new Snowflake(1, 1); // Worker 1, DC 1
        this.repository = repository;
        this.cache = cache;
        this.analyticsQueue = analyticsQueue;
    }

    async shorten(originalUrl: string, userId?: string): Promise<string> {
        const id = this.snowflake.nextId();
        const shortCode = Base62.encode(id);

        const link: Link = {
            id,
            originalUrl,
            shortCode,
            createdAt: new Date(),
            expiresAt: null,
            userId: userId || null,
        };

        // Store in DB
        await this.repository.saveLink(link);

        // Cache the result
        await this.cache.set(shortCode, originalUrl, 3600 * 24); // 24 hours TTL

        return shortCode;
    }

    async getOriginalUrl(shortCode: string, ipAddress?: string, userAgent?: string): Promise<string | null> {
        let originalUrl: string | null = null;
        let linkId: bigint | null = null;

        // 1. Check Cache
        const cachedUrl = await this.cache.get(shortCode);
        if (cachedUrl) {
            originalUrl = cachedUrl;
            // We need linkId for analytics.
            // Optimization: Cache linkId too, or just look it up?
            // For now, let's look up linkId from DB if not in cache (or maybe encode it in cache value?)
            // To keep it simple and fast, we might skip linkId if we don't have it, OR we fetch it.
            // Actually, Snowflake ID is sort of time-based, but we can't reverse shortCode to ID without decoding.
            linkId = Base62.decode(shortCode);
        } else {
            // 2. Check DB
            const link = await this.repository.getLinkByShortCode(shortCode);
            if (link) {
                originalUrl = link.originalUrl;
                linkId = link.id;
                // 3. Populate Cache
                await this.cache.set(shortCode, link.originalUrl, 3600 * 24);
            }
        }

        if (originalUrl && linkId) {
            // Async Analytics
            this.analyticsQueue.push({
                linkId,
                ipAddress: ipAddress || null,
                userAgent: userAgent || null,
                country: null, // GeoIP lookup would go here
            });
        }

        return originalUrl;
    }
}
