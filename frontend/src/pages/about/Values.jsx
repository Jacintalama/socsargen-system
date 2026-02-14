import { Link } from 'react-router-dom';
import { FiHeart, FiStar, FiShield, FiTarget, FiUsers, FiTrendingUp, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const Values = () => {
  const coreValues = [
    {
      id: 1,
      title: 'Compassion',
      description: 'We treat every patient with empathy, kindness, and genuine care, understanding that healing begins with a caring heart. Our staff is trained to provide not just medical treatment but emotional support to patients and their families.',
      icon: <FiHeart className="w-8 h-8" />,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 2,
      title: 'Excellence',
      description: 'We strive for the highest standards in medical care, continuously improving our services and practices. From our medical procedures to patient interactions, we aim for excellence in everything we do.',
      icon: <FiStar className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 3,
      title: 'Integrity',
      description: 'We uphold honesty, transparency, and ethical conduct in all our interactions with patients and colleagues. Trust is the foundation of healthcare, and we work hard to maintain it every day.',
      icon: <FiShield className="w-8 h-8" />,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 4,
      title: 'Innovation',
      description: 'We embrace modern medical technologies and methodologies to provide cutting-edge healthcare solutions. Staying current with medical advances allows us to offer the best possible care.',
      icon: <FiTrendingUp className="w-8 h-8" />,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 5,
      title: 'Patient-Centered Care',
      description: 'We put patients at the heart of everything we do, ensuring personalized care that addresses individual needs. Every treatment plan is tailored to the unique circumstances of each patient.',
      icon: <FiTarget className="w-8 h-8" />,
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 6,
      title: 'Teamwork',
      description: 'We collaborate across departments to deliver comprehensive, coordinated care for optimal patient outcomes. Our multidisciplinary approach ensures that patients receive well-rounded medical attention.',
      icon: <FiUsers className="w-8 h-8" />,
      color: 'from-cyan-500 to-blue-500'
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
              What We Stand For
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Core Values
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl">
              The guiding principles that shape our culture and define how we deliver healthcare.
            </p>
          </div>
        </div>
      </section>

      {/* Values Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-600 text-lg leading-relaxed">
              At Socsargen County Hospital, our core values are more than just words on a wall. They are the principles that guide every decision we make, every interaction we have, and every treatment we provide. These values unite our team and inspire us to deliver exceptional healthcare every day.
            </p>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreValues.map((value) => (
                <div
                  key={value.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Card Header */}
                  <div className={`h-2 bg-gradient-to-r ${value.color}`}></div>

                  <div className="p-8">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {value.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values in Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Values in Action</h2>
              <p className="text-gray-600 text-lg">
                How we bring our values to life every day
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-2">Patient Care</h3>
                <p className="text-gray-600">
                  Every patient interaction reflects our commitment to compassion and excellence. From the moment you walk through our doors, you'll experience care that is warm, professional, and patient-centered.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-2">Medical Practice</h3>
                <p className="text-gray-600">
                  Our physicians and medical staff uphold the highest standards of integrity and innovation. We continuously update our knowledge and skills to provide cutting-edge treatments while maintaining ethical practices.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-2">Team Collaboration</h3>
                <p className="text-gray-600">
                  Our multidisciplinary teams work together seamlessly, combining expertise from different specialties to ensure comprehensive care for complex medical conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Continue Exploring
            </h2>
            <p className="text-gray-600 mb-8">
              Meet the people who lead our organization.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/about/leadership"
                className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-lg"
              >
                Leadership
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about/accreditations"
                className="inline-flex items-center gap-2 btn-outline px-6 py-3 rounded-lg"
              >
                Accreditations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Values;
