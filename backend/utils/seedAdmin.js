const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminEmail = 'shivangmokariya.dev@gmail.com';
    let admin = await User.findOne({ email: adminEmail }).select('+password');

    if (!admin) {
      admin = new User({
        fullName: 'Shivang Mokariya (Admin)',
        email: adminEmail,
        password: 'Admin@gmail.com',
        phone: '9876543210',
        role: 'Admin',
        isVerified: true,
        avatarUrl: '/public/assets/avatars/avatar_1.jpg',
      });
      await admin.save();
      console.log('✅ Default Admin user created: shivangmokariya.dev@gmail.com');
    } else {
      // Ensure password matches Admin@gmail.com
      const isMatch = await admin.matchPassword('Admin@gmail.com');
      let needsSave = false;
      if (!isMatch) {
        admin.password = 'Admin@gmail.com';
        needsSave = true;
      }
      if (admin.role !== 'Admin') {
        admin.role = 'Admin';
        needsSave = true;
      }
      if (needsSave) {
        await admin.save();
        console.log('✅ Default Admin user password/role updated to Admin@gmail.com');
      } else {
        console.log('ℹ️ Admin user already up to date:', adminEmail);
      }
    }
  } catch (error) {
    console.error('❌ Error seeding default Admin user:', error.message);
  }
};

module.exports = seedAdmin;
