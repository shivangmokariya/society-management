const Resident = require('../models/Resident');
const Society = require('../models/Society');
const ApiError = require('../utils/apiError');

class ResidentService {
  async getResidents({ societyId, search, block, status, paymentStatus }) {
    const filter = {};

    if (societyId) {
      filter.society = societyId;
    }

    if (block) {
      filter.block = block;
    }

    if (status) {
      filter.status = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (search) {
      filter.$or = [
        { flat: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { residentName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    return await Resident.find(filter).sort({ flat: 1 });
  }

  async getResidentById(id) {
    const resident = await Resident.findById(id);
    if (!resident) {
      throw ApiError.notFound('Resident entry not found');
    }
    return resident;
  }

  async addOwner(data) {
    const { fullName, phone, flatNumber, email, documents } = data;

    // Check if flat already exists
    const existing = await Resident.findOne({ flat: flatNumber });
    if (existing) {
      // Update owner info if flat exists
      existing.ownerName = fullName;
      existing.phone = phone || existing.phone;
      existing.email = email || existing.email;
      if (documents) existing.documents = documents;
      await existing.save();
      return existing;
    }

    // Determine default block from flat name (e.g. A-302 -> Block A)
    const blockLetter = flatNumber.includes('-') ? flatNumber.split('-')[0] : 'A';
    const defaultSociety = await Society.findOne();

    const resident = await Resident.create({
      society: defaultSociety ? defaultSociety._id : undefined,
      flat: flatNumber,
      block: `Block ${blockLetter.toUpperCase()}`,
      status: 'Occupied',
      paymentStatus: 'No Dues',
      ownerName: fullName,
      residentName: fullName,
      phone,
      email,
      isSelfOwner: true,
      documents: documents || [],
    });

    return resident;
  }

  async addTenant(data) {
    const { fullName, phone, flatAssignment, moveInDate, documents } = data;

    // flatAssignment format could be "A-101 (Owner: R. Kapoor)" or "A-101"
    const flatNumber = flatAssignment.split(' ')[0];

    let resident = await Resident.findOne({ flat: flatNumber });

    if (resident) {
      resident.residentName = fullName;
      resident.phone = phone || resident.phone;
      resident.status = 'Occupied';
      resident.isSelfOwner = false;
      resident.moveInDate = moveInDate;
      if (documents) resident.documents = documents;
      await resident.save();
    } else {
      const blockLetter = flatNumber.includes('-') ? flatNumber.split('-')[0] : 'A';
      const defaultSociety = await Society.findOne();

      resident = await Resident.create({
        society: defaultSociety ? defaultSociety._id : undefined,
        flat: flatNumber,
        block: `Block ${blockLetter.toUpperCase()}`,
        status: 'Occupied',
        paymentStatus: 'No Dues',
        ownerName: 'Property Owner',
        residentName: fullName,
        phone,
        isSelfOwner: false,
        moveInDate,
        documents: documents || [],
      });
    }

    return resident;
  }

  async updateResident(id, updateData) {
    const resident = await Resident.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!resident) {
      throw ApiError.notFound('Resident not found');
    }
    return resident;
  }

  async deleteResident(id) {
    const resident = await Resident.findByIdAndDelete(id);
    if (!resident) {
      throw ApiError.notFound('Resident not found');
    }
    return resident;
  }
}

module.exports = new ResidentService();
