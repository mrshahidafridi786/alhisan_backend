import mongoose from 'mongoose';
import { config } from './config.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] MongoDB not reachable at ${config.mongodbUri}. Resilient fallback storage activated. (${error.message})`);
  }

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[Database] MongoDB disconnected.');
  });

  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    console.log('[Database] MongoDB reconnected.');
  });
};

export const getDbStatus = () => {
  return {
    connected: isConnected,
    readyState: mongoose.connection.readyState,
  };
};
