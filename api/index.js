import app, { initApp } from '../server.js';

export default async function handler(req, res) {
  try {
    await initApp();
  } catch (err) {
    console.error('[DB Init Error]', err);
  }

  return app(req, res);
}
