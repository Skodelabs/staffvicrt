// Seed script for courses data
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define schemas
const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qualification: { type: String, required: true },
  duration: { type: String, required: true }
});

const SubcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  courses: [CourseSchema]
});

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  courses: [CourseSchema],
  subcategories: [SubcategorySchema]
});

// Create models
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

// Sample courses data
const coursesData = {
  categories: [
    {
      name: "Information Technology",
      subcategories: [
        {
          name: "Software Development",
          courses: [
            {
              name: "Web Development",
              qualification: "High School Diploma",
              duration: "6 months"
            },
            {
              name: "Mobile App Development",
              qualification: "High School Diploma",
              duration: "8 months"
            },
            {
              name: "Full Stack Development",
              qualification: "Bachelor's Degree",
              duration: "12 months"
            }
          ]
        },
        {
          name: "Networking",
          courses: [
            {
              name: "Network Administration",
              qualification: "High School Diploma",
              duration: "6 months"
            },
            {
              name: "Cybersecurity",
              qualification: "Bachelor's Degree",
              duration: "12 months"
            }
          ]
        }
      ]
    },
    {
      name: "Business",
      courses: [
        {
          name: "Business Administration",
          qualification: "High School Diploma",
          duration: "12 months"
        },
        {
          name: "Marketing",
          qualification: "High School Diploma",
          duration: "6 months"
        },
        {
          name: "Accounting",
          qualification: "High School Diploma",
          duration: "12 months"
        }
      ]
    },
    {
      name: "Healthcare",
      courses: [
        {
          name: "Nursing Assistant",
          qualification: "High School Diploma",
          duration: "3 months"
        },
        {
          name: "Medical Records",
          qualification: "High School Diploma",
          duration: "6 months"
        }
      ]
    }
  ]
};

// Seed the database
async function seedCourses() {
  try {
    // Clear existing data
    await Category.deleteMany({});
    console.log('Cleared existing courses data');
    
    // Insert new data
    await Category.insertMany(coursesData.categories);
    console.log('Courses data seeded successfully');
    
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding courses data:', error);
    mongoose.disconnect();
  }
}

// Run the seed function
seedCourses();
