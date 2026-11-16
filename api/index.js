import app, { initApp } from '../server.js';

export default async function handler(req, res) {
  try {
    await initApp();
  } catch (err) {
    console.error('[DB Init Error]', err);
  }

  // Restore original URL if Vercel internal rewrite changed it to destination
  const forwardedPath = req.headers['x-matched-path'] || req.headers['x-forwarded-uri'];
  if (forwardedPath && (req.url === '/api/index.js' || req.url === '/api')) {
    req.url = forwardedPath;
  }

  return app(req, res);
}
