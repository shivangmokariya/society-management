const mongoose = require('mongoose');

const waterTankSchema = new mongoose.Schema(
  {
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
    },
    name: {
      type: String,
      required: [true, 'Tank name is required'],
      trim: true,
    },
    levelPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 50,
    },
    color: {
      type: String,
      default: '#48607d',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WaterTank', waterTankSchema);
