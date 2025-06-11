import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Staff from '../models/Staff';

// MongoDB connection string from .env
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://office:Manoj%4020020226@skodelabs.rgn0tzx.mongodb.net/avicrt?retryWrites=true&w=majority&appName=skodelabs';

async function seedStaff() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URL);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await Staff.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    // Create a hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create admin user
    const adminUser = new Staff({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding staff:', error);
    process.exit(1);
  }
}

// Run the seed function
seedStaff();
