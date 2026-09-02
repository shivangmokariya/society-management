const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
    },
    name: {
      type: String,
      required: [true, 'Asset name is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Service Due', 'Inactive'],
      default: 'Active',
    },
    icon: {
      type: String,
      default: 'devices',
    },
    lastServicedDate: {
      type: Date,
    },
    nextServiceDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Asset', assetSchema);
