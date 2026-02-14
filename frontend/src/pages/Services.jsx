import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiSearch, FiChevronLeft, FiChevronRight, FiPhone, FiActivity, FiX } from 'react-icons/fi';
import api from '../utils/api';
import { getBaseURL } from '../utils/url';

const API_URL = getBaseURL();

// Default service images based on category/name keywords
const getDefaultServiceImage = (service) => {
  const name = (service.name || '').toLowerCase();
  const category = (service.category || '').toLowerCase();

  if (name.includes('cardiac') || name.includes('heart') || name.includes('cardio') || category.includes('cardiac')) {
    return 'from-red-500 to-red-600';
  }
  if (name.includes('surgery') || name.includes('surgical') || category.includes('surgical')) {
    return 'from-blue-500 to-blue-600';
  }
  if (name.includes('emergency') || name.includes('urgent') || category.includes('emergency')) {
    return 'from-orange-500 to-orange-600';
  }
  if (name.includes('lab') || name.includes('diagnostic') || category.includes('diagnostic')) {
    return 'from-purple-500 to-purple-600';
  }
  if (name.includes('therapy') || name.includes('rehab') || category.includes('therapy')) {
    return 'from-teal-500 to-teal-600';
  }
  if (name.includes('icu') || name.includes('intensive') || category.includes('critical')) {
    return 'from-rose-500 to-rose-600';
  }
  if (name.includes('cancer') || name.includes('oncology')) {
    return 'from-pink-500 to-pink-600';
  }
  if (name.includes('dental')) {
    return 'from-cyan-500 to-cyan-600';
  }
  if (name.includes('radiology') || name.includes('imaging') || name.includes('mri')) {
    return 'from-indigo-500 to-indigo-600';
  }
  return 'from-green-500 to-green-600';
};

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const tabsContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Fetch categories for filter tabs
  const { data: categories } = useQuery({
    queryKey: ['serviceCategories'],
    queryFn: () => api.get('/services/categories').then(res => res.data)
  });

  // Fetch all services
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then(res => res.data)
  });

  // Filter services by search term and category
  const filteredServices = services?.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group services by category
  const groupedServices = filteredServices?.reduce((acc, service) => {
    const cat = service.category || 'General';
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(service);
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
  }, [categories]);

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

  return (
    <div className="py-6 sm:py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-green-800">Our Services</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-lg">
            Socsargen County Hospital offers comprehensive healthcare services with state-of-the-art facilities and expert medical professionals.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-5 sm:mb-6 max-w-2xl mx-auto">
          <div className="relative">
            <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 border-2 border-green-200 rounded-full focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-sm sm:text-base text-gray-700"
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

        {/* Category Filter - Dropdown on mobile, tabs on desktop */}
        {categories && categories.length > 0 && (
          <div className="mb-6 sm:mb-8">
            {/* Mobile: Dropdown */}
            <div className="sm:hidden">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2.5 px-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-sm text-gray-700 bg-white"
              >
                <option value="">All Services ({services?.length || 0})</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat} ({services?.filter(s => s.category === cat).length || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop: Scrollable tabs */}
            <div className="hidden sm:block relative">
              <div className="flex items-center">
                {showLeftArrow && (
                  <button
                    onClick={() => scrollTabs('left')}
                    className="absolute left-0 z-10 bg-white shadow-md rounded-full p-2 text-green-600 hover:bg-green-50 transition-colors"
                    aria-label="Scroll left"
                  >
                    <FiChevronLeft className="text-xl" />
                  </button>
                )}

                <div
                  ref={tabsContainerRef}
                  onScroll={checkScrollPosition}
                  className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-8 mx-auto"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all text-sm ${
                      selectedCategory === ''
                        ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                        : 'bg-white text-green-700 border-2 border-green-200 hover:border-green-400 hover:bg-green-50'
                    }`}
                  >
                    All Services
                  </button>

                  {categories?.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all text-sm ${
                        selectedCategory === cat
                          ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                          : 'bg-white text-green-700 border-2 border-green-200 hover:border-green-400 hover:bg-green-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

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
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-10 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : filteredServices?.length === 0 ? (
          <div className="text-center py-10 sm:py-12">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm max-w-md mx-auto">
              <FiActivity className="text-4xl sm:text-5xl text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 text-sm sm:text-lg">No services found matching your criteria.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
                className="mt-3 sm:mt-4 text-green-600 hover:text-green-700 font-medium text-sm sm:text-base"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          /* Services Display */
          <div className="space-y-8 sm:space-y-10">
            {selectedCategory ? (
              /* Single Category View */
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-green-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-green-500 rounded-full"></span>
                  {selectedCategory}
                  <span className="text-xs sm:text-sm font-normal text-gray-500">
                    ({filteredServices?.length} service{filteredServices?.length !== 1 ? 's' : ''})
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {filteredServices?.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            ) : (
              /* All Categories Grouped View */
              Object.entries(groupedServices || {}).map(([category, catServices]) => (
                <div key={category}>
                  <h2 className="text-lg sm:text-2xl font-bold text-green-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-green-500 rounded-full"></span>
                    {category}
                    <span className="text-xs sm:text-sm font-normal text-gray-500">
                      ({catServices.length} service{catServices.length !== 1 ? 's' : ''})
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {catServices.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-10 sm:mt-16 bg-gradient-to-r from-green-600 to-green-700 rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center text-white">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Need More Information?</h2>
          <p className="text-green-100 mb-4 sm:mb-6 max-w-xl mx-auto text-sm sm:text-base">
            Contact us to learn more about our services or to schedule a consultation with our medical experts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <a
              href="tel:553-8906"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-green-50 transition"
            >
              <FiPhone /> Call: 553-8906
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-white/10 transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to create slug from service name
const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Service Card Component
const ServiceCard = ({ service }) => {
  const gradientColor = getDefaultServiceImage(service);
  const slug = createSlug(service.name);

  return (
    <Link
      to={`/services/${slug}`}
      className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group cursor-pointer block"
    >
      {/* Large Image Area */}
      <div className={`h-48 sm:h-56 lg:h-60 bg-gradient-to-br ${gradientColor} relative overflow-hidden`}>
        {service.imageUrl ? (
          <img
            src={`${API_URL}${service.imageUrl}`}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={{ objectPosition: 'center' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiActivity className="text-white/20 text-6xl sm:text-7xl" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* View Details on hover */}
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
          <span className="inline-flex items-center gap-1.5 text-white font-medium text-xs sm:text-sm bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
            View Details
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </span>
        </div>
        {/* Featured Badge */}
        {service.isFeatured && (
          <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3">
            <span className="bg-yellow-400/90 backdrop-blur-sm text-yellow-900 text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm">
              FEATURED
            </span>
          </div>
        )}
        {/* Category Badge on image */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3">
          <span className="text-[10px] sm:text-xs font-semibold text-white bg-green-600/80 backdrop-blur-sm px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
            {service.category || 'General'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-5">
        <h3 className="font-bold text-sm sm:text-lg text-gray-800 mb-1 sm:mb-2 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
          {service.name}
        </h3>
        {service.description ? (
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-2">
            {service.description}
          </p>
        ) : (
          <p className="text-gray-400 text-xs sm:text-sm italic">
            Click to learn more about this service.
          </p>
        )}
      </div>
    </Link>
  );
};

export default Services;
