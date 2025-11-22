"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortenerService = void 0;
const snowflake_1 = require("./snowflake");
const base62_1 = require("./base62");
class ShortenerService {
    constructor(repository, cache, analyticsQueue) {
        this.snowflake = new snowflake_1.Snowflake(1, 1); // Worker 1, DC 1
        this.repository = repository;
        this.cache = cache;
        this.analyticsQueue = analyticsQueue;
    }
    async shorten(originalUrl, userId) {
        const id = this.snowflake.nextId();
        const shortCode = base62_1.Base62.encode(id);
        const link = {
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
    async getOriginalUrl(shortCode, ipAddress, userAgent) {
        let originalUrl = null;
        let linkId = null;
        // 1. Check Cache
        const cachedUrl = await this.cache.get(shortCode);
        if (cachedUrl) {
            originalUrl = cachedUrl;
            // We need linkId for analytics.
            // Optimization: Cache linkId too, or just look it up?
            // For now, let's look up linkId from DB if not in cache (or maybe encode it in cache value?)
            // To keep it simple and fast, we might skip linkId if we don't have it, OR we fetch it.
            // Actually, Snowflake ID is sort of time-based, but we can't reverse shortCode to ID without decoding.
            linkId = base62_1.Base62.decode(shortCode);
        }
        else {
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
exports.ShortenerService = ShortenerService;
