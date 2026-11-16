import express from 'express';
import { SiteSetting } from '../models/SiteSetting.js';
import { Product } from '../models/Product.js';
import { Leadership } from '../models/Leadership.js';

const router = express.Router();

// Get public site settings
router.get('/settings', async (req, res, next) => {
  try {
    const settings = await SiteSetting.getOrCreate();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
});

// Get public products catalog
router.get('/products', async (req, res, next) => {
  try {
    const products = await Product.find({ inStock: true }).sort({ order: 1 });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

// Get public leadership team
router.get('/leadership', async (req, res, next) => {
  try {
    const leaders = await Leadership.find({ active: true }).sort({ order: 1 });
    res.json({ success: true, data: leaders });
  } catch (error) {
    next(error);
  }
});

export default router;
