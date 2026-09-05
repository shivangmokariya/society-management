const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = 'mongodb+srv://akashvekariya010:ljed3sGHZU7T0mpi@cluster0.qn2fyjc.mongodb.net/calm';

const secretaryRegistrationSchema = new mongoose.Schema(
  {
    fullName: String,
    societyName: String,
    email: String,
    phone: String,
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    password: String,
    role: String,
    society: mongoose.Schema.Types.ObjectId,
    isVerified: Boolean,
    avatarUrl: String,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const societySchema = new mongoose.Schema(
  {
    name: String,
    secretaryName: String,
    secretaryFullName: String,
    secretaryRole: String,
    logoUrl: String,
    loginCardLogoUrl: String,
    profileAvatarUrl: String,
  },
  { timestamps: true }
);

const SecretaryRegistration = mongoose.model('SecretaryRegistration', secretaryRegistrationSchema);
const User = mongoose.model('User', userSchema);
const Society = mongoose.model('Society', societySchema);

async function run() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('Connected!');

    // Find the latest pending registration
    const pendingReg = await SecretaryRegistration.findOne({ status: 'Pending' }).sort({ createdAt: -1 });

    if (!pendingReg) {
      console.log('No pending secretary registration request found.');
      const allRegs = await SecretaryRegistration.find({}).sort({ createdAt: -1 });
      console.log('All registrations in DB:', JSON.stringify(allRegs, null, 2));
      await mongoose.disconnect();
      return;
    }

    console.log('Found Pending Registration Request:');
    console.log(JSON.stringify(pendingReg, null, 2));

    const firstName = pendingReg.fullName.trim().split(' ')[0];
    const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    const phoneDigits = pendingReg.phone.replace(/\D/g, '');
    const phoneSuffix = phoneDigits.slice(-4) || '1234';
    
    // Generated password format: Firstname@Last4DigitsOfPhone (e.g. Shivang@3145)
    const generatedPassword = `${capitalizedFirstName}@${phoneSuffix}`;

    // 1. Create or Find Society
    let society = await Society.findOne({ name: pendingReg.societyName });
    if (!society) {
      society = await Society.create({
        name: pendingReg.societyName,
        secretaryName: firstName,
        secretaryFullName: pendingReg.fullName,
        secretaryRole: 'Society Secretary',
        logoUrl: '/public/assets/logos/society_logo.jpg',
        loginCardLogoUrl: '/public/assets/logos/login_card_logo.jpg',
        profileAvatarUrl: '/public/assets/avatars/avatar_1.jpg',
      });
      console.log('Created new Society document:', society._id);
    } else {
      console.log('Found existing Society document:', society._id);
    }

    // 2. Create or Update User document
    let user = await User.findOne({ email: pendingReg.email.toLowerCase().trim() });
    if (!user) {
      user = new User({
        fullName: pendingReg.fullName,
        email: pendingReg.email.toLowerCase().trim(),
        phone: pendingReg.phone,
        password: generatedPassword,
        role: 'Secretary',
        society: society._id,
        isVerified: true,
        avatarUrl: '/public/assets/avatars/avatar_1.jpg',
      });
      await user.save();
      console.log('Created new Secretary User:', user._id);
    } else {
      user.society = society._id;
      user.role = 'Secretary';
      user.isVerified = true;
      user.password = generatedPassword;
      await user.save();
      console.log('Updated existing User to Secretary with new password:', user._id);
    }

    // 3. Update SecretaryRegistration status to 'Approved'
    pendingReg.status = 'Approved';
    await pendingReg.save();
    console.log('Updated Registration Request status to Approved!');

    console.log('=== APPROVAL_RESULT_START ===');
    console.log(JSON.stringify({
      registrationId: pendingReg._id,
      fullName: pendingReg.fullName,
      societyName: pendingReg.societyName,
      email: pendingReg.email,
      phone: pendingReg.phone,
      generatedPassword: generatedPassword,
      status: pendingReg.status,
      societyId: society._id,
      userId: user._id
    }, null, 2));
    console.log('=== APPROVAL_RESULT_END ===');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error running script:', error);
    process.exit(1);
  }
}

run();
