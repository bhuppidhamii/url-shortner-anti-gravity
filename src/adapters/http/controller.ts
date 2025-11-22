import { Request, Response } from 'express';
import { ShortenerService } from '../../core/services/shortener';

export class ShortenerController {
    private service: ShortenerService;

    constructor(service: ShortenerService) {
        this.service = service;
    }

    async shorten(req: Request, res: Response): Promise<void> {
        try {
            const { url } = req.body;
            if (!url) {
                res.status(400).json({ error: 'URL is required' });
                return;
            }

            const shortCode = await this.service.shorten(url);
            const fullShortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;

            res.status(201).json({ shortCode, shortUrl: fullShortUrl });
        } catch (error) {
            console.error('Shorten error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async redirect(req: Request, res: Response): Promise<void> {
        try {
            const { code } = req.params;
            const ip = req.ip || req.socket.remoteAddress || 'unknown';
            const userAgent = req.get('User-Agent') || 'unknown';

            const originalUrl = await this.service.getOriginalUrl(code, ip, userAgent);

            if (originalUrl) {
                res.redirect(originalUrl);
            } else {
                res.status(404).send('URL not found');
            }
        } catch (error) {
            console.error('Redirect error:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}
