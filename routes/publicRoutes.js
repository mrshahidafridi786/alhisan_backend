import express from 'express';
import { SiteSetting } from '../models/SiteSetting.js';
import { Product } from '../models/Product.js';
import { Leadership } from '../models/Leadership.js';

const router = express.Router();

// Get public site settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await SiteSetting.getOrCreate();
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Settings error:', error.message);
    res.json({ success: true, data: null });
  }
});

// Get public products catalog
router.get('/products', async (req, res) => {
  try {
    let products = await Product.find({ inStock: true }).sort({ order: 1 }).lean();
    if (!products || products.length === 0) {
      try { await Product.seedDefaultProducts(); } catch (e) {}
      products = await Product.find({ inStock: true }).sort({ order: 1 }).lean();
    }
    res.json({ success: true, data: products || [] });
  } catch (error) {
    console.error('Products error:', error.message);
    res.json({ success: true, data: [] });
  }
});

// Get public leadership team
router.get('/leadership', async (req, res) => {
  try {
    let leaders = await Leadership.find({ active: true }).sort({ order: 1 }).lean();
    if (!leaders || leaders.length === 0) {
      try { await Leadership.seedDefaultLeaders(); } catch (e) {}
      leaders = await Leadership.find({ active: true }).sort({ order: 1 }).lean();
    }
    res.json({ success: true, data: leaders || [] });
  } catch (error) {
    console.error('Leadership error:', error.message);
    res.json({ success: true, data: [] });
  }
});

export default router;
