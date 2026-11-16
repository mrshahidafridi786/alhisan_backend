import { Inquiry } from '../models/Inquiry.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { Product } from '../models/Product.js';
import { Leadership } from '../models/Leadership.js';
import { getDbStatus } from '../config/db.js';

// ==========================================
// Dashboard Stats
// ==========================================
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalInquiries = await Inquiry.countDocuments();
    const newInquiries = await Inquiry.countDocuments({ status: 'New' });
    const inProgressInquiries = await Inquiry.countDocuments({ status: 'In Progress' });
    const closedInquiries = await Inquiry.countDocuments({ status: 'Closed' });
    const totalProducts = await Product.countDocuments();
    const totalLeaders = await Leadership.countDocuments();
    const dbStatus = getDbStatus();

    const recentInquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        stats: {
          totalInquiries,
          newInquiries,
          inProgressInquiries,
          closedInquiries,
          totalProducts,
          totalLeaders,
        },
        database: dbStatus,
        recentInquiries,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Inquiries Management
// ==========================================
export const getAllInquiries = async (req, res, next) => {
  try {
    const { status, search, category, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.productInterest = category;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Inquiry.countDocuments(query);

    res.json({
      success: true,
      count: inquiries.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['New', 'Contacted', 'In Progress', 'Closed', 'Spam'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry record not found.',
      });
    }

    res.json({
      success: true,
      message: `Inquiry status updated to ${status}.`,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry record not found.',
      });
    }

    res.json({
      success: true,
      message: 'Inquiry record deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Site Settings Management
// ==========================================
export const getSiteSettings = async (req, res, next) => {
  try {
    const settings = await SiteSetting.getOrCreate();
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSiteSettings = async (req, res, next) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = new SiteSetting(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();

    res.json({
      success: true,
      message: 'Site configuration updated successfully in MongoDB Atlas.',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Products Management
// ==========================================
export const getProducts = async (req, res, next) => {
  try {
    await Product.seedDefaultProducts();
    const products = await Product.find().sort({ order: 1, createdAt: 1 });
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, slug, category, shortDescription, fullDescription, gradePurity, packagingOptions, specifications } = req.body;
    
    if (!name || !slug || !category || !shortDescription) {
      return res.status(400).json({
        success: false,
        message: 'Name, slug, category, and short description are required.',
      });
    }

    const existing = await Product.findOne({ slug: slug.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Product with slug "${slug}" already exists.`,
      });
    }

    const product = await Product.create({
      ...req.body,
      slug: slug.toLowerCase().trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Leadership Management
// ==========================================
export const getLeaders = async (req, res, next) => {
  try {
    await Leadership.seedDefaultLeaders();
    const leaders = await Leadership.find().sort({ order: 1, createdAt: 1 });
    res.json({
      success: true,
      count: leaders.length,
      data: leaders,
    });
  } catch (error) {
    next(error);
  }
};

export const createLeader = async (req, res, next) => {
  try {
    const { name, role, bio, photoUrl } = req.body;
    if (!name || !role || !bio) {
      return res.status(400).json({
        success: false,
        message: 'Leader name, role, and bio are required.',
      });
    }

    const leader = await Leadership.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Executive leader profile added successfully.',
      data: leader,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLeader = async (req, res, next) => {
  try {
    const { id } = req.params;
    const leader = await Leadership.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!leader) {
      return res.status(404).json({
        success: false,
        message: 'Executive leader profile not found.',
      });
    }

    res.json({
      success: true,
      message: 'Leader profile updated successfully.',
      data: leader,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLeader = async (req, res, next) => {
  try {
    const { id } = req.params;
    const leader = await Leadership.findByIdAndDelete(id);

    if (!leader) {
      return res.status(404).json({
        success: false,
        message: 'Executive leader profile not found.',
      });
    }

    res.json({
      success: true,
      message: 'Leader profile deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
