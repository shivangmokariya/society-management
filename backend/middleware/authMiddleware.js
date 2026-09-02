const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(ApiError.unauthorized('Access denied. No token provided.'));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'calm_super_secret_jwt_key_2026_change_in_production'
    );
    req.user = decoded;
    next();
  } catch (err) {
    return next(ApiError.unauthorized('Invalid or expired authentication token'));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(`User role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this resource`)
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
