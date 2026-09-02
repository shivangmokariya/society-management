const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Plumbing', 'Electrical', 'Security', 'General'],
      default: 'General',
    },
    flat: {
      type: String,
      required: true,
      trim: true,
    },
    timeAgo: {
      type: String,
      default: 'Reported just now',
    },
    status: {
      type: String,
      enum: ['In Progress', 'Open', 'Resolved'],
      default: 'Open',
    },
    reportedBy: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
