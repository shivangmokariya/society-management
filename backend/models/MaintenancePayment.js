const mongoose = require('mongoose');

const maintenancePaymentSchema = new mongoose.Schema(
  {
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
    },
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resident',
      required: true,
    },
    flat: {
      type: String,
      required: true,
    },
    payerName: {
      type: String,
      required: true,
    },
    payerRole: {
      type: String,
      enum: ['Owner', 'Tenant'],
      default: 'Owner',
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['On Time', 'Late', 'Pending'],
      default: 'On Time',
    },
    monthPeriod: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: 'UPI',
    },
    transactionId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MaintenancePayment', maintenancePaymentSchema);
