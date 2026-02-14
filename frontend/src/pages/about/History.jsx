import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

// Milestone images - replace these with actual historical photos
import hero1Img from '../../assets/hero1.jpg';
import hero3Img from '../../assets/hero3.jpg';
import hero4Img from '../../assets/hero4.jpg';
import hero5Img from '../../assets/hero5.jpg';
import hero6Img from '../../assets/hero6.jpg';
import hospitalAerialImg from '../../assets/hospital-aerial.jpg';

const History = () => {
  const milestones = [
    {
      year: '2025',
      title: 'Continuing Excellence',
      description: 'Continuing our commitment to healthcare excellence with expanded services, advanced medical technologies, and dedication to serving the SOCCSKSARGEN region.',
      image: hero1Img  // Replace with milestone-2025.jpg
    },
    {
      year: '2023',
      title: 'Medical Milestone',
      description: 'Successfully performed historic awake brain surgeries, a first in Region 12, showcasing our commitment to advanced medical procedures.',
      image: hero3Img  // Replace with milestone-2023.jpg
    },
    {
      year: '2022',
      title: '30 Years of Excellence',
      description: 'Celebrated three decades of compassionate healthcare service to the community, marking a significant milestone in our history.',
      image: hero4Img  // Replace with milestone-2022.jpg
    },
    {
      year: '2020',
      title: 'COVID-19 Response',
      description: 'Stood at the frontlines of the pandemic response, providing critical care and establishing dedicated COVID-19 treatment facilities.',
      image: hero5Img  // Replace with milestone-2020.jpg
    },
    {
      year: '2015',
      title: 'ISO Certification',
      description: 'Our OFW Clinic received ISO 9001:2015 certification for quality management systems, demonstrating our commitment to international standards.',
      image: hero6Img  // Replace with milestone-2015.jpg
    },
    {
      year: '2010',
      title: 'Modern Facilities',
      description: 'Upgraded facilities with state-of-the-art medical equipment including advanced imaging and diagnostic technologies.',
      image: hero1Img  // Replace with milestone-2010.jpg
    },
    {
      year: '2000',
      title: 'Tertiary Hospital Status',
      description: 'Achieved tertiary hospital accreditation from the Department of Health, expanding our capacity to provide advanced medical services and specialized care.',
      image: hero3Img  // Replace with milestone-2000.jpg
    },
    {
      year: '1998',
      title: 'Expansion of Services',
      description: 'Added new departments including Pediatrics, OB-Gynecology, and Surgery to better serve the growing needs of the community.',
      image: hero4Img  // Replace with milestone-1998.jpg
    },
    {
      year: '1992',
      title: 'Hospital Founded',
      description: 'Socsargen County Hospital was established to serve the healthcare needs of General Santos City and the SOCCSKSARGEN region. Starting with basic medical services, the hospital began its journey of serving the community.',
      image: hospitalAerialImg  // Replace with milestone-1992.jpg
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/about" className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-6 transition-colors">
            <FiArrowLeft className="w-4 h-4" />
            Back to About Us
          </Link>
          <div className="max-w-4xl">
            <span className="inline-block bg-accent-500 text-accent-900 text-sm font-semibold px-4 py-1 rounded-full mb-4">
              Since 1992
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              History & Milestones
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl">
              Over three decades of dedicated healthcare service to the SOCCSKSARGEN region.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6 text-gray-500">
              <FiMapPin className="w-5 h-5 text-primary-600" />
              <span>General Santos City, SOCCSKSARGEN Region</span>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-6">A Legacy of Healing</h2>

            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                Since our establishment in <strong className="text-primary-700">1992</strong>, Socsargen County Hospital has been at the forefront of healthcare excellence in the SOCCSKSARGEN region. What began as a modest healthcare facility has grown into one of the most trusted medical institutions in Southern Mindanao.
              </p>
              <p>
                As a private, <strong className="text-primary-700">ISO-accredited tertiary hospital</strong> located in the heart of General Santos City, we have been setting the standards of healthcare in Region 12 for over three decades. Our journey has been marked by continuous growth, innovation, and an unwavering commitment to our patients.
              </p>
              <p>
                Through the years, we have expanded our services, upgraded our facilities, and invested in the professional development of our medical staff. Today, we stand proud as a comprehensive healthcare institution with <strong className="text-primary-700">14 specialized departments</strong> and over <strong className="text-primary-700">100 medical professionals</strong> dedicated to serving our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-primary-600 text-sm font-semibold uppercase tracking-wider mb-3">
                Our Journey
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Key Milestones
              </h2>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200 hidden md:block"></div>

              {/* Timeline Items */}
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex gap-6 md:gap-8">
                    {/* Year Badge */}
                    <div className="flex-shrink-0 relative z-10">
                      <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">{milestone.year}</span>
                      </div>
                    </div>

                    {/* Content with Image */}
                    <div className="flex-grow bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                      <div className="md:flex">
                        {/* Image */}
                        <div className="md:w-1/3 h-48 md:h-auto">
                          <img
                            src={milestone.image}
                            alt={milestone.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Text Content */}
                        <div className="p-6 md:w-2/3 flex flex-col justify-center">
                          <span className="text-primary-600 font-bold text-2xl mb-1">{milestone.year}</span>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{milestone.title}</h3>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Continue Exploring
            </h2>
            <p className="text-gray-600 mb-8">
              Learn more about what drives us and how we serve our community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/about/mission"
                className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-lg"
              >
                Mission & Vision
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about/values"
                className="inline-flex items-center gap-2 btn-outline px-6 py-3 rounded-lg"
              >
                Core Values
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default History;
