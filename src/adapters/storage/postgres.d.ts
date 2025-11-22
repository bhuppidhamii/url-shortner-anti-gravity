import { Repository, Link, Click } from '../../core/ports/repository';
export declare class PostgresRepository implements Repository {
    private prisma;
    constructor();
    saveLink(link: Link): Promise<void>;
    getLinkByShortCode(shortCode: string): Promise<Link | null>;
    saveClick(click: Omit<Click, 'id' | 'createdAt'>): Promise<void>;
}
//# sourceMappingURL=postgres.d.ts.map