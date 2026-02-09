import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './core/middleware/error-handler.js';
import { productRoutes } from './modules/products/product.routes.js';
import { ownerRoutes } from './modules/owners/owner.routes.js';
import { uploadRoutes } from './modules/upload/upload.routes.js';
import { statsRoutes } from './modules/stats/stats.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/products', productRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);

app.use(errorHandler);

export { app };
