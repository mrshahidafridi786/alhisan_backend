import mongoose from 'mongoose';

const siteSettingSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'Alhisan General Trading Company',
    },
    city: {
      type: String,
      default: 'Abu Dhabi',
    },
    country: {
      type: String,
      default: 'United Arab Emirates',
    },
    primaryPhone: {
      type: String,
      default: '+971 50 237 7748',
    },
    landline: {
      type: String,
      default: '+971 2 874 1888',
    },
    whatsapp: {
      type: String,
      default: '+971 50 638 0515',
    },
    whatsappInternational: {
      type: String,
      default: '971506380515',
    },
    contactEmail: {
      type: String,
      default: 'info@alhisan.ae.com',
    },
    addressDetail: {
      type: String,
      default: 'Al Reem Island / Abu Dhabi Commercial District, Abu Dhabi, United Arab Emirates',
    },
    businessHours: {
      type: String,
      default: 'Sunday – Thursday: 8:00 AM – 6:00 PM (GST)',
    },
    announcementBanner: {
      active: { type: Boolean, default: false },
      text: { type: String, default: '' },
      link: { type: String, default: '' },
    },
    metaDescription: {
      type: String,
      default: 'Alhisan General Trading Company — Premier UAE B2B supplier of industrial salt, soda ash, calcium carbonate, spices and food commodities in Abu Dhabi.',
    },
  },
  {
    timestamps: true,
  }
);

siteSettingSchema.statics.getOrCreate = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
    console.log('[Settings] Default site settings initialized in MongoDB Atlas.');
  }
  return settings;
};

export const SiteSetting = mongoose.model('SiteSetting', siteSettingSchema);
