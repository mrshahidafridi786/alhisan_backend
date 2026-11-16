import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = process.env.VERCEL
  ? path.join('/tmp', 'data')
  : path.resolve(__dirname, '../data');
const inquiriesFile = path.join(dataDir, 'inquiries.json');

// Ensure directory exists
try {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
} catch (dirErr) {
  console.warn('[Fallback Storage Dir]', dirErr.message);
}

export const saveInquiryFallback = (data) => {
  try {
    let inquiries = [];
    if (fs.existsSync(inquiriesFile)) {
      const raw = fs.readFileSync(inquiriesFile, 'utf8');
      inquiries = raw ? JSON.parse(raw) : [];
    }
    const newEntry = {
      _id: 'fb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
      ...data,
      status: 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fallbackStore: true,
    };
    inquiries.unshift(newEntry);
    fs.writeFileSync(inquiriesFile, JSON.stringify(inquiries, null, 2), 'utf8');
    return newEntry;
  } catch (err) {
    console.error('[FallbackStorage] Error writing inquiry to local file:', err);
    return null;
  }
};

export const getInquiriesFallback = () => {
  try {
    if (!fs.existsSync(inquiriesFile)) return [];
    const raw = fs.readFileSync(inquiriesFile, 'utf8');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('[FallbackStorage] Error reading inquiries from local file:', err);
    return [];
  }
};
