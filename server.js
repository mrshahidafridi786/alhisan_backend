import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { config } from './config/config.js';
import { connectDB } from './config/db.js';
import contactRoutes from './routes/contactRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import { AdminUser } from './models/AdminUser.js';
import { SiteSetting } from './models/SiteSetting.js';
import { Product } from './models/Product.js';
import { Leadership } from './models/Leadership.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Let frontend assets load cleanly during development/production
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration (supporting all CRUD methods for admin)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parsing with limits (supporting rich payloads & base64)
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static directory for uploaded product and category images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Trust reverse proxy (for real client IP in rate limiting & logs)
app.set('trust proxy', 1);

// Mount API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// Root fallback
app.get('/', (req, res) => {
  res.json({
    name: 'Alhisan Trading Company API',
    location: 'Abu Dhabi, United Arab Emirates',
    version: '1.0.0',
    documentation: '/api/health',
    admin: '/api/admin',
  });
});

// Centralized error handler
app.use(errorHandler);

// Connect DB, seed defaults, and listen
let isConnected = false;
export const initApp = async () => {
  if (!isConnected) {
    await connectDB();
    try {
      await AdminUser.seedDefaultAdmin();
      await SiteSetting.getOrCreate();
      await Product.seedDefaultProducts();
      await Leadership.seedDefaultLeaders();
    } catch (seedErr) {
      console.warn('[Bootstrap] Seed check note:', seedErr.message);
    }
    isConnected = true;
  }
};

if (!process.env.VERCEL) {
  initApp().then(() => {
    app.listen(config.port, () => {
      console.log(`[Alhisan Server] Running on http://localhost:${config.port} in ${config.nodeEnv} mode`);
    });
  });
} else {
  initApp().catch((err) => console.error('[Vercel Serverless] DB connection error:', err));
}

export default app;
