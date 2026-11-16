import express from 'express';
import { submitContact, getInquiries } from '../controllers/contactController.js';
import { validateContactInput } from '../middleware/validator.js';
import { contactRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', contactRateLimiter, validateContactInput, submitContact);
router.get('/', getInquiries);

export default router;
