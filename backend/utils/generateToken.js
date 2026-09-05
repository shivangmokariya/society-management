const jwt = require('jsonwebtoken');

const generateToken = (user, expiresIn = '7d') => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      societyId: user.society,
    },
    process.env.JWT_SECRET || 'calm_super_secret_jwt_key_2026_change_in_production',
    {
      expiresIn: expiresIn || '7d',
    }
  );
};

module.exports = generateToken;
