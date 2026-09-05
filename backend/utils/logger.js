const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../application.log');

/**
 * Format log entry with ISO timestamp and level badge
 */
const formatMessage = (level, message, meta = '') => {
  const timestamp = new Date().toISOString();
  let metaStr = '';
  
  if (meta instanceof Error) {
    metaStr = `\nStack Trace:\n${meta.stack}`;
  } else if (typeof meta === 'object' && meta !== null && Object.keys(meta).length > 0) {
    try {
      metaStr = ` | Meta: ${JSON.stringify(meta)}`;
    } catch (e) {
      metaStr = ` | Meta: ${meta}`;
    }
  } else if (meta) {
    metaStr = ` | ${meta}`;
  }

  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}\n`;
};

/**
 * Write log entry to console and append to backend/application.log
 */
const writeLog = (level, message, meta) => {
  const formatted = formatMessage(level, message, meta);
  
  // Output to stdout / stderr console
  if (level === 'error') {
    console.error(formatted.trim());
  } else if (level === 'warn') {
    console.warn(formatted.trim());
  } else {
    console.log(formatted.trim());
  }

  // Append entry to application.log
  fs.appendFile(logFilePath, formatted, (err) => {
    if (err) {
      console.error('❌ Failed to write to application.log:', err.message);
    }
  });
};

const logger = {
  info: (message, meta) => writeLog('info', message, meta),
  error: (message, meta) => writeLog('error', message, meta),
  warn: (message, meta) => writeLog('warn', message, meta),
  debug: (message, meta) => writeLog('debug', message, meta),
  // Stream interface for Morgan HTTP logger middleware (console output only)
  stream: {
    write: (message) => {
      console.log(message.trim());
    },
  },
};

module.exports = logger;
