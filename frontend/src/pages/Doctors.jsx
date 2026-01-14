import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiSearch, FiUser, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../utils/api';

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const tabsContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

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
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 text-green-800">Our Medical Team</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Meet our team of experienced and dedicated healthcare professionals across 14 specialized departments, ready to provide you with the best medical care.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search doctors by name, specialization, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-full focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-700"
            />
          </div>
        </div>

        {/* Department Filter Tabs */}
        <div className="mb-8 relative">
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
                onClick={() => setSelectedDepartment('')}
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
                  onClick={() => setSelectedDepartment(dept)}
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
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : filteredDoctors?.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl p-8 shadow-sm max-w-md mx-auto">
              <FiUser className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No doctors found matching your criteria.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedDepartment(''); }}
                className="mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          /* Doctors Display */
          <div className="space-y-10">
            {selectedDepartment ? (
              /* Single Department View */
              <div>
                <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                  {selectedDepartment}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredDoctors?.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>
              </div>
            ) : (
              /* All Departments Grouped View */
              Object.entries(groupedDoctors || {}).map(([department, deptDoctors]) => (
                <div key={department}>
                  <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-3">
                    <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                    {department}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Card Header with Avatar */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 flex items-center gap-4">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
          {doctor.photoUrl ? (
            <img
              src={doctor.photoUrl}
              alt={doctor.fullName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <FiUser className="text-green-600 text-2xl" />
          )}
        </div>
        <div className="text-white">
          <h3 className="font-semibold text-lg leading-tight">{doctor.fullName}</h3>
          <p className="text-green-100 text-sm font-medium">{doctor.specialization}</p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Department Badge */}
        {doctor.department && (
          <div className="mb-3">
            <span className="inline-block bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
              {doctor.department.replace('Department of ', '')}
            </span>
          </div>
        )}

        {/* Consultation Fee */}
        {doctor.consultationFee && (
          <p className="text-gray-600 text-sm mb-3">
            <span className="font-medium">Consultation:</span> ₱{doctor.consultationFee}
          </p>
        )}

        {/* Bio Preview */}
        {doctor.bio && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-4">{doctor.bio}</p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/doctors/${doctor.id}`}
            className="flex-grow text-center py-2.5 px-4 border-2 border-green-500 text-green-600 rounded-lg font-medium text-sm hover:bg-green-50 transition-colors"
          >
            View Profile
          </Link>
          <Link
            to={`/patient/book?doctor=${doctor.id}`}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors"
          >
            <FiCalendar />
            Book
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
