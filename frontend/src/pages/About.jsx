import { Link } from 'react-router-dom';
import {
  FiHeart,
  FiStar,
  FiShield,
  FiTarget,
  FiAward,
  FiUsers,
  FiClock,
  FiActivity,
  FiCheckCircle,
  FiArrowRight,
  FiMapPin,
  FiCalendar,
  FiTrendingUp,
  FiUser
} from 'react-icons/fi';

const About = () => {
  // Core Values Data
  const coreValues = [
    {
      id: 1,
      title: 'Compassion',
      description: 'We treat every patient with empathy, kindness, and genuine care, understanding that healing begins with a caring heart.',
      icon: <FiHeart className="w-6 h-6 sm:w-8 sm:h-8" />
    },
    {
      id: 2,
      title: 'Excellence',
      description: 'We strive for the highest standards in medical care, continuously improving our services and practices.',
      icon: <FiStar className="w-6 h-6 sm:w-8 sm:h-8" />
    },
    {
      id: 3,
      title: 'Integrity',
      description: 'We uphold honesty, transparency, and ethical conduct in all our interactions with patients and colleagues.',
      icon: <FiShield className="w-6 h-6 sm:w-8 sm:h-8" />
    },
    {
      id: 4,
      title: 'Innovation',
      description: 'We embrace modern medical technologies and methodologies to provide cutting-edge healthcare solutions.',
      icon: <FiTrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />
    },
    {
      id: 5,
      title: 'Patient-Centered Care',
      description: 'We put patients at the heart of everything we do, ensuring personalized care that addresses individual needs.',
      icon: <FiTarget className="w-6 h-6 sm:w-8 sm:h-8" />
    },
    {
      id: 6,
      title: 'Teamwork',
      description: 'We collaborate across departments to deliver comprehensive, coordinated care for optimal patient outcomes.',
      icon: <FiUsers className="w-6 h-6 sm:w-8 sm:h-8" />
    }
  ];

  // Accreditations Data
  const accreditations = [
    {
      id: 1,
      title: 'ISO 9001:2015 Certified',
      description: 'Quality Management System certification for our OFW Clinic, demonstrating our commitment to international quality standards.',
      icon: <FiAward className="w-6 h-6 sm:w-8 sm:h-8" />
    },
    {
      id: 2,
      title: 'DOH Accredited',
      description: 'Licensed and accredited by the Department of Health as a tertiary hospital meeting national healthcare standards.',
      icon: <FiCheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
    },
    {
      id: 3,
      title: 'PhilHealth Accredited',
      description: 'Accredited healthcare provider ensuring accessible and affordable medical services for all PhilHealth members.',
      icon: <FiShield className="w-6 h-6 sm:w-8 sm:h-8" />
    },
    {
      id: 4,
      title: 'POEA/MARINA Accredited',
      description: 'Authorized medical facility for Overseas Filipino Workers (OFW) and seafarers pre-employment medical examinations.',
      icon: <FiActivity className="w-6 h-6 sm:w-8 sm:h-8" />
    }
  ];

  // Hospital Statistics
  const hospitalStats = [
    {
      id: 1,
      value: '30+',
      label: 'Years of Service',
      icon: <FiCalendar className="w-4 h-4 sm:w-6 sm:h-6" />
    },
    {
      id: 2,
      value: '100+',
      label: 'Medical Experts',
      icon: <FiUsers className="w-4 h-4 sm:w-6 sm:h-6" />
    },
    {
      id: 3,
      value: '14',
      label: 'Medical Departments',
      icon: <FiActivity className="w-4 h-4 sm:w-6 sm:h-6" />
    },
    {
      id: 4,
      value: '24/7',
      label: 'Emergency Services',
      icon: <FiClock className="w-4 h-4 sm:w-6 sm:h-6" />
    }
  ];

  // Milestones Data
  const milestones = [
    {
      year: '1992',
      title: 'Hospital Founded',
      description: 'Socsargen County Hospital was established to serve the healthcare needs of General Santos City and the SOCCSKSARGEN region.'
    },
    {
      year: '2000',
      title: 'Tertiary Hospital Status',
      description: 'Achieved tertiary hospital accreditation, expanding our capacity to provide advanced medical services.'
    },
    {
      year: '2015',
      title: 'ISO Certification',
      description: 'Our OFW Clinic received ISO 9001:2015 certification for quality management systems.'
    },
    {
      year: '2022',
      title: '30 Years of Excellence',
      description: 'Celebrated three decades of compassionate healthcare service to the community.'
    },
    {
      year: '2023',
      title: 'Medical Milestone',
      description: 'Successfully performed historic awake brain surgeries, a first in Region 12.'
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Section 1: Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-14 sm:py-24 md:py-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-3 sm:px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-accent-500 text-accent-900 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 rounded-full mb-4 sm:mb-6">
              Established 1992
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-6 leading-tight">
              About Socsargen County Hospital
            </h1>
            <p className="text-sm sm:text-xl md:text-2xl mb-5 sm:mb-8 text-primary-100 font-light max-w-3xl mx-auto">
              Welcome to Socsargen County Hospital! Here, you're more than just a patient, you're family.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-5 sm:px-8 py-2.5 sm:py-4 rounded-lg text-sm sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get in Touch
                <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 bg-primary-500 text-white hover:bg-primary-400 font-semibold px-5 sm:px-8 py-2.5 sm:py-4 rounded-lg text-sm sm:text-lg transition-all duration-300 border-2 border-white/20"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/10 to-transparent"></div>
      </section>

      {/* Section 2: History & Milestones */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-12 items-start">
              {/* History Text */}
              <div>
                <span className="inline-block text-primary-600 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2 sm:mb-3 w-full text-center md:text-left">
                  Our Story
                </span>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-6 text-center md:text-left">
                  A Legacy of Healing
                </h2>
                <div className="space-y-3 sm:space-y-4 text-gray-600 text-sm sm:text-lg leading-relaxed">
                  <p className="text-justify">
                    Since our establishment in <strong className="text-primary-700">1992</strong>, Socsargen County Hospital has been at the forefront of healthcare excellence in the SOCCSKSARGEN region.
                  </p>
                  <p className="text-justify">
                    As a private, <strong className="text-primary-700">ISO-accredited tertiary hospital</strong> located in the heart of General Santos City, we have been setting the standards of healthcare in Region 12 for over three decades.
                  </p>
                  <p className="text-justify">
                    Our commitment to providing quality, compassionate care has made us a trusted healthcare partner for thousands of families across Southern Mindanao.
                  </p>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 mt-4 sm:mt-6 text-gray-500 text-sm sm:text-base">
                  <FiMapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                  <span>General Santos City, SOCCSKSARGEN Region</span>
                </div>
              </div>

              {/* Milestones Timeline */}
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-8">
                <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                  Key Milestones
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex gap-3 sm:gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="text-primary-700 font-bold text-xs sm:text-sm">{milestone.year}</span>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{milestone.title}</h4>
                        <p className="text-gray-500 text-xs sm:text-sm">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Mission & Vision */}
      <section className="py-8 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 sm:mb-12">
              <span className="inline-block text-primary-600 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2 sm:mb-3">
                Our Purpose
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                Mission & Vision
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
              {/* Mission Card */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-lg border-l-4 border-primary-500 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-6">
                  <FiTarget className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">Our Mission</h3>
                <p className="text-gray-600 text-sm sm:text-lg leading-relaxed">
                  To provide compassionate, patient-centered healthcare with excellence and integrity. We are dedicated to delivering quality medical services that are accessible and affordable, while treating every patient with dignity and respect. Through continuous improvement and innovation, we strive to enhance the health and well-being of the communities we serve.
                </p>
              </div>

              {/* Vision Card */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-lg border-l-4 border-accent-500 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-6">
                  <FiStar className="w-6 h-6 sm:w-8 sm:h-8 text-accent-600" />
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">Our Vision</h3>
                <p className="text-gray-600 text-sm sm:text-lg leading-relaxed">
                  To be the leading healthcare institution in the SOCCSKSARGEN region, recognized for clinical excellence, innovative medical practices, and outstanding patient care. We aspire to set the benchmark for healthcare services in Southern Mindanao, making quality healthcare accessible to all while fostering a culture of continuous learning and professional growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Core Values */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 sm:mb-12">
              <span className="inline-block text-primary-600 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2 sm:mb-3">
                What We Stand For
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
                Our Core Values
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg max-w-3xl mx-auto">
                These guiding principles shape our culture and define how we deliver healthcare to our community.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {coreValues.map((value) => (
                <div
                  key={value.id}
                  className="bg-white border-2 border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-6 hover:border-primary-300 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-primary-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-sm sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2 group-hover:text-primary-600 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Accreditations & Certifications */}
      <section className="py-8 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 sm:mb-12">
              <span className="inline-block text-primary-600 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2 sm:mb-3">
                Quality Assurance
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
                Accreditations & Certifications
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg max-w-3xl mx-auto">
                Our certifications reflect our unwavering commitment to maintaining the highest standards of healthcare quality and patient safety.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-6">
              {accreditations.map((accreditation) => (
                <div
                  key={accreditation.id}
                  className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex gap-3 sm:gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white">
                      {accreditation.icon}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">
                      {accreditation.title}
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                      {accreditation.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Leadership Placeholder */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 sm:mb-12">
              <span className="inline-block text-primary-600 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2 sm:mb-3">
                Meet the Team
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
                Our Leadership
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg max-w-3xl mx-auto">
                Our experienced leadership team is dedicated to guiding Socsargen County Hospital towards excellence in healthcare delivery.
              </p>
            </div>

            {/* Leadership Placeholder Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              {[
                { role: 'Hospital Director', placeholder: 'Coming Soon' },
                { role: 'Medical Director', placeholder: 'Coming Soon' },
                { role: 'Chief of Hospital', placeholder: 'Coming Soon' }
              ].map((leader, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-8 text-center hover:bg-gray-100 transition-colors duration-300"
                >
                  <div className="w-14 h-14 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                    <FiUser className="w-7 h-7 sm:w-12 sm:h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-[10px] sm:text-sm mb-1 sm:mb-2">{leader.placeholder}</p>
                  <h3 className="text-xs sm:text-lg font-semibold text-gray-800">{leader.role}</h3>
                </div>
              ))}
            </div>

            <div className="text-center mt-4 sm:mt-8">
              <p className="text-gray-500 text-xs sm:text-sm">
                Leadership profiles coming soon. Stay tuned for updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Hospital Statistics */}
      <section className="py-8 sm:py-16 bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 sm:mb-12">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
                Our Impact in Numbers
              </h2>
              <p className="text-primary-100 text-sm sm:text-lg max-w-2xl mx-auto">
                Decades of dedicated service to the SOCCSKSARGEN community
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {hospitalStats.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-6 text-center hover:bg-white/20 transition-colors duration-300"
                >
                  <div className="w-9 h-9 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-accent-400 mb-1 sm:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-primary-100 text-xs sm:text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-12 text-center">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">
                Ready to Experience Quality Healthcare?
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg mb-4 sm:mb-8 max-w-2xl mx-auto">
                Join the thousands of families who trust Socsargen County Hospital for their healthcare needs. We are here to serve you with compassion and excellence.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <Link
                  to="/doctors"
                  className="inline-flex items-center justify-center gap-2 btn-primary px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-lg"
                >
                  Find a Doctor
                  <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 btn-outline px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-lg"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
