const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'r5udui8l',
  api_key: process.env.CLOUDINARY_API_KEY || '194156356459311',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'TcGphILHzPubvh8Hht85Yi5Tiec',
});

module.exports = cloudinary;
