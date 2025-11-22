"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const postgres_1 = require("./adapters/storage/postgres");
const redis_1 = require("./adapters/storage/redis");
const shortener_1 = require("./core/services/shortener");
const controller_1 = require("./adapters/http/controller");
const analytics_queue_1 = require("./core/services/analytics-queue");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
// Dependency Injection
const repository = new postgres_1.PostgresRepository();
const cache = new redis_1.RedisCache();
const analyticsQueue = new analytics_queue_1.AnalyticsQueue(repository);
const service = new shortener_1.ShortenerService(repository, cache, analyticsQueue);
const controller = new controller_1.ShortenerController(service);
// Routes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.post('/shorten', (req, res) => controller.shorten(req, res));
app.get('/:code', (req, res) => controller.redirect(req, res));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
