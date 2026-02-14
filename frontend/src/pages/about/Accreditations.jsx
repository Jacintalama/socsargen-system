import { Link } from 'react-router-dom';
import { FiAward, FiCheckCircle, FiShield, FiActivity, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const Accreditations = () => {
  const accreditations = [
    {
      id: 1,
      title: 'ISO 9001:2015 Certified',
      organization: 'International Organization for Standardization',
      description: 'Quality Management System certification for our OFW Clinic, demonstrating our commitment to international quality standards. This certification ensures that our processes and services meet rigorous global benchmarks.',
      icon: <FiAward className="w-10 h-10" />,
      color: 'from-yellow-500 to-amber-500',
      year: '2015'
    },
    {
      id: 2,
      title: 'DOH Licensed Tertiary Hospital',
      organization: 'Department of Health - Philippines',
      description: 'Licensed and accredited by the Department of Health as a tertiary hospital meeting national healthcare standards. This accreditation allows us to provide advanced medical services and specialized care.',
      icon: <FiCheckCircle className="w-10 h-10" />,
      color: 'from-green-500 to-emerald-500',
      year: '2000'
    },
    {
      id: 3,
      title: 'PhilHealth Accredited',
      organization: 'Philippine Health Insurance Corporation',
      description: 'Accredited healthcare provider ensuring accessible and affordable medical services for all PhilHealth members. Our patients can avail of PhilHealth benefits for various medical services and procedures.',
      icon: <FiShield className="w-10 h-10" />,
      color: 'from-blue-500 to-indigo-500',
      year: 'Active'
    },
    {
      id: 4,
      title: 'POEA/MARINA Accredited',
      organization: 'Philippine Overseas Employment Administration / Maritime Industry Authority',
      description: 'Authorized medical facility for Overseas Filipino Workers (OFW) and seafarers pre-employment medical examinations. We provide comprehensive PEME services meeting international maritime and employment standards.',
      icon: <FiActivity className="w-10 h-10" />,
      color: 'from-purple-500 to-violet-500',
      year: 'Active'
    }
  ];

  const certificationBenefits = [
    {
      title: 'Quality Assurance',
      description: 'Our certifications ensure that every service we provide meets strict quality standards.'
    },
    {
      title: 'Patient Safety',
      description: 'Accreditation requirements prioritize patient safety in all our procedures and protocols.'
    },
    {
      title: 'Continuous Improvement',
      description: 'Regular audits and assessments drive us to continuously improve our services.'
    },
    {
      title: 'Trust & Credibility',
      description: 'Our accreditations demonstrate our commitment to excellence and build patient trust.'
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
              Quality Assurance
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Accreditations & Certifications
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl">
              Our commitment to maintaining the highest standards of healthcare quality.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-600 text-lg leading-relaxed">
              At Socsargen County Hospital, we take pride in our numerous accreditations and certifications. These recognitions reflect our unwavering commitment to delivering quality healthcare services that meet both national and international standards.
            </p>
          </div>
        </div>
      </section>

      {/* Accreditations Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {accreditations.map((accreditation) => (
                <div
                  key={accreditation.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className={`h-2 bg-gradient-to-r ${accreditation.color}`}></div>

                  <div className="p-8">
                    <div className="flex items-start gap-6">
                      <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${accreditation.color} flex items-center justify-center text-white flex-shrink-0`}>
                        {accreditation.icon}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {accreditation.year}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {accreditation.title}
                        </h3>
                        <p className="text-primary-600 text-sm font-medium mb-3">
                          {accreditation.organization}
                        </p>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {accreditation.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                What Our Accreditations Mean for You
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our certifications translate to tangible benefits for every patient we serve.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certificationBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-primary-50 rounded-xl p-6 text-center hover:bg-primary-100 transition-colors duration-300"
                >
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OFW Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center">
                    <FiAward className="w-12 h-12" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    ISO-Certified OFW Clinic
                  </h2>
                  <p className="text-primary-100 mb-6">
                    Our OFW Clinic is ISO 9001:2015 certified, ensuring that overseas Filipino workers receive pre-employment medical examinations that meet international standards. We are authorized by POEA and MARINA to conduct comprehensive medical assessments.
                  </p>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
                  >
                    View Our Services
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
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
              Experience Quality Healthcare
            </h2>
            <p className="text-gray-600 mb-8">
              Trust in our accredited services for your healthcare needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-lg"
              >
                Find a Doctor
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 btn-outline px-6 py-3 rounded-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accreditations;
