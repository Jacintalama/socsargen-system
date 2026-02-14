import { Link } from 'react-router-dom';
import { FiTarget, FiStar, FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';

const Mission = () => {
  const missionPoints = [
    'Provide compassionate, patient-centered healthcare',
    'Deliver quality medical services that are accessible and affordable',
    'Treat every patient with dignity and respect',
    'Continuously improve and innovate our practices',
    'Enhance the health and well-being of our communities'
  ];

  const visionPoints = [
    'Be the leading healthcare institution in SOCCSKSARGEN',
    'Recognized for clinical excellence and innovation',
    'Set the benchmark for healthcare services in Southern Mindanao',
    'Make quality healthcare accessible to all',
    'Foster a culture of continuous learning and growth'
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
              Our Purpose
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mission & Vision
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl">
              Guiding our commitment to excellence in healthcare delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                  <FiTarget className="w-10 h-10 text-primary-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  To provide compassionate, patient-centered healthcare with excellence and integrity. We are dedicated to delivering quality medical services that are accessible and affordable, while treating every patient with dignity and respect.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Through continuous improvement and innovation, we strive to enhance the health and well-being of the communities we serve across the SOCCSKSARGEN region.
                </p>
              </div>

              <div className="bg-primary-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">We are committed to:</h3>
                <ul className="space-y-4">
                  {missionPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mt-0.5">
                        <FiCheck className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-accent-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">We aspire to:</h3>
                <ul className="space-y-4">
                  {visionPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center mt-0.5">
                        <FiCheck className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-1 md:order-2">
                <div className="w-20 h-20 bg-accent-100 rounded-2xl flex items-center justify-center mb-6">
                  <FiStar className="w-10 h-10 text-accent-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Vision</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  To be the leading healthcare institution in the SOCCSKSARGEN region, recognized for clinical excellence, innovative medical practices, and outstanding patient care.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We aspire to set the benchmark for healthcare services in Southern Mindanao, making quality healthcare accessible to all while fostering a culture of continuous learning and professional growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <blockquote className="text-2xl md:text-3xl font-light italic mb-6">
              "Leading with Innovation, Serving with Compassion"
            </blockquote>
            <p className="text-primary-200">
              - Socsargen County Hospital
            </p>
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
              Discover the values that guide our healthcare delivery.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/about/values"
                className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-lg"
              >
                Core Values
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about/leadership"
                className="inline-flex items-center gap-2 btn-outline px-6 py-3 rounded-lg"
              >
                Leadership
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mission;
