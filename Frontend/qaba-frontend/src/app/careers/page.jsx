'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Upload, FileText, User, Mail, Phone, MapPin, Briefcase, GraduationCap, Users, MessageCircle, X, Clock, DollarSign, Building, ChevronDown } from 'lucide-react';

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
    firstName: '',
    lastName: '',
    linkedinUrl: '',
    phoneNumber: '',
    yearsExperience: '',
    degree: 'BSc',
    bio: '',
    cvFile: null,
    gender: '',
    location: '',
    state: '',
    country: '',
    referredBy: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' }
  ];

  // Available job positions
  const availableJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      department: "Engineering",
      location: "Lagos, Nigeria",
      type: "Full-time",
      experience: "2-4 years",
      salary: "₦400,000 - ₦600,000",
      description: "We're looking for a skilled Frontend Developer to join our engineering team. You'll work on building responsive web applications using React, Next.js, and modern web technologies.",
      requirements: [
        "2+ years of experience with React and Next.js",
        "Proficiency in JavaScript, TypeScript, and CSS",
        "Experience with state management libraries (Redux, Zustand)",
        "Knowledge of responsive design principles",
        "Experience with version control (Git)"
      ],
      postedDate: "2 days ago"
    },
    {
      id: 2,
      title: "Backend Developer",
      department: "Engineering",
      location: "Lagos, Nigeria",
      type: "Full-time",
      experience: "3-5 years",
      salary: "₦500,000 - ₦800,000",
      description: "Join our backend team to build scalable APIs and microservices. You'll work with Node.js, Python, and cloud technologies to power our real estate platform.",
      requirements: [
        "3+ years of backend development experience",
        "Proficiency in Node.js, Python, or similar",
        "Experience with databases (PostgreSQL, MongoDB)",
        "Knowledge of RESTful APIs and GraphQL",
        "Experience with cloud platforms (AWS, Azure)"
      ],
      postedDate: "1 week ago"
    },
    {
      id: 3,
      title: "Product Manager",
      department: "Product",
      location: "Lagos, Nigeria",
      type: "Full-time",
      experience: "4-6 years",
      salary: "₦600,000 - ₦900,000",
      description: "Lead product strategy and development for our real estate platform. Work closely with engineering, design, and business teams to deliver exceptional user experiences.",
      requirements: [
        "4+ years of product management experience",
        "Experience in B2C or marketplace products",
        "Strong analytical and problem-solving skills",
        "Experience with user research and data analysis",
        "Excellent communication and leadership skills"
      ],
      postedDate: "3 days ago"
    },
    {
      id: 4,
      title: "UX/UI Designer",
      department: "Design",
      location: "Lagos, Nigeria",
      type: "Full-time",
      experience: "2-4 years",
      salary: "₦350,000 - ₦550,000",
      description: "Create beautiful and intuitive user experiences for our real estate platform. Work on user research, wireframing, prototyping, and visual design.",
      requirements: [
        "2+ years of UX/UI design experience",
        "Proficiency in Figma, Sketch, or Adobe Creative Suite",
        "Experience with user research and usability testing",
        "Strong portfolio showcasing design skills",
        "Knowledge of design systems and accessibility"
      ],
      postedDate: "5 days ago"
    },
    {
      id: 5,
      title: "Sales Representative",
      department: "Sales",
      location: "Lagos, Nigeria",
      type: "Full-time",
      experience: "1-3 years",
      salary: "₦250,000 - ₦400,000 + Commission",
      description: "Help grow our business by connecting with real estate agents and property developers. Build relationships and drive sales for our platform.",
      requirements: [
        "1+ years of sales experience",
        "Excellent communication and interpersonal skills",
        "Experience in real estate or B2B sales preferred",
        "Self-motivated and target-driven",
        "Proficiency in CRM systems"
      ],
      postedDate: "1 week ago"
    },
    {
      id: 6,
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Lagos, Nigeria",
      type: "Full-time",
      experience: "2-4 years",
      salary: "₦300,000 - ₦500,000",
      description: "Ensure our customers have a great experience using our platform. Help onboard new users and provide ongoing support and training.",
      requirements: [
        "2+ years of customer success experience",
        "Excellent problem-solving and communication skills",
        "Experience with customer support tools",
        "Knowledge of real estate industry preferred",
        "Strong empathy and customer focus"
      ],
      postedDate: "4 days ago"
    }
  ];

  const handleJobApply = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
    // Reset form when opening modal
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      linkedinUrl: '',
      phoneNumber: '',
      yearsExperience: '',
      degree: 'BSc',
      bio: '',
      cvFile: null,
      gender: '',
      location: '',
      state: '',
      country: '',
      referredBy: ''
    });
    setErrors({});
  };

  const handleCloseModal = () => {
    setShowApplicationModal(false);
    setSelectedJob(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'cvFile') {
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
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.yearsExperience) newErrors.yearsExperience = 'Years of experience is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.cvFile) newErrors.cvFile = 'CV/Resume is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.state.trim()) newErrors.state = 'State of residence is required';
    if (!formData.country.trim()) newErrors.country = 'Country of residence is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Here you would typically send the data to your backend
    // For now, we'll just simulate a submission
    try {
      console.log('Application submitted for job:', selectedJob?.title, formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Application for ${selectedJob?.title} submitted successfully! We will get back to you soon.`);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
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
      <div className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Available Positions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover exciting career opportunities and find the perfect role for you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[800px]">
          {/* Left Side - Job Listings */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Open Positions</h3>
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
              {availableJobs.map((job) => (
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
                          <span>{job.department}</span>
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
                        <span>{job.salary}</span>
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
                        {job.requirements.length} requirements
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
              ))}
            </div>
          </div>

          {/* Right Side - Application Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {selectedJob ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Apply for {selectedJob.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedJob.department} • {selectedJob.location}
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Job Description</h4>
                    <p className="text-sm text-gray-700 mb-3">{selectedJob.description}</p>
                    <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {selectedJob.requirements.map((req, index) => (
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014d98] focus:border-transparent transition-colors"
                          placeholder="John"
                        />
                        {getErrorMessage('firstName')}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014d98] focus:border-transparent transition-colors"
                          placeholder="Doe"
                        />
                        {getErrorMessage('lastName')}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014d98] focus:border-transparent transition-colors"
                            placeholder="+234 801 234 5678"
                          />
                        </div>
                        {getErrorMessage('phoneNumber')}
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center border-b border-gray-200 pb-2">
                      <Briefcase className="w-5 h-5 mr-2 text-[#014d98]" />
                      Professional Information
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Years of Experience <span className="text-red-500">*</span>
                        </label>
                        <CustomDropdown
                          options={experienceOptions}
                          value={formData.yearsExperience}
                          onChange={handleChange}
                          placeholder="Select Experience"
                          name="yearsExperience"
                          error={errors.yearsExperience}
                        />
                        {getErrorMessage('yearsExperience')}
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
                              htmlFor="cvFile"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-[#014d98] hover:text-[#3ab7b1] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#014d98] transition-colors"
                            >
                              <span>Upload a file</span>
                              <input
                                id="cvFile"
                                name="cvFile"
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
                          {formData.cvFile && (
                            <p className="text-sm text-green-600 flex items-center justify-center mt-1">
                              <FileText className="w-4 h-4 mr-1" />
                              {formData.cvFile.name}
                            </p>
                          )}
                        </div>
                      </div>
                      {getErrorMessage('cvFile')}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
    </div>
  );
};

export default Careers;
