import express from 'express';
import { getDbStatus } from '../config/db.js';
import { config } from '../config/config.js';

const router = express.Router();

router.get('/', (req, res) => {
  const dbStatus = getDbStatus();
  res.status(200).json({
    status: 'healthy',
    company: config.company.name,
    environment: config.nodeEnv,
    database: {
      connected: dbStatus.connected,
      readyState: dbStatus.readyState,
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
