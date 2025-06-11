import mongoose, { Document, Schema } from 'mongoose';
import connectToDatabase from '@/utils/db';

// Connect to the database
connectToDatabase();

// Define interfaces for course structure
export interface ICourse extends Document {
  name: string;
  qualification: string;
  duration: string;
}

export interface ISubcategory extends Document {
  name: string;
  courses: ICourse[];
}

export interface ICategory extends Document {
  name: string;
  courses?: ICourse[];
  subcategories?: ISubcategory[];
}

// Define schemas
const CourseSchema = new Schema<ICourse>({
  name: { type: String, required: true },
  qualification: { type: String, required: true },
  duration: { type: String, required: true }
});

const SubcategorySchema = new Schema<ISubcategory>({
  name: { type: String, required: true },
  courses: [CourseSchema]
});

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  courses: [CourseSchema],
  subcategories: [SubcategorySchema]
});

// Create and export the model
export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
export const Subcategory = mongoose.models.Subcategory || mongoose.model<ISubcategory>('Subcategory', SubcategorySchema);
export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default { Course, Subcategory, Category };
