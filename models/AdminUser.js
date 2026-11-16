import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'Alhisan Administrator',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'manager'],
      default: 'superadmin',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify password
adminUserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Static helper to seed default admin if none exists
adminUserSchema.statics.seedDefaultAdmin = async function () {
  const count = await this.countDocuments();
  if (count === 0) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Alhisanwebsite@1122', salt);
    await this.create({
      name: 'Marwan Afridi',
      email: 'marwanafridi098@gmail.com',
      password: hashedPassword,
      role: 'superadmin',
    });
    console.log('[Security] Default Admin created (marwanafridi098@gmail.com)');
  }
};

export const AdminUser = mongoose.model('AdminUser', adminUserSchema);
