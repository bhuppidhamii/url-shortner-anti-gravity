"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresRepository = void 0;
const client_1 = require("@prisma/client");
class PostgresRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async saveLink(link) {
        await this.prisma.link.create({
            data: {
                id: link.id,
                originalUrl: link.originalUrl,
                shortCode: link.shortCode,
                createdAt: link.createdAt,
                expiresAt: link.expiresAt,
                userId: link.userId,
            },
        });
    }
    async getLinkByShortCode(shortCode) {
        const link = await this.prisma.link.findUnique({
            where: { shortCode },
        });
        if (!link)
            return null;
        return {
            id: link.id,
            originalUrl: link.originalUrl,
            shortCode: link.shortCode,
            createdAt: link.createdAt,
            expiresAt: link.expiresAt,
            userId: link.userId,
        };
    }
    async saveClick(click) {
        await this.prisma.click.create({
            data: {
                linkId: click.linkId,
                ipAddress: click.ipAddress,
                userAgent: click.userAgent,
                country: click.country,
            },
        });
    }
}
exports.PostgresRepository = PostgresRepository;
