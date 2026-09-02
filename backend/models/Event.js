const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    time: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'event',
    },
    bgClass: {
      type: String,
      default: 'primaryContainer',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
