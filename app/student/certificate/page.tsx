"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectOption } from '@/components/ui/select';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { FileUpload } from '@/components/ui/file-upload';
import { useRouter } from 'next/navigation';

export default function CertificateUpload() {
  const [formData, setFormData] = useState({
    studentId: '',
    nic: '',
    certificateType: '',
    issuingInstitution: '',
    issueDate: '',
    certificateId: '',
    comments: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle file change
  const handleFileChange = (file: File | null) => {
    setFile(file);
  };

  const router = useRouter();
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.studentId || !formData.nic || !formData.certificateType || !file) {
      setSubmitError('Please fill in all required fields and upload a certificate');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // In a real application, you would upload the file to a storage service
      // and get a URL back. For now, we'll simulate this.
      const fileData = {
        ...formData,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      };
      
      // Send data to the API
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fileData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitSuccess(true);
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            studentId: '',
            nic: '',
            certificateType: '',
            issuingInstitution: '',
            issueDate: '',
            certificateId: '',
            comments: ''
          });
          setFile(null);
          setSubmitSuccess(false);
          router.push('/');
        }, 3000);
      } else {
        setSubmitError(result.message || 'Failed to upload certificate');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('An error occurred while uploading the certificate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Certificate Upload</h1>
        <p className="text-gray-600 mt-2">Upload your certificates for verification</p>
      </div>

      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Certificate uploaded successfully!</h3>
              <p className="mt-2 text-sm text-green-700">Your certificate has been uploaded and will be verified soon.</p>
            </div>
          </div>
        </div>
      )}
      
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      <Form onSubmit={handleSubmit} className="space-y-8">
        {/* Student Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField>
              <FormLabel>Student ID <span className="text-red-500">*</span></FormLabel>
              <Input 
                type="text" 
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                placeholder="Enter your student ID" 
                required
              />
            </FormField>
            <FormField>
              <FormLabel>NIC <span className="text-red-500">*</span></FormLabel>
              <Input 
                type="text" 
                name="nic"
                value={formData.nic}
                onChange={handleInputChange}
                placeholder="Enter your NIC number" 
                required
              />
            </FormField>
          </div>
        </div>

        {/* Certificate Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Certificate Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField>
              <FormLabel>Certificate Type <span className="text-red-500">*</span></FormLabel>
              <Select 
                name="certificateType"
                value={formData.certificateType}
                onChange={handleInputChange}
                required
              >
                <SelectOption value="">Select certificate type</SelectOption>
                <SelectOption value="academic">Academic Certificate</SelectOption>
                <SelectOption value="professional">Professional Certificate</SelectOption>
                <SelectOption value="language">Language Proficiency</SelectOption>
                <SelectOption value="other">Other</SelectOption>
              </Select>
            </FormField>
            <FormField>
              <FormLabel>Issuing Institution</FormLabel>
              <Input 
                type="text" 
                name="issuingInstitution"
                value={formData.issuingInstitution}
                onChange={handleInputChange}
                placeholder="Enter the issuing institution" 
              />
            </FormField>
            <FormField>
              <FormLabel>Issue Date</FormLabel>
              <Input 
                type="date" 
                name="issueDate"
                value={formData.issueDate}
                onChange={handleInputChange}
              />
            </FormField>
            <FormField>
              <FormLabel>Certificate ID/Reference</FormLabel>
              <Input 
                type="text" 
                name="certificateId"
                value={formData.certificateId}
                onChange={handleInputChange}
                placeholder="Enter certificate ID or reference number" 
              />
            </FormField>
          </div>
        </div>

        {/* Certificate Upload */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upload Certificate <span className="text-red-500">*</span></h2>
          <FileUpload 
            label="Upload your certificate"
            description="Accepted formats: PDF, JPG, PNG (Max size: 5MB)"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            value={file}
          />
          {file && (
            <p className="text-sm text-green-600">File selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
          )}
        </div>

        {/* Additional Comments */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Additional Comments</h2>
          <FormField>
            <FormLabel>Comments (Optional)</FormLabel>
            <textarea 
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              placeholder="Any additional information about your certificate"
            />
          </FormField>
        </div>

        <div className="pt-4 flex space-x-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => router.push('/')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !formData.studentId || !formData.nic || !formData.certificateType || !file}
          >
            {isSubmitting ? 'Uploading...' : 'Upload Certificate'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
