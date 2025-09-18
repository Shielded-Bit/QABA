'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, FileText, User, Mail, Phone, MapPin, Briefcase, Users, MessageCircle, X, Clock, DollarSign, Building, ChevronDown } from 'lucide-react';

// Job Card Skeleton Component
const JobCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg animate-pulse">
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="flex items-center mb-2">
            <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="flex items-center mb-2">
            <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center">
          <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>

      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>

      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

// Custom Dropdown Component
const CustomDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  name, 
  error,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 border rounded-lg text-left focus:ring-2 focus:ring-[#014d98] focus:border-transparent transition-all duration-200 hover:border-[#014d98]/50 focus:shadow-md ${
          error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
        } ${isOpen ? 'border-[#014d98] shadow-md' : ''}`}
      >
        <div className="flex items-center justify-between">
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-3 text-left hover:bg-[#014d98]/5 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg ${
                value === option.value 
                  ? 'bg-[#014d98]/10 text-[#014d98] font-medium' 
                  : 'text-gray-900 hover:text-[#014d98]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option.label}</span>
                {value === option.value && (
                  <div className="w-2 h-2 bg-[#014d98] rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Careers = () => {
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    year_of_exp: '',
    degree: 'BSc',
    bio: '',
    cv: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState(null);
  const formRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('success'); // 'success' or 'error'
  const [modalMessage, setModalMessage] = useState('');

  // Fetch jobs from API
  const fetchJobs = useCallback(async () => {
    try {
      setLoadingJobs(true);
      setJobsError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/`);
      if (response.ok) {
        const jobsData = await response.json();
        // Add UI-specific fields to each job
        const jobsWithUI = jobsData.map(job => ({
          ...job,
          type: "Full-time", // Default type
          experience: "2-4 years", // Default experience
          postedDate: "Recently" // Default posted date
        }));
        setJobs(jobsWithUI);
      } else {
        const errorText = await response.text();
        setJobsError(`Failed to load jobs: ${response.status} ${response.statusText}`);
        setJobs([]);
      }
    } catch (error) {
      setJobsError(`Network error: ${error.message}`);
      setJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  }, []);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Dropdown options
  const experienceOptions = [
    { value: '', label: 'Select Experience' },
    { value: '0-1', label: '0-1 years' },
    { value: '1-2', label: '1-2 years' },
    { value: '2-3', label: '2-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10+', label: '10+ years' }
  ];

  const degreeOptions = [
    { value: 'BSc', label: 'BSc' },
    { value: 'HND', label: 'HND' },
    { value: 'MSc', label: 'MSc' },
    { value: 'MBA', label: 'MBA' },
    { value: 'PhD', label: 'PhD' },
    { value: 'Other', label: 'Other' }
  ];



  const handleJobApply = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
    // Reset form when opening modal
    setFormData({
      email: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      year_of_exp: '',
      degree: 'BSc',
      bio: '',
      cv: null
    });
    setErrors({});
    
    // On mobile, scroll to the form section
    if (window.innerWidth < 768 && formRef.current) {
      setTimeout(() => {
        formRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      year_of_exp: '',
      degree: 'BSc',
      bio: '',
      cv: null
    });
    setErrors({});
  };

  const handleCloseModal = () => {
    setShowApplicationModal(false);
    setSelectedJob(null);
    resetForm();
  };

  const showFeedbackModal = (type, message) => {
    setModalType(type);
    setModalMessage(message);
    setShowModal(true);
  };

  const closeFeedbackModal = () => {
    setShowModal(false);
    if (modalType === 'success') {
      handleCloseModal();
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'cv') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    if (!formData.year_of_exp) newErrors.year_of_exp = 'Years of experience is required';
    if (!formData.degree) newErrors.degree = 'Degree is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.cv) newErrors.cv = 'CV/Resume is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare FormData for multipart/form-data submission
      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('year_of_exp', parseInt(formData.year_of_exp));
      formDataToSend.append('degree', formData.degree);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('cv', formData.cv);

      console.log('Submitting application for job:', selectedJob?.id);
      
      // Make API call to submit application
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/${selectedJob.id}/applications/`, {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Application submitted successfully:', result);
        showFeedbackModal('success', `Application for ${selectedJob?.title} submitted successfully! We will get back to you soon.`);
      } else {
        let errorMessage = 'Please try again.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        console.error('API Error:', errorMessage);
        showFeedbackModal('error', `Error submitting application: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      showFeedbackModal('error', 'Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getErrorMessage = (field) => {
    return errors[field] ? (
      <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
    ) : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6">
              Join Our Team
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto px-2">
              Be part of Nigeria&apos;s leading real estate platform. Help us transform how people buy, sell, and rent properties.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <Briefcase className="w-4 h-4 mr-2" />
                <span>Full-time positions</span>
              </div>
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Remote & On-site</span>
              </div>
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                <span>Growing team</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs and Application Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Available Positions
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Discover exciting career opportunities and find the perfect role for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">
          {/* Left Side - Job Listings */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Open Positions</h3>
            <div className="space-y-4 max-h-[400px] md:max-h-[500px] lg:max-h-[700px] overflow-y-auto pr-2">
              {loadingJobs ? (
                <div className="space-y-4">
                  <JobCardSkeleton />
                  <JobCardSkeleton />
                </div>
              ) : jobsError ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-red-500 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Jobs</h3>
                  <p className="text-gray-600 mb-4">{jobsError}</p>
                  <button
                    onClick={fetchJobs}
                    className="bg-[#014d98] text-white px-4 py-2 rounded-lg hover:bg-[#3ab7b1] transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Jobs Available</h3>
                  <p className="text-gray-600">Check back later for new opportunities.</p>
                </div>
              ) : (
                jobs.map((job) => (
                <div 
                  key={job.id} 
                  className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                    selectedJob?.id === job.id 
                      ? 'border-[#014d98] shadow-xl' 
                      : 'border-transparent hover:border-gray-200'
                  }`}
                  onClick={() => handleJobApply(job)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h4>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Building className="w-4 h-4 mr-1" />
                      <span>{job.category}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{job.location}</span>
                    </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {job.type}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{job.experience}</span>
                      </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>{job.pay_range}</span>
                  </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>Posted {job.postedDate}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {job.requirement.split('\n').length} requirements
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJobApply(job);
                        }}
                        className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-[#3ab7b1] hover:to-[#014d98] transition-all duration-300"
                      >
                        {selectedJob?.id === job.id ? 'Selected' : 'Apply Now'}
                      </button>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>

          {/* Right Side - Application Form */}
          <div ref={formRef} className="bg-white rounded-xl shadow-lg p-6">
            {selectedJob ? (
              <div>
                <div className="mb-6">
                  {/* Mobile Back Button */}
                  <div className="md:hidden mb-4">
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="flex items-center text-[#014d98] hover:text-[#3ab7b1] transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Jobs
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Apply for {selectedJob.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedJob.category} • {selectedJob.location}
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Job Description</h4>
                    <p className="text-sm text-gray-700 mb-3">{selectedJob.description}</p>
                    <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {selectedJob.requirement.split('\n').map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-[#014d98] mr-2">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center border-b border-gray-200 pb-2">
                      <User className="w-5 h-5 mr-2 text-[#014d98]" />
                      Personal Information
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014d98] focus:border-transparent transition-colors"
                            placeholder="your.email@example.com"
                          />
                        </div>
                        {getErrorMessage('email')}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014d98] focus:border-transparent transition-colors"
                          placeholder="John"
                        />
                        {getErrorMessage('first_name')}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014d98] focus:border-transparent transition-colors"
                          placeholder="Doe"
                        />
                        {getErrorMessage('last_name')}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014d98] focus:border-transparent transition-colors"
                            placeholder="+234 801 234 5678"
                          />
                        </div>
                        {getErrorMessage('phone_number')}
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center border-b border-gray-200 pb-2">
                      <Briefcase className="w-5 h-5 mr-2 text-[#014d98]" />
                      Professional Information
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Years of Experience <span className="text-red-500">*</span>
                        </label>
                        <CustomDropdown
                          options={experienceOptions}
                          value={formData.year_of_exp}
                          onChange={handleChange}
                          placeholder="Select Experience"
                          name="year_of_exp"
                          error={errors.year_of_exp}
                        />
                        {getErrorMessage('year_of_exp')}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Degree <span className="text-red-500">*</span>
                        </label>
                        <CustomDropdown
                          options={degreeOptions}
                          value={formData.degree}
                          onChange={handleChange}
                          placeholder="Select Degree"
                          name="degree"
                          error={errors.degree}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014d98] focus:border-transparent transition-colors resize-none"
                        placeholder="Tell us about your experience and skills..."
                      />
                      {getErrorMessage('bio')}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload CV/Resume <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#014d98] transition-colors">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <div className="flex text-sm text-gray-600 justify-center">
                            <label
                              htmlFor="cv"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-[#014d98] hover:text-[#3ab7b1] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#014d98] transition-colors"
                            >
                              <span>Upload a file</span>
                              <input
                                id="cv"
                                name="cv"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="sr-only"
                                onChange={handleChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            Max 10 MB
                          </p>
                          {formData.cv && (
                            <p className="text-sm text-green-600 flex items-center justify-center mt-1">
                              <FileText className="w-4 h-4 mr-1" />
                              {formData.cv.name}
                            </p>
                          )}
                        </div>
                      </div>
                      {getErrorMessage('cv')}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white py-3 px-6 rounded-lg font-medium hover:from-[#3ab7b1] hover:to-[#014d98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">Select a Job Position</h3>
                <p className="text-gray-400">Choose a job from the left to start your application</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Join QARBA?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Be part of a team that&apos;s revolutionizing real estate in Nigeria
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-6">
              <div className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Growth Opportunities</h3>
              <p className="text-gray-600">
                Join a fast-growing company with plenty of room for career advancement and skill development.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Great Team</h3>
              <p className="text-gray-600">
                Work with talented, passionate people who are committed to making a difference in real estate.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Impact</h3>
              <p className="text-gray-600">
                Help thousands of Nigerians find their dream homes and make real estate transactions seamless.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                {modalType === 'success' ? (
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>
              
              <h3 className={`text-xl font-semibold text-center mb-4 ${
                modalType === 'success' ? 'text-green-900' : 'text-red-900'
              }`}>
                {modalType === 'success' ? 'Application Submitted!' : 'Submission Failed'}
              </h3>
              
              <p className="text-gray-600 text-center mb-6">
                {modalMessage}
              </p>
              
              <div className="flex justify-center">
                <button
                  onClick={closeFeedbackModal}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    modalType === 'success'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {modalType === 'success' ? 'Continue' : 'Try Again'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
