const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/User');
const ROLES = require('../config/roles');

async function createSuperAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');

    const existing = await User.findOne({ role: ROLES.SUPERADMIN });
    if (existing) {
      console.log('Super Admin already exists:', existing.email);
      process.exit(0);
    }

    const hashed = await bcrypt.hash('superadmin@123', 10);
    const u = new User({
      name: 'Super Admin',
      email: 'superadmin@gmail.com',
      password: hashed,
      role: ROLES.SUPERADMIN,
      phoneNo: '9714997676'
    });

    await u.save();
    console.log('SuperAdmin created');
    console.log('Email: superadmin@gmail.com  Password: superadmin@123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
}
createSuperAdmin();