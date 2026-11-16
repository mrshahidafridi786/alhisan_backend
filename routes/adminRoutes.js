import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  adminLogin,
  getAdminProfile,
  updateAdminPassword,
} from '../controllers/adminAuthController.js';
import {
  getDashboardStats,
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry,
  getSiteSettings,
  updateSiteSettings,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getLeaders,
  createLeader,
  updateLeader,
  deleteLeader,
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    const uniqueName = `${cleanBase || 'category'}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP, GIF, SVG) are allowed.'));
    }
  },
});

// Public Admin Auth
router.post('/login', adminLogin);

// Protected Admin Routes
router.use(protectAdmin);

// Image Upload Endpoint (Returns accessible image URL)
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file uploaded.' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: 'Category image uploaded successfully.',
    url: fileUrl,
    filename: req.file.filename,
  });
});

// Profile & Password
router.get('/profile', getAdminProfile);
router.put('/profile/password', updateAdminPassword);

// Dashboard
router.get('/stats', getDashboardStats);

// Inquiries & Quotes
router.get('/inquiries', getAllInquiries);
router.patch('/inquiries/:id/status', updateInquiryStatus);
router.delete('/inquiries/:id', deleteInquiry);

// Settings
router.get('/settings', getSiteSettings);
router.put('/settings', updateSiteSettings);

// Products
router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Leadership
router.get('/leadership', getLeaders);
router.post('/leadership', createLeader);
router.put('/leadership/:id', updateLeader);
router.delete('/leadership/:id', deleteLeader);

export default router;
