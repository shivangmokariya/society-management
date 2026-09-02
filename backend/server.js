const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security and HTTP Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static assets from /public folder
app.use('/public', express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'CALM Backend API is healthy and running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', routes);

// 404 Handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot find route ${req.originalUrl} on this server`,
  });
});

// Central Error Handler Middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
  🚀 CALM Backend Server running in [${process.env.NODE_ENV || 'development'}] mode on port ${PORT}
  👉 API Base URL: http://localhost:${PORT}/api
  👉 Health Check: http://localhost:${PORT}/health
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = app;
