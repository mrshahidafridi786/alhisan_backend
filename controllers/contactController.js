import { Inquiry } from '../models/Inquiry.js';
import { getDbStatus } from '../config/db.js';
import { saveInquiryFallback, getInquiriesFallback } from '../utils/storageFallback.js';

export const submitContact = async (req, res, next) => {
  try {
    const data = req.sanitizedData;
    let createdInquiry;
    const dbStatus = getDbStatus();

    if (dbStatus.connected) {
      try {
        createdInquiry = await Inquiry.create(data);
      } catch (dbError) {
        console.warn('[ContactController] Direct Mongo write failed, using fallback storage:', dbError.message);
        createdInquiry = saveInquiryFallback(data);
      }
    } else {
      // Resilient fallback storage
      createdInquiry = saveInquiryFallback(data);
    }

    if (!createdInquiry) {
      return res.status(500).json({
        success: false,
        message: 'Could not process your inquiry at this moment. Please reach out via telephone or WhatsApp.',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to Alhisan Trading Company. Your inquiry has been registered, and our trading desk in Abu Dhabi will respond shortly.',
      inquiryId: createdInquiry._id,
      timestamp: createdInquiry.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

export const getInquiries = async (req, res, next) => {
  try {
    const dbStatus = getDbStatus();
    let inquiries = [];

    if (dbStatus.connected) {
      try {
        inquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(50).lean();
      } catch (err) {
        inquiries = getInquiriesFallback();
      }
    } else {
      inquiries = getInquiriesFallback();
    }

    return res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
      dbStatus,
    });
  } catch (error) {
    next(error);
  }
};
