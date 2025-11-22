import express from 'express';
import dotenv from 'dotenv';
import { PostgresRepository } from './adapters/storage/postgres';
import { RedisCache } from './adapters/storage/redis';
import { ShortenerService } from './core/services/shortener';
import { ShortenerController } from './adapters/http/controller';
import { AnalyticsQueue } from './core/services/analytics-queue';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Dependency Injection
const repository = new PostgresRepository();
const cache = new RedisCache();
const analyticsQueue = new AnalyticsQueue(repository);
const service = new ShortenerService(repository, cache, analyticsQueue);
const controller = new ShortenerController(service);

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/shorten', (req, res) => controller.shorten(req, res));
app.get('/:code', (req, res) => controller.redirect(req, res));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
