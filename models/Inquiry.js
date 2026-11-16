import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      maxlength: [120, 'Email address cannot exceed 120 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      maxlength: [30, 'Phone number cannot exceed 30 characters'],
    },
    companyName: {
      type: String,
      trim: true,
      maxlength: [120, 'Company name cannot exceed 120 characters'],
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    productInterest: {
      type: String,
      required: [true, 'Product interest is required'],
      enum: {
        values: ['Salt', 'Soda Ash', 'Calcium Carbonate', 'Food Products', 'Spices', 'Other'],
        message: '{VALUE} is not a valid product category',
      },
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
    },
    status: {
      type: String,
      enum: ['New', 'Reviewed', 'In Progress', 'Archived'],
      default: 'New',
    },
    source: {
      type: String,
      default: 'Website Contact Form',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
