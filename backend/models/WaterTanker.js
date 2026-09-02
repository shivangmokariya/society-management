const mongoose = require('mongoose');

const waterTankerSchema = new mongoose.Schema(
  {
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
    },
    arrivalDate: {
      type: String,
      required: [true, 'Arrival date is required'],
    },
    capacity: {
      type: String,
      default: '10,000 Liters',
    },
    supplier: {
      type: String,
      default: 'Express Water Tankers',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WaterTanker', waterTankerSchema);
