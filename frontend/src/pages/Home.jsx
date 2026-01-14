import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FiArrowRight,
  FiPhone,
  FiMail,
  FiMapPin,
  FiUser,
  FiActivity,
  FiHeart,
  FiCalendar,
  FiAward,
  FiUsers,
  FiClock,
  FiShield
} from 'react-icons/fi';
import api from '../utils/api';
import hmoPartnersImg from '../assets/hmo-partners.jpg';
import hospitalAerialImg from '../assets/hospital-aerial.jpg';
import doctor1Img from '../assets/doctor1.jpg';
import doctor2Img from '../assets/doctor2.jpg';
import doctor3Img from '../assets/doctor3.jpg';
import doctor4Img from '../assets/doctor4.jpg';
import doctor5Img from '../assets/doctor5.jpg';
import doctor6Img from '../assets/doctor6.jpg';
import hero1Img from '../assets/hero1.jpg';
import hero2Img from '../assets/hero2.jpg';
import hero3Img from '../assets/hero3.jpg';
import hero4Img from '../assets/hero4.jpg';
import hero5Img from '../assets/hero5.jpg';
import hero6Img from '../assets/hero6.jpg';

const Home = () => {
  // Hero slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    { image: hero1Img, alt: 'Medical Team' },
    { image: hero2Img, alt: 'Hospital Equipment' },
    { image: hero3Img, alt: 'Healthcare Professionals' },
    { image: hero4Img, alt: 'Modern Hospital Room' },
    { image: hero5Img, alt: 'Medical Care' },
    { image: hero6Img, alt: 'Hospital Facility' }
  ];

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Fetch featured services from API
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['services', 'featured'],
    queryFn: () => api.get('/services/featured').then(res => res.data).catch((error) => {
      console.error('Failed to fetch services:', error);
      return null;
    })
  });

  // Service icons mapping
  const getServiceIcon = (iconName) => {
    const icons = {
      'emergency': <FiActivity className="w-8 h-8" />,
      'outpatient': <FiUser className="w-8 h-8" />,
      'lab': <FiShield className="w-8 h-8" />,
      'radiology': <FiActivity className="w-8 h-8" />,
      'pharmacy': <FiHeart className="w-8 h-8" />,
      'surgery': <FiActivity className="w-8 h-8" />,
      'cardiology': <FiHeart className="w-8 h-8" />,
      'pediatrics': <FiUsers className="w-8 h-8" />,
      'obstetrics': <FiHeart className="w-8 h-8" />,
      'icu': <FiActivity className="w-8 h-8" />,
      'default': <FiActivity className="w-8 h-8" />
    };
    return icons[iconName] || icons['default'];
  };

  // Doctor categories
  const doctorCategories = [
    'Admitting Physician',
    'Anesthesiologist',
    'Attending Physician',
    'Resident on Duty',
    'Surgeon',
    'Referral'
  ];

  // Featured doctors
  const featuredDoctors = [
    { id: 1, name: 'Dr. Maria Santos', specialty: 'Cardiologist', image: doctor1Img },
    { id: 2, name: 'Dr. Jose Garcia', specialty: 'Internal Medicine', image: doctor2Img },
    { id: 3, name: 'Dr. Ana Reyes', specialty: 'Pediatrician', image: doctor3Img },
    { id: 4, name: 'Dr. Miguel Cruz', specialty: 'Surgeon', image: doctor4Img },
    { id: 5, name: 'Dr. Rosa Dela Cruz', specialty: 'OB-GYN', image: doctor5Img },
    { id: 6, name: 'Dr. Carlos Mendoza', specialty: 'Anesthesiologist', image: doctor6Img }
  ];

  // Health packages
  const healthPackages = [
    {
      id: 1,
      title: '2-Benefit Heart Surgery Package',
      description: 'Comprehensive cardiac care including surgery and post-operative care',
      icon: <FiHeart className="w-10 h-10" />
    },
    {
      id: 2,
      title: 'Z-Benefit Package for Breast Cancer',
      description: 'Complete breast cancer treatment and support services',
      icon: <FiShield className="w-10 h-10" />
    },
    {
      id: 3,
      title: 'All-Inclusive Maternity Package',
      description: 'Full maternity care from prenatal to postnatal services',
      icon: <FiUsers className="w-10 h-10" />
    },
    {
      id: 4,
      title: 'Angiogram Package',
      description: 'Diagnostic imaging for cardiovascular assessment',
      icon: <FiActivity className="w-10 h-10" />
    }
  ];

  // News items
  const newsItems = [
    {
      id: 1,
      title: 'ISO 9001:2015 Certified',
      description: 'SCH OFW Clinic maintained certification demonstrating our commitment to quality healthcare services.',
      date: 'January 2024',
      badge: 'Certification'
    },
    {
      id: 2,
      title: 'Renovated Critical Care Complex',
      description: 'Newly renovated ICU unveiled with state-of-the-art medical equipment and facilities.',
      date: 'December 2023',
      badge: 'Facility'
    },
    {
      id: 3,
      title: 'Two Awake Brain Surgeries',
      description: 'Historic milestone in Region 12 as SCH successfully performs awake brain surgeries.',
      date: 'November 2023',
      badge: 'Achievement'
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Section 1: Hero Section with Slideshow */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {/* Slideshow Images */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover object-center scale-100"
              style={{ objectPosition: 'center center' }}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          </div>
        ))}

        {/* Content */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Welcome to Socsargen County Hospital
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 font-light">
                Leading with Innovation, Serving with Compassion.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-primary-600 text-white hover:bg-primary-700 font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Learn More
                <FiArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Section 2: Quick Help Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Get high-quality healthcare in the heart of General Santos City
            </h2>
            <p className="text-lg text-gray-600">
              How can we help you today?
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Find a Doctor Card */}
            <Link
              to="/doctors"
              className="group bg-white border-2 border-gray-100 rounded-xl p-8 text-center hover:border-primary-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-300">
                <FiUser className="w-10 h-10 text-primary-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary-600">
                Find a Doctor
              </h3>
              <p className="text-gray-500 text-sm">
                Search our medical specialists
              </p>
            </Link>

            {/* Book Executive Check Up Card */}
            <Link
              to="/services"
              className="group bg-white border-2 border-gray-100 rounded-xl p-8 text-center hover:border-primary-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-300">
                <FiActivity className="w-10 h-10 text-primary-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary-600">
                Book an Executive Check Up
              </h3>
              <p className="text-gray-500 text-sm">
                Comprehensive health screening
              </p>
            </Link>

            {/* Wellness Packages Card */}
            <Link
              to="/services"
              className="group bg-white border-2 border-gray-100 rounded-xl p-8 text-center hover:border-primary-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-300">
                <FiHeart className="w-10 h-10 text-primary-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary-600">
                Learn about our Wellness Packages
              </h3>
              <p className="text-gray-500 text-sm">
                Preventive care programs
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3: Our Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              With a full range of services and advanced treatments, we're here to make sure every patient receives the care they need with heart, skill, and commitment.
            </p>
          </div>

          {servicesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {(servicesData?.data || servicesData || []).slice(0, 10).map((service, index) => (
                <div
                  key={service?.id || index}
                  className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                    {getServiceIcon(service?.icon)}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {service?.name || 'Service'}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {service?.description || 'Quality healthcare service'}
                  </p>
                </div>
              ))}
              {/* Fallback services if API returns empty */}
              {(!servicesData || (servicesData?.data || servicesData || []).length === 0) && (
                <>
                  {[
                    { id: 'fallback-emergency', name: 'Emergency Care', icon: 'emergency', description: '24/7 emergency medical services' },
                    { id: 'fallback-outpatient', name: 'Outpatient Services', icon: 'outpatient', description: 'Comprehensive outpatient care' },
                    { id: 'fallback-lab', name: 'Laboratory', icon: 'lab', description: 'Advanced diagnostic testing' },
                    { id: 'fallback-radiology', name: 'Radiology', icon: 'radiology', description: 'Medical imaging services' },
                    { id: 'fallback-pharmacy', name: 'Pharmacy', icon: 'pharmacy', description: 'In-hospital pharmacy' },
                    { id: 'fallback-surgery', name: 'Surgery', icon: 'surgery', description: 'Surgical procedures' },
                    { id: 'fallback-cardiology', name: 'Cardiology', icon: 'cardiology', description: 'Heart care services' },
                    { id: 'fallback-pediatrics', name: 'Pediatrics', icon: 'pediatrics', description: 'Child healthcare' },
                    { id: 'fallback-obstetrics', name: 'Obstetrics', icon: 'obstetrics', description: 'Maternity services' },
                    { id: 'fallback-icu', name: 'ICU', icon: 'icu', description: 'Intensive care unit' }
                  ].map((service) => (
                    <div
                      key={service.id}
                      className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                    >
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                        {getServiceIcon(service.icon)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {service.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {service.description}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 text-lg"
            >
              View All Services
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Facilities Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Explore our facilities
            </h2>
            <p className="text-gray-600 text-lg">
              See healing spaces
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-8 md:p-12 text-white">
                <div className="flex items-start gap-6">
                  <div className="hidden md:flex w-24 h-24 bg-white/20 rounded-full items-center justify-center flex-shrink-0">
                    <FiHeart className="w-12 h-12" />
                  </div>
                  <div>
                    <span className="inline-block bg-accent-500 text-accent-900 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                      Featured Facility
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                      Catheterization Lab
                    </h3>
                    <p className="text-primary-100 text-lg leading-relaxed">
                      Transforms cardiac care to allow the performance of minimally invasive diagnostic tests and treatment procedures. Our state-of-the-art cath lab is equipped with the latest technology to provide accurate diagnoses and effective treatments for cardiovascular conditions.
                    </p>
                    <Link
                      to="/services"
                      className="inline-flex items-center gap-2 mt-6 text-white font-semibold hover:text-accent-300 transition-colors"
                    >
                      Learn More About Our Facilities
                      <FiArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Meet Our Doctors Section */}
      <section className="py-16 bg-primary-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet our Doctors
            </h2>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto">
              Meet the seasoned experts of Socsargen County Hospital.
            </p>
          </div>

          {/* Doctor Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {doctorCategories.map((category, index) => (
              <button
                key={index}
                type="button"
                className="bg-white/10 border-2 border-white/30 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-primary-700 hover:border-white transition-all duration-300 cursor-pointer"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Doctor Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto mb-10">
            {featuredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-primary-600 text-xs font-medium">
                    {doctor.specialty}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-8 py-3 rounded-lg text-lg transition-all duration-300"
            >
              View All Doctors
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6: Health Packages Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Health Packages
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              With a full range of services and advanced treatments, we're here to make sure every patient receives the care they need with heart, skill, and commitment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {healthPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-xl p-6 hover:shadow-lg hover:border-primary-300 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                  {pkg.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {pkg.title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {pkg.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 text-lg"
            >
              View All Health Packages
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 7: About Hospital Section */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Socsargen County Hospital is a private and an ISO-accredited tertiary hospital located in General Santos City.
            </h2>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <p className="text-primary-600 text-lg leading-relaxed mb-6">
                    Serving the people of General Santos City and setting the standards of healthcare in Region 12
                  </p>
                  <div className="text-6xl md:text-7xl font-bold text-primary-700 mb-4">
                    1992
                  </div>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 bg-primary-600 text-white hover:bg-primary-700 font-semibold px-6 py-3 rounded-lg transition-all duration-300 w-fit"
                  >
                    About Us
                    <FiArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                <div className="h-64 md:h-auto">
                  <img
                    src={hospitalAerialImg}
                    alt="Socsargen County Hospital Aerial View"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Patient Stories/Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our SCH Stories
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Featuring real patients whose journeys remind us that healing starts with compassion and care.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 relative">
              {/* Quote decoration */}
              <div className="absolute top-6 left-6 text-8xl text-primary-100 font-serif leading-none">
                "
              </div>
              <div className="relative z-10">
                <blockquote className="text-xl md:text-2xl text-gray-700 italic mb-8 leading-relaxed pt-8">
                  I am deeply Grateful to Socsargen County Hospital, it was here that I Truly Experienced genuine compassion and care.
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">KARELLE M. RABIA</p>
                    <p className="text-gray-500">Patient</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: HMO Partners Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              HMO &amp; Insurance Partners
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              We take pride in partnering with various Health Maintenance Organizations (HMOs) to make quality healthcare more accessible to our community.
            </p>
          </div>

          {/* Partner logos */}
          <div className="max-w-4xl mx-auto">
            <img
              src={hmoPartnersImg}
              alt="Affiliated Health Maintenance Organization (HMO) Partners"
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Section 10: News and Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              News and Events
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Stay updated on Socsargen County Hospital latest news, events, and wellness initiatives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {newsItems.map((news) => (
              <article
                key={news.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                {/* News image placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <FiAward className="w-16 h-16 text-white/50" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-accent-100 text-accent-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {news.badge}
                    </span>
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <FiCalendar className="w-4 h-4" />
                      {news.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3">
                    {news.description}
                  </p>
                  <Link
                    to="/news"
                    className="inline-flex items-center gap-1 text-primary-600 font-medium text-sm mt-4 hover:text-primary-700"
                  >
                    Read More
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 text-lg"
            >
              View All News &amp; Events
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 11: Contact Preview Section */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Contact Us
              </h2>
              <p className="text-primary-100 text-lg">
                We are here to take care of you
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-colors">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPhone className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Phone</h3>
                <p className="text-primary-100">553-8906 / 553-8907</p>
                <p className="text-primary-100">0932-692-4708</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-colors">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMail className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Email</h3>
                <p className="text-primary-100">edpsocsargen@gmail.com</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-colors">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMapPin className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Address</h3>
                <p className="text-primary-100 text-sm">L. Arradaza St., Bula-Lagao Road, Lagao, General Santos City</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-8 py-3 rounded-lg transition-all duration-300"
              >
                Get in Touch
                <FiArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency CTA Bar */}
      <section className="py-6 bg-accent-500">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <FiClock className="w-6 h-6 text-accent-900" />
              <span className="font-semibold text-accent-900">24/7 Emergency Services Available</span>
            </div>
            <span className="hidden md:inline text-accent-700">|</span>
            <div className="flex items-center gap-2">
              <FiPhone className="w-6 h-6 text-accent-900" />
              <span className="font-bold text-accent-900 text-lg">Emergency Hotline: 553-8906 / 0932-692-4708</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
