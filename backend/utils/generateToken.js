const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      societyId: user.society,
    },
    process.env.JWT_SECRET || 'calm_super_secret_jwt_key_2026_change_in_production',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

module.exports = generateToken;
