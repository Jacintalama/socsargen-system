import { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiSearch, FiUser, FiCalendar, FiChevronLeft, FiChevronRight, FiFilter, FiX } from 'react-icons/fi';
import api from '../utils/api';
import { getBaseURL } from '../utils/url';

const API_URL = getBaseURL();

// Department descriptions
const departmentInfo = {
  'Department of Anesthesiology': {
    description: 'Our anesthesiology team ensures patient safety and comfort during surgical procedures through expert pain management and sedation techniques.'
  },
  'Department of Cardiology': {
    description: 'Specializing in heart health, our cardiologists diagnose and treat cardiovascular diseases using advanced diagnostic tools and treatments.'
  },
  'Department of Dental Medicine': {
    description: 'Comprehensive dental care services including preventive, restorative, and cosmetic dentistry for patients of all ages.'
  },
  'Department of Family Medicine': {
    description: 'Providing holistic healthcare for the entire family, from newborns to seniors, focusing on preventive care and chronic disease management.'
  },
  'Department of Gastroenterology': {
    description: 'Expert care for digestive system disorders including the stomach, intestines, liver, and pancreas.'
  },
  'Department of Internal Medicine': {
    description: 'Comprehensive diagnosis and treatment of adult diseases, serving as your primary care physicians for complex medical conditions.'
  },
  'Department of Neurology': {
    description: 'Specialized care for disorders of the brain, spine, and nervous system including stroke, epilepsy, and neurological conditions.'
  },
  'Department of OB-GYN': {
    description: 'Complete women\'s health services including prenatal care, childbirth, reproductive health, and gynecological treatments.'
  },
  'Department of Oncology': {
    description: 'Compassionate cancer care with advanced treatment options including chemotherapy, immunotherapy, and supportive services.'
  },
  'Department of Orthopedics': {
    description: 'Expert treatment for bone, joint, and muscle conditions including sports injuries, arthritis, and orthopedic surgery.'
  },
  'Department of Pathology': {
    description: 'Accurate laboratory diagnosis through tissue analysis, helping guide treatment decisions for various medical conditions.'
  },
  'Department of Pediatrics': {
    description: 'Dedicated healthcare for infants, children, and adolescents, focusing on growth, development, and childhood diseases.'
  },
  'Department of Radiology': {
    description: 'Advanced medical imaging services including X-ray, CT scan, MRI, and ultrasound for accurate diagnosis.'
  },
  'Department of Surgery': {
    description: 'Skilled surgical team performing a wide range of procedures using modern techniques for optimal patient outcomes.'
  },
  'Other': {
    description: 'Additional specialized medical services to meet your healthcare needs.'
  }
};

const Doctors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get('dept') || '');
  const tabsContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Update selected department when URL changes
  useEffect(() => {
    const dept = searchParams.get('dept');
    if (dept) {
      setSelectedDepartment(dept);
    }
  }, [searchParams]);

  // Handle department selection - update URL
  const handleDepartmentSelect = (dept) => {
    setSelectedDepartment(dept);
    if (dept) {
      setSearchParams({ dept });
    } else {
      setSearchParams({});
    }
  };

  // Fetch departments for filter tabs
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get('/doctors/departments').then(res => res.data)
  });

  // Fetch doctors with optional department filter
  const { data: doctors, isLoading } = useQuery({
    queryKey: ['doctors', selectedDepartment],
    queryFn: () => api.get(`/doctors${selectedDepartment ? `?department=${encodeURIComponent(selectedDepartment)}` : ''}`).then(res => res.data)
  });

  // Filter doctors by search term
  const filteredDoctors = doctors?.filter(doc =>
    doc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.department && doc.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group doctors by department
  const groupedDoctors = filteredDoctors?.reduce((acc, doctor) => {
    const dept = doctor.department || 'Other';
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(doctor);
    return acc;
  }, {});

  // Check scroll position for arrow visibility
  const checkScrollPosition = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [departments]);

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = 200;
      tabsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  // Get short department name for display
  const getShortDeptName = (fullName) => {
    return fullName?.replace('Department of ', '') || fullName;
  };

  return (
    <div className="py-6 sm:py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-green-800">Our Medical Team</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-lg">
            Meet our team of experienced and dedicated healthcare professionals across specialized departments, ready to provide you with the best medical care.
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-green-100 p-3 sm:p-4 md:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                <FiSearch className="inline mr-1" /> Search Doctor
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
                <input
                  type="text"
                  placeholder="Search by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 border-2 border-green-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-sm sm:text-base text-gray-700"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>

            {/* Department Dropdown */}
            <div className="lg:w-72">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                <FiFilter className="inline mr-1" /> Filter by Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => handleDepartmentSelect(e.target.value)}
                className="w-full py-2.5 sm:py-3 px-3 sm:px-4 border-2 border-green-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-sm sm:text-base text-gray-700 bg-white cursor-pointer"
              >
                <option value="">All Departments</option>
                {departments?.map((dept) => (
                  <option key={dept} value={dept}>
                    {getShortDeptName(dept)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || selectedDepartment) && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-500">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-green-900 p-0.5">
                    <FiX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </span>
              )}
              {selectedDepartment && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  {getShortDeptName(selectedDepartment)}
                  <button onClick={() => handleDepartmentSelect('')} className="hover:text-green-900 p-0.5">
                    <FiX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </span>
              )}
              <button
                onClick={() => { setSearchTerm(''); handleDepartmentSelect(''); }}
                className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Department Quick Filter Tabs (Desktop) */}
        <div className="mb-6 sm:mb-8 relative hidden md:block">
          <div className="flex items-center">
            {/* Left Arrow */}
            {showLeftArrow && (
              <button
                onClick={() => scrollTabs('left')}
                className="absolute left-0 z-10 bg-white shadow-md rounded-full p-2 text-green-600 hover:bg-green-50 transition-colors"
                aria-label="Scroll left"
              >
                <FiChevronLeft className="text-xl" />
              </button>
            )}

            {/* Scrollable Tabs Container */}
            <div
              ref={tabsContainerRef}
              onScroll={checkScrollPosition}
              className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-8 mx-auto"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* All Departments Tab */}
              <button
                onClick={() => handleDepartmentSelect('')}
                className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all text-sm ${
                  selectedDepartment === ''
                    ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                    : 'bg-white text-green-700 border-2 border-green-200 hover:border-green-400 hover:bg-green-50'
                }`}
              >
                All Departments
              </button>

              {/* Department Tabs */}
              {departments?.map((dept) => (
                <button
                  key={dept}
                  onClick={() => handleDepartmentSelect(dept)}
                  className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all text-sm ${
                    selectedDepartment === dept
                      ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                      : 'bg-white text-green-700 border-2 border-green-200 hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  {getShortDeptName(dept)}
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            {showRightArrow && (
              <button
                onClick={() => scrollTabs('right')}
                className="absolute right-0 z-10 bg-white shadow-md rounded-full p-2 text-green-600 hover:bg-green-50 transition-colors"
                aria-label="Scroll right"
              >
                <FiChevronRight className="text-xl" />
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-10 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : filteredDoctors?.length === 0 ? (
          <div className="text-center py-10 sm:py-12">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm max-w-md mx-auto">
              <FiUser className="text-4xl sm:text-5xl text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 text-sm sm:text-lg">No doctors found matching your criteria.</p>
              <button
                onClick={() => { setSearchTerm(''); handleDepartmentSelect(''); }}
                className="mt-3 sm:mt-4 text-green-600 hover:text-green-700 font-medium text-sm sm:text-base"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          /* Doctors Display */
          <div className="space-y-8 sm:space-y-12">
            {selectedDepartment ? (
              /* Single Department View */
              <div>
                {/* Department Header with Description */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-5 sm:mb-8 border border-green-100">
                  <h2 className="text-lg sm:text-2xl font-bold text-green-800 mb-1 sm:mb-2">
                    {selectedDepartment}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {departmentInfo[selectedDepartment]?.description || 'Providing quality healthcare services.'}
                  </p>
                  <p className="text-xs sm:text-sm text-green-600 font-medium mt-2 sm:mt-3">
                    {filteredDoctors?.length} Specialist{filteredDoctors?.length !== 1 ? 's' : ''} Available
                  </p>
                </div>

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                  {filteredDoctors?.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>
              </div>
            ) : (
              /* All Departments Grouped View */
              Object.entries(groupedDoctors || {}).map(([department, deptDoctors]) => (
                <div key={department} className="scroll-mt-24" id={department.replace(/\s+/g, '-').toLowerCase()}>
                  {/* Department Header with Description */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 border border-green-100">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-1 sm:mb-2">
                      <h2 className="text-lg sm:text-2xl font-bold text-green-800">
                        {department}
                      </h2>
                      <span className="bg-green-100 text-green-700 text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                        {deptDoctors.length} Doctor{deptDoctors.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {departmentInfo[department]?.description || 'Providing quality healthcare services.'}
                    </p>
                  </div>

                  {/* Doctors Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                    {deptDoctors.map((doctor) => (
                      <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Doctor Card Component
const DoctorCard = ({ doctor }) => {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Card Header with Avatar */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden">
          {doctor.photoUrl ? (
            <img
              src={`${API_URL}${doctor.photoUrl}`}
              alt={doctor.fullName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <FiUser className="text-green-600 text-xl sm:text-2xl" />
          )}
        </div>
        <div className="text-white min-w-0">
          <h3 className="font-semibold text-sm sm:text-lg leading-tight truncate">{doctor.fullName}</h3>
          <p className="text-green-100 text-xs sm:text-sm font-medium truncate">{doctor.specialization}</p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-4">
        {/* Department Badge */}
        {doctor.department && (
          <div className="mb-2 sm:mb-3">
            <span className="inline-block bg-green-50 text-green-700 text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
              {doctor.department.replace('Department of ', '')}
            </span>
          </div>
        )}

        {/* Consultation Fee */}
        {doctor.consultationFee && (
          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
            <span className="font-medium">Consultation:</span> ₱{doctor.consultationFee}
          </p>
        )}

        {/* Bio Preview */}
        {doctor.bio && (
          <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4">{doctor.bio}</p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/doctors/${doctor.id}`}
            className="flex-grow text-center py-2 sm:py-2.5 px-3 sm:px-4 border-2 border-green-500 text-green-600 rounded-lg font-medium text-xs sm:text-sm hover:bg-green-50 transition-colors"
          >
            View Profile
          </Link>
          <Link
            to={`/patient/book?doctor=${doctor.id}`}
            className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-3 sm:px-4 bg-green-600 text-white rounded-lg font-medium text-xs sm:text-sm hover:bg-green-700 transition-colors"
          >
            <FiCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Book
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
