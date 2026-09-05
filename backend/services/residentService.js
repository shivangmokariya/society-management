const Resident = require('../models/Resident');
const Society = require('../models/Society');
const ApiError = require('../utils/apiError');

class ResidentService {
  async getResidents({ societyId, search, block, status, paymentStatus }) {
    const filter = {};

    if (societyId) {
      const mongoose = require('mongoose');
      let targetSoc = null;
      if (mongoose.Types.ObjectId.isValid(societyId)) {
        targetSoc = await Society.findById(societyId);
      }
      if (!targetSoc && mongoose.Types.ObjectId.isValid(societyId)) {
        const SecretaryRegistration = require('../models/SecretaryRegistration');
        const reg = await SecretaryRegistration.findById(societyId);
        if (reg) {
          targetSoc = await Society.findOne({ name: reg.societyName });
        }
      }
      if (!targetSoc) {
        targetSoc = await Society.findOne({ name: societyId });
      }

      let societyIds = [];
      if (targetSoc) {
        const baseName = targetSoc.name.toLowerCase().replace(/\s+society$/i, '').trim();
        const related = await Society.find({
          name: { $regex: new RegExp(`^${baseName}`, 'i') }
        });
        societyIds = related.map((s) => s._id);
        if (!societyIds.some((id) => id.toString() === targetSoc._id.toString())) {
          societyIds.push(targetSoc._id);
        }
      } else if (mongoose.Types.ObjectId.isValid(societyId)) {
        societyIds.push(new mongoose.Types.ObjectId(societyId));
      }

      if (societyIds.length > 0) {
        filter.$or = [
          { society: { $in: societyIds } },
          { society: { $exists: false } },
          { society: null },
        ];
      }
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
      const searchOr = [
        { flat: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { residentName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];

      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchOr }];
        delete filter.$or;
      } else {
        filter.$or = searchOr;
      }
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
    const { fullName, phone, flatNumber, email, documents, societyId, society } = data;
    const mongoose = require('mongoose');

    let targetSociety = null;
    const socInput = societyId || society;
    if (socInput) {
      if (mongoose.Types.ObjectId.isValid(socInput)) {
        targetSociety = await Society.findById(socInput);
      }
      if (!targetSociety && mongoose.Types.ObjectId.isValid(socInput)) {
        const SecretaryRegistration = require('../models/SecretaryRegistration');
        const reg = await SecretaryRegistration.findById(socInput);
        if (reg) {
          targetSociety = await Society.findOne({ name: reg.societyName });
        }
      }
      if (!targetSociety) {
        targetSociety = await Society.findOne({ name: socInput });
      }
    }
    if (!targetSociety) {
      targetSociety = await Society.findOne();
    }

    const targetSocietyId = targetSociety ? targetSociety._id : undefined;

    // Check if flat already exists for this society
    const query = { flat: flatNumber };
    if (targetSocietyId) query.society = targetSocietyId;

    let existing = await Resident.findOne(query);
    if (existing) {
      existing.ownerName = fullName;
      existing.phone = phone || existing.phone;
      existing.email = email || existing.email;
      if (documents) existing.documents = documents;
      await existing.save();
      return existing;
    }

    // Determine default block from flat name (e.g. A-302 -> Block A)
    const blockLetter = flatNumber.includes('-') ? flatNumber.split('-')[0] : 'A';

    const resident = await Resident.create({
      society: targetSocietyId,
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
    const { fullName, phone, flatAssignment, moveInDate, documents, societyId, society } = data;
    const mongoose = require('mongoose');

    let targetSociety = null;
    const socInput = societyId || society;
    if (socInput) {
      if (mongoose.Types.ObjectId.isValid(socInput)) {
        targetSociety = await Society.findById(socInput);
      }
      if (!targetSociety && mongoose.Types.ObjectId.isValid(socInput)) {
        const SecretaryRegistration = require('../models/SecretaryRegistration');
        const reg = await SecretaryRegistration.findById(socInput);
        if (reg) {
          targetSociety = await Society.findOne({ name: reg.societyName });
        }
      }
      if (!targetSociety) {
        targetSociety = await Society.findOne({ name: socInput });
      }
    }
    if (!targetSociety) {
      targetSociety = await Society.findOne();
    }

    const targetSocietyId = targetSociety ? targetSociety._id : undefined;
    const flatNumber = flatAssignment ? flatAssignment.split(' ')[0] : 'A-101';

    const query = { flat: flatNumber };
    if (targetSocietyId) query.society = targetSocietyId;

    let resident = await Resident.findOne(query);

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

      resident = await Resident.create({
        society: targetSocietyId,
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
