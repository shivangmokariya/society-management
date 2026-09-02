const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
    },
    title: {
      type: String,
      required: [true, 'Transaction title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Electricity', 'Maintenance', 'Plumbing', 'Security', 'Cleaning', 'Other'],
    },
    date: {
      type: String,
      required: true,
      default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    isCredit: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
