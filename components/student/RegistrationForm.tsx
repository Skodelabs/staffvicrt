"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectOption } from '@/components/ui/select';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';

type Course = {
  id: number;
  name: string;
  qualification: string;
  duration: string;
};

type Subcategory = {
  name: string;
  courses: Course[];
};

type Category = {
  name: string;
  courses?: Course[];
  subcategories?: Subcategory[];
};

type CoursesData = {
  categories: Category[];
};

type RegistrationFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function RegistrationForm({ onSuccess, onCancel }: RegistrationFormProps) {
  const [coursesData, setCoursesData] = useState<CoursesData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    address: '',
    phoneNumber: '',
    email: '',
    nic: '',
    middleSchoolResults: '',
    highSchoolResults: '',
    certifications: '',
    preferredStudyCenter: ''
  });
  
  // Load courses data from API
  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const response = await fetch('/api/courses');
        const result = await response.json();
        if (result.success) {
          setCoursesData(result.data);
        } else {
          console.error('Failed to load courses:', result.message);
        }
      } catch (error) {
        console.error('Error loading courses data:', error);
      }
    };
    
    fetchCoursesData();
  }, []);
  
  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryName = e.target.value;
    setSelectedCategory(categoryName);
    setSelectedSubcategory('');
    setSelectedCourse('');
    setAvailableCourses([]);
    
    if (categoryName && coursesData) {
      const category = coursesData.categories.find(cat => cat.name === categoryName);
      if (category?.courses) {
        // If category has direct courses
        setAvailableCourses(category.courses);
      }
    }
  };
  
  // Handle subcategory change
  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subcategoryName = e.target.value;
    setSelectedSubcategory(subcategoryName);
    setSelectedCourse('');
    
    if (subcategoryName && coursesData && selectedCategory) {
      const category = coursesData.categories.find(cat => cat.name === selectedCategory);
      if (category?.subcategories) {
        const subcategory = category.subcategories.find(sub => sub.name === subcategoryName);
        if (subcategory) {
          setAvailableCourses(subcategory.courses);
        }
      }
    }
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          selectedCategory,
          selectedSubcategory,
          selectedCourse
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          fullName: '',
          dateOfBirth: '',
          address: '',
          phoneNumber: '',
          email: '',
          nic: '',
          middleSchoolResults: '',
          highSchoolResults: '',
          certifications: '',
          preferredStudyCenter: ''
        });
        setSelectedCategory('');
        setSelectedSubcategory('');
        setSelectedCourse('');
        setAvailableCourses([]);
        
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      } else {
        setSubmitError(result.message || 'Failed to submit registration');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('An error occurred while submitting your registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-6">
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-4">
          Registration submitted successfully! We will contact you soon.
        </div>
      )}
      
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
          {submitError}
        </div>
      )}
      
      {/* Personal Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField>
            <FormLabel>Full Name</FormLabel>
            <Input 
              required 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleInputChange} 
              placeholder="Enter your full name" 
            />
          </FormField>
          
          <FormField>
            <FormLabel>Date of Birth</FormLabel>
            <Input 
              required 
              type="date" 
              name="dateOfBirth" 
              value={formData.dateOfBirth} 
              onChange={handleInputChange} 
            />
          </FormField>
          
          <FormField>
            <FormLabel>Address</FormLabel>
            <Input 
              required 
              name="address" 
              value={formData.address} 
              onChange={handleInputChange} 
              placeholder="Enter your address" 
            />
          </FormField>
          
          <FormField>
            <FormLabel>Phone Number</FormLabel>
            <Input 
              required 
              name="phoneNumber" 
              value={formData.phoneNumber} 
              onChange={handleInputChange} 
              placeholder="Enter your phone number" 
            />
          </FormField>
          
          <FormField>
            <FormLabel>Email</FormLabel>
            <Input 
              required 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              placeholder="Enter your email" 
            />
          </FormField>
          
          <FormField>
            <FormLabel>NIC</FormLabel>
            <Input 
              required 
              name="nic" 
              value={formData.nic} 
              onChange={handleInputChange} 
              placeholder="Enter your NIC" 
            />
          </FormField>
        </div>
      </div>

      {/* Educational Background */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Educational Background</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField>
            <FormLabel>Middle School Results</FormLabel>
            <Input 
              required 
              name="middleSchoolResults" 
              value={formData.middleSchoolResults} 
              onChange={handleInputChange} 
              placeholder="Enter your middle school results" 
            />
          </FormField>
          
          <FormField>
            <FormLabel>High School Results</FormLabel>
            <Input 
              required 
              name="highSchoolResults" 
              value={formData.highSchoolResults} 
              onChange={handleInputChange} 
              placeholder="Enter your high school results" 
            />
          </FormField>
          
          <FormField className="md:col-span-2">
            <FormLabel>Certifications (Optional)</FormLabel>
            <Input 
              name="certifications"
              value={formData.certifications}
              onChange={handleInputChange}
              placeholder="Enter any certifications you have" 
            />
          </FormField>
        </div>
      </div>

      {/* Course Selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Course Selection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField>
            <FormLabel>Course Category</FormLabel>
            <Select onChange={handleCategoryChange} value={selectedCategory}>
              <SelectOption value="">Select a category</SelectOption>
              {coursesData?.categories.map((category, index) => (
                <SelectOption key={index} value={category.name}>
                  {category.name}
                </SelectOption>
              ))}
            </Select>
          </FormField>
          
          {selectedCategory && coursesData?.categories.find(cat => cat.name === selectedCategory)?.subcategories && (
            <FormField>
              <FormLabel>Subcategory</FormLabel>
              <Select onChange={handleSubcategoryChange} value={selectedSubcategory}>
                <SelectOption value="">Select a subcategory</SelectOption>
                {coursesData?.categories
                  .find(cat => cat.name === selectedCategory)
                  ?.subcategories?.map((subcategory, index) => (
                    <SelectOption key={index} value={subcategory.name}>
                      {subcategory.name}
                    </SelectOption>
                  ))}
              </Select>
            </FormField>
          )}
          
          <FormField>
            <FormLabel>Course</FormLabel>
            <Select 
              onChange={(e) => setSelectedCourse(e.target.value)}
              value={selectedCourse}
              disabled={availableCourses.length === 0}
            >
              <SelectOption value="">Select a course</SelectOption>
              {availableCourses.map((course) => (
                <SelectOption key={course.id} value={course.name}>
                  {course.name} ({course.duration})
                </SelectOption>
              ))}
            </Select>
            {selectedCourse && (
              <FormDescription>
                Qualification required: {availableCourses.find(c => c.name === selectedCourse)?.qualification}
              </FormDescription>
            )}
          </FormField>
          
          <FormField>
            <FormLabel>Preferred Study Center</FormLabel>
            <Select 
              onChange={(e) => setFormData({...formData, preferredStudyCenter: e.target.value})}
              value={formData.preferredStudyCenter}
            >
              <SelectOption value="">Select a study center</SelectOption>
              <SelectOption value="Main Campus">Main Campus</SelectOption>
              <SelectOption value="City Center">City Center</SelectOption>
              <SelectOption value="North Branch">North Branch</SelectOption>
              <SelectOption value="South Branch">South Branch</SelectOption>
            </Select>
          </FormField>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        {onCancel && (
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isSubmitting || !formData.fullName || !formData.dateOfBirth || !selectedCourse || !formData.preferredStudyCenter}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Registration'}
        </Button>
      </div>
    </Form>
  );
}
