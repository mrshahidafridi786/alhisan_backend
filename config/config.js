import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alhisan',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  jwtSecret: process.env.JWT_SECRET || 'alhisan_executive_jwt_secret_key_2026_abudhabi_uae',
  company: {
    name: 'Alhisan',
    legalName: 'Alhisan Trading Company',
    location: 'Abu Dhabi, United Arab Emirates',
    phone: '+971502377748',
    whatsapp: '+9710506380515',
    whatsappFormatted: '+971506380515',
    landline: '+97128741888',
    email: 'info@alhisan.ae.com',
    website: 'https://alhisan.com',
  }
};
