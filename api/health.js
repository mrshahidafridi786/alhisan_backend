import { getDbStatus, connectDB } from '../config/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
  } catch (err) {
    console.warn('[Vercel Health DB]', err.message);
  }

  const dbStatus = getDbStatus();
  return res.status(200).json({
    status: 'healthy',
    company: 'Alhisan General Trading Company',
    location: 'Abu Dhabi, United Arab Emirates',
    environment: process.env.NODE_ENV || 'production',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
}
