// Seed script for creating an initial admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string from .env
const MONGODB_URL = 'mongodb+srv://office:Manoj%4020020226@skodelabs.rgn0tzx.mongodb.net/avicrt?retryWrites=true&w=majority&appName=skodelabs';

// Define the Staff schema
const StaffSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'staff'],
    default: 'staff',
  },
}, {
  timestamps: true,
});

// Create the Staff model
const Staff = mongoose.model('Staff', StaffSchema);

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
