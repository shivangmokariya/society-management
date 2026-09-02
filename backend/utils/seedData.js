const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

// Load env vars
dotenv.config();

// Load Models
const User = require('../models/User');
const Society = require('../models/Society');
const Resident = require('../models/Resident');
const Transaction = require('../models/Transaction');
const Complaint = require('../models/Complaint');
const Asset = require('../models/Asset');
const WaterTank = require('../models/WaterTank');
const Event = require('../models/Event');
const MaintenancePayment = require('../models/MaintenancePayment');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Society.deleteMany();
    await Resident.deleteMany();
    await Transaction.deleteMany();
    await Complaint.deleteMany();
    await Asset.deleteMany();
    await WaterTank.deleteMany();
    await Event.deleteMany();
    await MaintenancePayment.deleteMany();

    console.log('Seeding Society metadata...');
    const society = await Society.create({
      name: 'Green View Society',
      secretaryName: 'Rajesh',
      secretaryFullName: 'Rajesh Patel',
      secretaryRole: 'Society Secretary',
      logoUrl: '/public/assets/logos/society_logo.jpg',
      loginCardLogoUrl: '/public/assets/logos/login_card_logo.jpg',
      profileAvatarUrl: '/public/assets/avatars/avatar_1.jpg',
      currentBalance: 1245000,
      detailedBalance: 1245200,
      balanceTrend: '+2.4% vs last month',
      monthlyIncome: 265000,
      monthlyIncomeTarget: 300000,
      financialProgressPercent: 90,
      monthlyExpenses: 82450,
      pendingDuesFlats: 12,
      totalInflow: 315000,
      totalOutflow: 133500,
      pendingApprovalsCount: 1,
      pendingApprovalItem: {
        title: 'New Fire Extinguishers',
        amount: '₹15,000',
      },
      attentionItems: [
        {
          title: 'Lift AMC expires in 12 days',
          sub: 'Review contract for Tower A & B',
          type: 'error',
          icon: 'elevator',
        },
        {
          title: '7 complaints pending',
          sub: '3 plumbing, 4 electrical issues',
          type: 'tertiary',
          icon: 'report_problem',
        },
        {
          title: 'Water tank cleaning due',
          sub: 'Scheduled in 5 days',
          type: 'secondary',
          icon: 'water_drop',
        },
      ],
      recentActivities: [
        { title: 'Pump repaired', time: '2 hours ago', active: true },
        { title: 'Electricity bill paid', time: 'Yesterday, 4:30 PM', active: false },
        { title: 'New tenant added (B-402)', time: 'Oct 12, 10:00 AM', active: false },
      ],
      waterLastCleaned: '12 Aug',
      waterNextDue: '15 Sep',
      staffAttendance: { presentCount: 12, totalCount: 14 },
    });

    console.log('Seeding Default Secretary User...');
    await User.create({
      fullName: 'Rajesh Patel',
      email: 'secretary@greenwood.com',
      phone: '+91 98200 12345',
      password: 'password123',
      role: 'Secretary',
      society: society._id,
      avatarUrl: '/public/assets/avatars/avatar_1.jpg',
    });

    console.log('Seeding Approved User shivang...');
    const gokuldham = await Society.create({
      name: 'gokuldham',
      secretaryName: 'shivang',
      secretaryFullName: 'shivang',
      secretaryRole: 'Society Secretary',
      logoUrl: '/public/assets/logos/society_logo.jpg',
      loginCardLogoUrl: '/public/assets/logos/login_card_logo.jpg',
      profileAvatarUrl: '/public/assets/avatars/avatar_1.jpg',
    });

    await User.create({
      fullName: 'shivang',
      email: 'shivangmokariya92173@gmail.com',
      phone: '7041293145',
      password: 'password123',
      role: 'Secretary',
      society: gokuldham._id,
      isVerified: true,
      avatarUrl: '/public/assets/avatars/avatar_1.jpg',
    });

    console.log('Seeding Residents...');
    const [res1, res2] = await Resident.create([
      {
        society: society._id,
        flat: 'A-302',
        block: 'Block A',
        status: 'Occupied',
        paymentStatus: 'Paid',
        ownerName: 'Rajesh Patel',
        residentName: 'Amit Shah',
        phone: '+91 98200 12345',
        avatarUrl: '/public/assets/avatars/avatar_1.jpg',
      },
      {
        society: society._id,
        flat: 'B-105',
        block: 'Block B',
        status: 'Occupied',
        paymentStatus: 'Pending',
        pendingAmount: '₹2,500 due',
        ownerName: 'Sunita Rao',
        residentName: 'Sunita Rao',
        isSelfOwner: true,
        phone: '+91 98330 67890',
        avatarUrl: '/public/assets/avatars/avatar_2.jpg',
      },
      {
        society: society._id,
        flat: 'C-401',
        block: 'Block C',
        status: 'Vacant',
        paymentStatus: 'No Dues',
        ownerName: 'Society Management',
        residentName: 'Available for rent',
        phone: '',
      },
    ]);

    console.log('Seeding Maintenance Payments...');
    await MaintenancePayment.create([
      {
        society: society._id,
        resident: res1._id,
        flat: 'A-302',
        payerName: 'Amit Shah',
        payerRole: 'Tenant',
        amount: 2500,
        paymentDate: '2026-08-03',
        dueDate: '2026-08-05',
        status: 'On Time',
        monthPeriod: 'August 2026',
        paymentMethod: 'UPI',
      },
      {
        society: society._id,
        resident: res1._id,
        flat: 'A-302',
        payerName: 'Amit Shah',
        payerRole: 'Tenant',
        amount: 2500,
        paymentDate: '2026-07-11',
        dueDate: '2026-07-05',
        status: 'Late',
        monthPeriod: 'July 2026',
        paymentMethod: 'Bank Transfer',
      },
      {
        society: society._id,
        resident: res2._id,
        flat: 'B-105',
        payerName: 'Sunita Rao',
        payerRole: 'Owner',
        amount: 2500,
        paymentDate: '2026-07-04',
        dueDate: '2026-07-05',
        status: 'On Time',
        monthPeriod: 'July 2026',
        paymentMethod: 'UPI',
      },
    ]);

    console.log('Seeding Transactions...');
    await Transaction.create([
      {
        society: society._id,
        title: 'Electricity Bill Paid',
        category: 'Electricity',
        date: 'Today, 10:24 AM',
        amount: 18500,
        isCredit: false,
      },
      {
        society: society._id,
        title: 'Maintenance A-302',
        category: 'Maintenance',
        date: 'Yesterday',
        amount: 4500,
        isCredit: true,
      },
      {
        society: society._id,
        title: 'Plumbing Repair',
        category: 'Plumbing',
        date: 'Oct 12',
        amount: 2200,
        isCredit: false,
      },
    ]);

    console.log('Seeding Complaints...');
    await Complaint.create([
      {
        society: society._id,
        title: 'Water leakage A-302',
        category: 'Plumbing',
        flat: 'A-302',
        timeAgo: 'Reported 2h ago',
        status: 'In Progress',
      },
      {
        society: society._id,
        title: 'Lift noise B-wing',
        category: 'Electrical',
        flat: 'B-wing',
        timeAgo: 'Reported 5h ago',
        status: 'Open',
      },
    ]);

    console.log('Seeding Assets...');
    await Asset.create([
      { society: society._id, name: 'Generator', status: 'Active', icon: 'bolt' },
      { society: society._id, name: 'CCTVs (24)', status: 'Active', icon: 'videocam' },
      { society: society._id, name: 'Lift 1 (A-wing)', status: 'Service Due', icon: 'elevator' },
    ]);

    console.log('Seeding Water Tanks...');
    await WaterTank.create([
      { society: society._id, name: 'Tank 1', levelPercent: 85, color: '#879fbf' },
      { society: society._id, name: 'Tank 2', levelPercent: 40, color: '#48607d' },
    ]);

    console.log('Seeding Events...');
    await Event.create([
      {
        society: society._id,
        title: 'Committee Mtg.',
        time: 'Tomorrow, 7 PM',
        icon: 'groups',
        bgClass: 'primaryContainer',
      },
      {
        society: society._id,
        title: 'Navratri Event',
        time: 'Oct 15 - Oct 23',
        icon: 'celebration',
        bgClass: 'secondaryContainer',
      },
    ]);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
