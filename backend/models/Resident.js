const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema(
  {
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
    },
    flat: {
      type: String,
      required: [true, 'Flat number is required'],
      trim: true,
    },
    block: {
      type: String,
      required: [true, 'Block name is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Occupied', 'Vacant'],
      default: 'Occupied',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'No Dues'],
      default: 'Paid',
    },
    pendingAmount: {
      type: String,
      default: '',
    },
    ownerName: {
      type: String,
      required: [true, 'Owner name is required'],
      trim: true,
    },
    residentName: {
      type: String,
      required: [true, 'Resident name is required'],
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    isSelfOwner: {
      type: Boolean,
      default: false,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    moveInDate: {
      type: String,
      default: '',
    },
    documents: [
      {
        name: String,
        url: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resident', residentSchema);
