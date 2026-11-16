import app, { initApp } from '../server.js';

export default async function handler(req, res) {
  try {
    await initApp();
  } catch (err) {
    console.error('[DB Init Error in Catch-All]', err);
  }

  return app(req, res);
}
