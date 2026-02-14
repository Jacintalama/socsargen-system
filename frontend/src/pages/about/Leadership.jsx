import { Link } from 'react-router-dom';
import { FiUser, FiArrowLeft, FiArrowRight, FiMail, FiPhone } from 'react-icons/fi';

const Leadership = () => {
  // Board of Directors - 15 members
  const boardMembers = [
    { id: 1, name: 'Coming Soon', position: 'Chairman' },
    { id: 2, name: 'Coming Soon', position: 'Vice Chairman' },
    { id: 3, name: 'Coming Soon', position: 'Corporate Secretary' },
    { id: 4, name: 'Coming Soon', position: 'Treasurer' },
    { id: 5, name: 'Coming Soon', position: 'Board Member' },
    { id: 6, name: 'Coming Soon', position: 'Board Member' },
    { id: 7, name: 'Coming Soon', position: 'Board Member' },
    { id: 8, name: 'Coming Soon', position: 'Board Member' },
    { id: 9, name: 'Coming Soon', position: 'Board Member' },
    { id: 10, name: 'Coming Soon', position: 'Board Member' },
    { id: 11, name: 'Coming Soon', position: 'Board Member' },
    { id: 12, name: 'Coming Soon', position: 'Board Member' },
    { id: 13, name: 'Coming Soon', position: 'Board Member' },
    { id: 14, name: 'Coming Soon', position: 'Board Member' },
    { id: 15, name: 'Coming Soon', position: 'Board Member' }
  ];

  // Organizational hierarchy from highest to lowest (Executive and below)
  const hierarchy = [
    {
      level: 1,
      title: 'Executive Management',
      members: [
        {
          id: 101,
          name: 'Coming Soon',
          position: 'Hospital Director / CEO',
          description: 'Oversees all hospital operations and strategic direction'
        }
      ]
    },
    {
      level: 2,
      title: 'Medical Leadership',
      members: [
        {
          id: 102,
          name: 'Coming Soon',
          position: 'Medical Director',
          description: 'Leads medical staff and clinical excellence'
        },
        {
          id: 103,
          name: 'Coming Soon',
          position: 'Chief of Hospital',
          description: 'Manages day-to-day hospital operations'
        }
      ]
    },
    {
      level: 3,
      title: 'Department Heads',
      members: [
        {
          id: 104,
          name: 'Coming Soon',
          position: 'Chief Nursing Officer',
          description: 'Leads nursing services and patient care'
        },
        {
          id: 105,
          name: 'Coming Soon',
          position: 'Finance Director',
          description: 'Manages financial operations'
        },
        {
          id: 106,
          name: 'Coming Soon',
          position: 'HR Director',
          description: 'Oversees human resources'
        },
        {
          id: 107,
          name: 'Coming Soon',
          position: 'Administrative Officer',
          description: 'Handles administrative functions'
        }
      ]
    },
    {
      level: 4,
      title: 'Unit Supervisors',
      members: [
        {
          id: 108,
          name: 'Coming Soon',
          position: 'Emergency Room Supervisor',
          description: 'Manages ER operations'
        },
        {
          id: 109,
          name: 'Coming Soon',
          position: 'ICU Supervisor',
          description: 'Manages intensive care unit'
        },
        {
          id: 110,
          name: 'Coming Soon',
          position: 'Laboratory Supervisor',
          description: 'Oversees laboratory services'
        },
        {
          id: 111,
          name: 'Coming Soon',
          position: 'Radiology Supervisor',
          description: 'Manages imaging department'
        }
      ]
    }
  ];

  // Get card size based on level
  const getCardStyle = (level) => {
    switch (level) {
      case 1:
        return 'bg-gradient-to-br from-primary-500 to-primary-600 text-white p-6';
      case 2:
        return 'bg-primary-100 text-gray-800 p-5';
      case 3:
        return 'bg-gray-100 text-gray-800 p-4';
      case 4:
        return 'bg-gray-50 text-gray-800 p-4 border border-gray-200';
      default:
        return 'bg-gray-50 text-gray-800 p-4';
    }
  };

  const getIconStyle = (level) => {
    switch (level) {
      case 1:
        return 'w-16 h-16 bg-white/20 text-white';
      case 2:
        return 'w-14 h-14 bg-primary-200 text-primary-700';
      case 3:
        return 'w-12 h-12 bg-primary-100 text-primary-600';
      case 4:
        return 'w-10 h-10 bg-primary-50 text-primary-500';
      default:
        return 'w-10 h-10 bg-gray-200 text-gray-600';
    }
  };

  const getTextStyle = (level) => {
    if (level === 1) {
      return {
        position: 'text-lg font-bold',
        name: 'text-sm opacity-80',
        description: 'text-sm opacity-70'
      };
    }
    return {
      position: 'text-base font-semibold text-gray-800',
      name: 'text-sm text-gray-500',
      description: 'text-xs text-gray-500'
    };
  };

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
              Organizational Structure
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Leadership
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl">
              The dedicated leaders guiding Socsargen County Hospital towards excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-600 text-lg leading-relaxed">
              Our organizational structure ensures clear accountability and effective leadership at every level, from the Board of Directors to our dedicated unit supervisors.
            </p>
          </div>
        </div>
      </section>

      {/* Board of Directors - Tree Structure */}
      <section className="py-16 bg-gradient-to-br from-primary-700 to-primary-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block bg-accent-500 text-accent-900 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
                Governance
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Board of Directors
              </h2>
              <p className="text-primary-200 max-w-2xl mx-auto">
                Our board provides strategic oversight and governance based on stakeholder voting power.
              </p>
            </div>

            {/* Level 1: Chairman */}
            <div className="flex justify-center mb-6">
              <div className="bg-accent-500 text-accent-900 rounded-xl p-6 text-center min-w-[280px] shadow-lg">
                <div className="w-16 h-16 bg-accent-600/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiUser className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg">Chairman</h3>
                <p className="text-sm text-accent-800">Coming Soon</p>
              </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center mb-6">
              <div className="w-0.5 h-8 bg-white/30"></div>
            </div>

            {/* Level 2: Vice Chairman */}
            <div className="flex justify-center mb-6">
              <div className="bg-white/25 backdrop-blur-sm text-white rounded-xl p-5 text-center min-w-[250px] shadow-lg">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiUser className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-base">Vice Chairman</h3>
                <p className="text-sm text-primary-200">Coming Soon</p>
              </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center mb-2">
              <div className="w-0.5 h-6 bg-white/30"></div>
            </div>
            <div className="flex justify-center mb-6">
              <div className="w-[400px] max-w-[90%] h-0.5 bg-white/30"></div>
            </div>

            {/* Level 3: Secretary & Treasurer */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute left-1/2 -top-4 w-0.5 h-4 bg-white/30 -translate-x-1/2"></div>
                <div className="bg-white/20 backdrop-blur-sm text-white rounded-xl p-4 text-center min-w-[200px] shadow-lg">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FiUser className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-sm">Corporate Secretary</h3>
                  <p className="text-xs text-primary-200">Coming Soon</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute left-1/2 -top-4 w-0.5 h-4 bg-white/30 -translate-x-1/2"></div>
                <div className="bg-white/20 backdrop-blur-sm text-white rounded-xl p-4 text-center min-w-[200px] shadow-lg">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FiUser className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-sm">Treasurer</h3>
                  <p className="text-xs text-primary-200">Coming Soon</p>
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center mb-2">
              <div className="w-0.5 h-6 bg-white/30"></div>
            </div>
            <div className="flex justify-center mb-6">
              <div className="w-[90%] max-w-[800px] h-0.5 bg-white/30"></div>
            </div>

            {/* Level 4: Board Members */}
            <div className="text-center mb-4">
              <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Board Members
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {[...Array(11)].map((_, index) => (
                <div key={index} className="relative">
                  <div className="absolute left-1/2 -top-3 w-0.5 h-3 bg-white/30 -translate-x-1/2"></div>
                  <div className="bg-white/10 backdrop-blur-sm text-white rounded-lg p-3 text-center min-w-[140px] shadow hover:bg-white/15 transition-colors">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiUser className="w-5 h-5" />
                    </div>
                    <h3 className="font-medium text-xs">Board Member</h3>
                    <p className="text-xs text-primary-300">Coming Soon</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Organizational Hierarchy Tree */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Title */}
            <div className="text-center mb-12">
              <span className="inline-block text-primary-600 text-sm font-semibold uppercase tracking-wider mb-3">
                Management Structure
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Organizational Hierarchy
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                From executive leadership to unit supervisors, our team works together to deliver exceptional healthcare.
              </p>
            </div>

            {hierarchy.map((level, levelIndex) => (
              <div key={level.level} className="relative">
                {/* Vertical connector line */}
                {levelIndex > 0 && (
                  <div className="absolute left-1/2 -top-8 w-0.5 h-8 bg-primary-300 -translate-x-1/2"></div>
                )}

                {/* Level Label */}
                <div className="text-center mb-6">
                  <span className="inline-block bg-primary-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    {level.title}
                  </span>
                </div>

                {/* Members Grid */}
                <div className={`flex flex-wrap justify-center gap-4 mb-12 ${level.members.length === 1 ? '' : 'max-w-5xl mx-auto'}`}>
                  {level.members.map((member, memberIndex) => {
                    const cardStyle = getCardStyle(level.level);
                    const iconStyle = getIconStyle(level.level);
                    const textStyle = getTextStyle(level.level);

                    return (
                      <div key={member.id} className="relative">
                        {/* Horizontal connector for multiple members */}
                        {level.members.length > 1 && levelIndex > 0 && (
                          <div className="absolute left-1/2 -top-4 w-0.5 h-4 bg-primary-300 -translate-x-1/2"></div>
                        )}

                        <div
                          className={`rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-center ${cardStyle} ${
                            level.level === 1 ? 'min-w-[300px] max-w-[350px]' :
                            level.level === 2 ? 'min-w-[280px] max-w-[320px]' :
                            level.level === 3 ? 'min-w-[220px] max-w-[260px]' :
                            'min-w-[180px] max-w-[220px]'
                          }`}
                        >
                          <div className={`${iconStyle} rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <FiUser className={level.level === 1 ? 'w-8 h-8' : level.level === 2 ? 'w-7 h-7' : 'w-6 h-6'} />
                          </div>
                          <h3 className={textStyle.position}>{member.position}</h3>
                          <p className={`${textStyle.name} mt-1`}>{member.name}</p>
                          {level.level <= 2 && (
                            <p className={`${textStyle.description} mt-2`}>{member.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Horizontal connector line for branching */}
                {levelIndex < hierarchy.length - 1 && hierarchy[levelIndex + 1].members.length > 1 && (
                  <div className="relative h-4 mb-4">
                    <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-primary-300 -translate-x-1/2"></div>
                    <div
                      className="absolute top-4 left-1/2 -translate-x-1/2 h-0.5 bg-primary-300"
                      style={{
                        width: `${Math.min(hierarchy[levelIndex + 1].members.length * 200, 800)}px`,
                        maxWidth: '90%'
                      }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Notice */}
      <section className="py-12 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Leadership Profiles Coming Soon</h3>
            <p className="text-gray-600">
              We are currently updating our leadership profiles with photos and detailed information. Please check back soon.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Leadership */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Get in Touch with Our Team
              </h2>
              <p className="text-primary-100 mb-8 max-w-xl mx-auto">
                Have questions or need to reach our leadership team? Contact our administration office.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="tel:553-8906"
                  className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
                >
                  <FiPhone className="w-5 h-5" />
                  Call: 553-8906
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
                >
                  <FiMail className="w-5 h-5" />
                  Contact Form
                </Link>
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
              Learn about our certifications and qualifications.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/about/accreditations"
                className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-lg"
              >
                Accreditations
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/careers"
                className="inline-flex items-center gap-2 btn-outline px-6 py-3 rounded-lg"
              >
                Careers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Leadership;
