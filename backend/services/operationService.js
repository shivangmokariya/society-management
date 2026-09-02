const Complaint = require('../models/Complaint');
const Asset = require('../models/Asset');
const WaterTank = require('../models/WaterTank');
const WaterTanker = require('../models/WaterTanker');
const Society = require('../models/Society');
const ApiError = require('../utils/apiError');

class OperationService {
  // Complaints
  async getComplaints({ category, status, search }) {
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { flat: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    return await Complaint.find(filter).sort({ createdAt: -1 });
  }

  async createComplaint(data) {
    const { title, category, flat, reportedBy, description } = data;
    const defaultSociety = await Society.findOne();

    return await Complaint.create({
      society: defaultSociety ? defaultSociety._id : undefined,
      title,
      category: category || 'General',
      flat: flat || 'Common Area',
      reportedBy: reportedBy || 'Resident',
      description: description || '',
      status: 'Open',
      timeAgo: 'Reported just now',
    });
  }

  async updateComplaintStatus(id, status) {
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!complaint) {
      throw ApiError.notFound('Complaint not found');
    }
    return complaint;
  }

  // Assets
  async getAssets() {
    return await Asset.find().sort({ name: 1 });
  }

  async createAsset(data) {
    const defaultSociety = await Society.findOne();
    return await Asset.create({
      society: defaultSociety ? defaultSociety._id : undefined,
      ...data,
    });
  }

  async updateAsset(id, data) {
    const asset = await Asset.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!asset) {
      throw ApiError.notFound('Asset not found');
    }
    return asset;
  }

  // Water Tanks
  async getWaterTanks() {
    const tanks = await WaterTank.find();
    const society = await Society.findOne();
    return {
      tanks,
      waterLastCleaned: society ? society.waterLastCleaned : '12 Aug',
      waterNextDue: society ? society.waterNextDue : '15 Sep',
    };
  }

  async updateWaterTank(id, data) {
    const tank = await WaterTank.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!tank) {
      throw ApiError.notFound('Water tank not found');
    }
    return tank;
  }

  async recordTanker(data) {
    const { arrivalDate, capacity, supplier, notes } = data;
    const defaultSociety = await Society.findOne();

    const log = await WaterTanker.create({
      society: defaultSociety ? defaultSociety._id : undefined,
      arrivalDate: arrivalDate || new Date().toISOString().split('T')[0],
      capacity: capacity || '10,000 Liters',
      supplier: supplier || 'Express Water Tankers',
      notes: notes || '',
    });

    if (defaultSociety && arrivalDate) {
      defaultSociety.waterLastCleaned = arrivalDate;
      await defaultSociety.save();
    }

    return log;
  }
}

module.exports = new OperationService();
