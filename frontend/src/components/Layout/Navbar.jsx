import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import TopBar from './TopBar';
import DropdownMenu from './DropdownMenu';
import logo from '../../assets/newlogo.jfif';

// Dropdown data configurations
const servicesDropdown = {
  columns: [
    {
      items: [
        { label: 'Catheterization Laboratory', href: '#' },
        { label: 'Open-Heart Surgeries', href: '#' },
        { label: 'Bypass Surgery', href: '#' },
        { label: 'Endovascular Aneurysm Repair', href: '#' },
        { label: 'MRI', href: '#' },
        { label: 'Cancer Care Center', href: '#' },
        { label: 'Chemotherapy', href: '#' },
        { label: 'OR/DR', href: '#' },
        { label: 'NICU', href: '#' }
      ]
    },
    {
      items: [
        { label: 'ICU', href: '#' },
        { label: 'Outpatient Emergency Care', href: '#' },
        { label: 'Urgent Care Center', href: '#' },
        { label: 'Outpatient Services', href: '#' },
        { label: 'Express Care Center', href: '#' },
        { label: 'Satellite Clinic (Alabel)', href: '#' },
        { label: 'Medical Arts Tower', href: '#' }
      ]
    },
    {
      items: [
        { label: 'Laboratory', href: '#' },
        { label: 'Radiology / Imaging', href: '#' },
        { label: 'Cardio-Pulmonary', href: '#' },
        { label: 'Sleep Studies', href: '#' },
        { label: 'Physical Therapy', href: '#' },
        { label: 'Occupational Therapy', href: '#' },
        { label: 'Speech Therapy', href: '#' },
        { label: 'Educational Therapy', href: '#' }
      ]
    },
    {
      items: [
        { label: 'Dental Services', href: '#' },
        { label: 'Hemodialysis', href: '#' },
        { label: 'Nutrition & Dietetics', href: '#' }
      ]
    }
  ]
};

const doctorsDropdown = {
  header: "At Socsargen County Hospital, we believe in honoring the guardians of health - our esteemed doctors.",
  columns: [
    {
      items: [
        { label: 'Department of Cardiology', href: '#' },
        { label: 'Orthopedics', href: '#' },
        { label: 'Neurology', href: '#' },
        { label: 'Gastroenterology', href: '#' },
        { label: 'Oncology', href: '#' },
        { label: 'Internal Medicine', href: '#' },
        { label: 'Pediatrics', href: '#' }
      ]
    },
    {
      items: [
        { label: 'Department of OB-GYN', href: '#' },
        { label: 'Surgery', href: '#' },
        { label: 'Anesthesiology', href: '#' },
        { label: 'Family Medicine', href: '#' },
        { label: 'Dental Medicine', href: '#' },
        { label: 'Pathology', href: '#' },
        { label: 'Radiology', href: '#' }
      ]
    }
  ]
};

const aboutDropdown = {
  header: "Welcome to Socsargen County Hospital! Here, you're more than just a patient, you're family.",
  columns: [
    {
      items: [
        { label: 'History & Milestones', href: '#' },
        { label: 'Accreditations & Certifications', href: '#' },
        { label: 'Mission & Vision Statements', href: '#' },
        { label: 'Core Values', href: '#' }
      ]
    },
    {
      items: [
        { label: 'Leadership', href: '#' },
        { label: 'Socsargen County Hospital', href: '#' }
      ]
    }
  ]
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    return `/${user.role}/dashboard`;
  };

  const toggleMobileDropdown = (name) => {
    setMobileDropdown(mobileDropdown === name ? null : name);
  };

  return (
    <header className="sticky top-0 z-40">
      {/* Top Bar */}
      <TopBar />

      {/* Main Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 focus:outline-none"
            >
              <img
                src={logo}
                alt="Socsargen County Hospital Logo"
                className="h-12 w-12 object-contain"
              />
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-sm font-bold text-primary-700 uppercase tracking-wide">
                  SOCSARGEN COUNTY HOSPITAL
                </span>
                <span className="text-xs text-gray-500">
                  General Santos City
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Home */}
              <Link
                to="/"
                className="nav-link"
              >
                Home
              </Link>

              {/* Our Services Dropdown */}
              <DropdownMenu
                label="Our Services"
                columns={servicesDropdown.columns}
              />

              {/* Our Doctors Dropdown */}
              <DropdownMenu
                label="Our Doctors"
                columns={doctorsDropdown.columns}
                header={doctorsDropdown.header}
              />

              {/* About Us Dropdown */}
              <DropdownMenu
                label="About Us"
                columns={aboutDropdown.columns}
                header={aboutDropdown.header}
              />

              {/* Contact Us */}
              <Link
                to="/contact"
                className="nav-link"
              >
                Contact Us
              </Link>
            </div>

            {/* Right Side - Login/User */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to={getDashboardPath()}
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition"
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition p-2 rounded-lg hover:bg-gray-100"
                    aria-label="Logout"
                  >
                    <FiLogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition"
                  aria-label="Login"
                >
                  <FiUser className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden pb-4 border-t border-gray-200 mt-2 pt-4">
              {/* Home */}
              <Link
                to="/"
                className="block py-3 px-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition font-medium"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>

              {/* Our Services - Mobile Accordion */}
              <div className="border-b border-gray-100">
                <button
                  className="w-full flex items-center justify-between py-3 px-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition font-medium"
                  onClick={() => toggleMobileDropdown('services')}
                  aria-expanded={mobileDropdown === 'services'}
                  aria-label="Toggle Our Services menu"
                >
                  <span>Our Services</span>
                  <FiChevronDown
                    className={`w-5 h-5 transition-transform ${mobileDropdown === 'services' ? 'rotate-180' : ''}`}
                  />
                </button>
                {mobileDropdown === 'services' && (
                  <div className="pl-4 pb-3 space-y-1">
                    {servicesDropdown.columns.flatMap((col) =>
                      col.items.map((item) => (
                        <Link
                          key={`service-${item.label}`}
                          to={item.href}
                          className="block py-2 px-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded transition"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Our Doctors - Mobile Accordion */}
              <div className="border-b border-gray-100">
                <button
                  className="w-full flex items-center justify-between py-3 px-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition font-medium"
                  onClick={() => toggleMobileDropdown('doctors')}
                  aria-expanded={mobileDropdown === 'doctors'}
                  aria-label="Toggle Our Doctors menu"
                >
                  <span>Our Doctors</span>
                  <FiChevronDown
                    className={`w-5 h-5 transition-transform ${mobileDropdown === 'doctors' ? 'rotate-180' : ''}`}
                  />
                </button>
                {mobileDropdown === 'doctors' && (
                  <div className="pl-4 pb-3 space-y-1">
                    <p className="text-xs text-gray-500 px-2 py-2 italic">
                      {doctorsDropdown.header}
                    </p>
                    {doctorsDropdown.columns.flatMap((col) =>
                      col.items.map((item) => (
                        <Link
                          key={`doctor-${item.label}`}
                          to={item.href}
                          className="block py-2 px-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded transition"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* About Us - Mobile Accordion */}
              <div className="border-b border-gray-100">
                <button
                  className="w-full flex items-center justify-between py-3 px-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition font-medium"
                  onClick={() => toggleMobileDropdown('about')}
                  aria-expanded={mobileDropdown === 'about'}
                  aria-label="Toggle About Us menu"
                >
                  <span>About Us</span>
                  <FiChevronDown
                    className={`w-5 h-5 transition-transform ${mobileDropdown === 'about' ? 'rotate-180' : ''}`}
                  />
                </button>
                {mobileDropdown === 'about' && (
                  <div className="pl-4 pb-3 space-y-1">
                    <p className="text-xs text-gray-500 px-2 py-2 italic">
                      {aboutDropdown.header}
                    </p>
                    {aboutDropdown.columns.flatMap((col) =>
                      col.items.map((item) => (
                        <Link
                          key={`about-${item.label}`}
                          to={item.href}
                          className="block py-2 px-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded transition"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Contact Us */}
              <Link
                to="/contact"
                className="block py-3 px-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition font-medium"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>

              {/* Login/User Section */}
              <div className="border-t border-gray-200 mt-3 pt-3">
                {user ? (
                  <>
                    <Link
                      to={getDashboardPath()}
                      className="flex items-center gap-2 py-3 px-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <FiUser className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 w-full py-3 px-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition font-medium text-left"
                    >
                      <FiLogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 py-3 px-2 text-primary-600 hover:bg-primary-50 rounded-lg transition font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiUser className="w-5 h-5" />
                    Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
