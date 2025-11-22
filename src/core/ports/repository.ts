export interface Link {
    id: bigint;
    originalUrl: string;
    shortCode: string;
    createdAt: Date;
    expiresAt: Date | null;
    userId: string | null;
}

export interface Click {
    id: bigint;
    linkId: bigint;
    createdAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
    country: string | null;
}

export interface Repository {
    saveLink(link: Link): Promise<void>;
    getLinkByShortCode(shortCode: string): Promise<Link | null>;
    saveClick(click: Omit<Click, 'id' | 'createdAt'>): Promise<void>;
}
