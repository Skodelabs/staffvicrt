"use client";

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface StudentApplication {
  _id: string;
  fullName: string;
  selectedCourse: string;
  preferredStudyCenter: string;
  appliedDate: string;
  status: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  nic?: string;
}

export default function StudentApplications() {
  const [applications, setApplications] = React.useState<StudentApplication[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(5);
  const [selectedApplication, setSelectedApplication] = React.useState<StudentApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        
        if (selectedStatus !== 'all') {
          queryParams.append('status', selectedStatus);
        }
        
        if (searchTerm) {
          queryParams.append('search', searchTerm);
        }
        
        const response = await fetch(`/api/students?${queryParams.toString()}`);
        const result = await response.json();
        
        if (result.success) {
          // Format dates for display
          const formattedData = result.data.map((student: any) => ({
            ...student,
            appliedDate: new Date(student.appliedDate).toISOString().split('T')[0]
          }));
          
          setApplications(formattedData);
        } else {
          setError('Failed to load applications');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('An error occurred while fetching applications');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [selectedStatus, searchTerm]);
  
  // Filter applications based on selected status and search term
  const filteredApplications = applications
    .filter(app => selectedStatus === "all" || app.status.toLowerCase() === selectedStatus)
    .filter(app => {
      const searchLower = searchTerm.toLowerCase();
      return (
        app.fullName.toLowerCase().includes(searchLower) ||
        app.selectedCourse.toLowerCase().includes(searchLower) ||
        app.preferredStudyCenter.toLowerCase().includes(searchLower)
      );
    });
    
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);
  
  // Function to update application status
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setApplications(applications.map(app => 
          app._id === id ? { ...app, status: newStatus } : app
        ));
        
        // If the updated application is currently selected, update it there too
        if (selectedApplication && selectedApplication._id === id) {
          setSelectedApplication({ ...selectedApplication, status: newStatus });
        }
      } else {
        console.error('Failed to update status:', result.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  // Function to open application details modal
  const openApplicationDetails = (application: StudentApplication) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };
  
  // Function to close application details modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };
  
  return (
    <div className="space-y-6">
      {/* Application Details Modal */}
      {isModalOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Application Details
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Student ID</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedApplication._id}</p>
                        </div>
                        <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Applied Course</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.selectedCourse}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Study Center</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.preferredStudyCenter}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Application Date</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.appliedDate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <p className="mt-1">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${selectedApplication.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                              selectedApplication.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}
                          >
                            {selectedApplication.status}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Additional mock data for the modal */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900">Contact Information</h4>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedApplication.email || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Phone</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedApplication.phoneNumber || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900">Application Notes</h4>
                      <p className="mt-2 text-sm text-gray-500">
                        This student has applied for the {selectedApplication.selectedCourse} program at {selectedApplication.preferredStudyCenter}. 
                        {selectedApplication.status === 'Pending' ? 'The application is pending review.' : 
                          selectedApplication.status === 'Approved' ? 'The application has been approved.' : 
                          'The application has been rejected.'}
                      </p>

                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900">Additional Information</h4>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">NIC</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedApplication.nic || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Address</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedApplication.address || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <Button 
                onClick={closeModal} 
                className="w-full sm:w-auto sm:ml-3"
              >
                Close
              </Button>
              {selectedApplication.status === 'Pending' && (
                <div className="mt-3 sm:mt-0 sm:mr-3 flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => updateStatus(selectedApplication._id, "Approved")}
                    className="w-full sm:w-auto"
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => updateStatus(selectedApplication._id, "Rejected")}
                    className="w-full sm:w-auto"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Applications</h1>
          <p className="text-gray-600">Manage and review student applications</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search input */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input 
              type="search" 
              className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Filter by status:</span>
            <select 
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Study Center</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    <div className="flex justify-center items-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Loading applications...</span>
                    </div>
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((application) => (
                  <tr 
                    key={application._id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => openApplicationDetails(application)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.selectedCourse}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.preferredStudyCenter}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.appliedDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${application.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                          application.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(application._id, "Approved");
                          }}
                          disabled={application.status === "Approved"}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(application._id, "Rejected");
                          }}
                          disabled={application.status === "Rejected"}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No applications found matching the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredApplications.length > 0 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredApplications.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredApplications.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
