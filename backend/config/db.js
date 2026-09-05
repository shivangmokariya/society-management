const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/calm_db', {
      serverSelectionTimeoutMS: 8000,
    });
    logger.info(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`[MongoDB Connection Error]: ${error.message}`, error);
    // Process exit on fatal DB failure during initial boot if strict, or fallback for offline dev
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
