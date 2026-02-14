import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiArrowRight } from 'react-icons/fi';
import logo from '../../assets/newlogo.jfif';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', to: '/' },
    { name: 'Our Services', to: '/services' },
    { name: 'Our Doctors', to: '/doctors' },
    { name: 'News & Events', to: '/news' },
    { name: 'Careers', to: '/careers' },
    { name: 'Contact Us', to: '/contact' },
  ];

  const serviceLinks = [
    { name: 'Emergency Care', to: '/services' },
    { name: 'Cardiology', to: '/services' },
    { name: 'Laboratory', to: '/services' },
    { name: 'Radiology', to: '/services' },
    { name: 'Surgery', to: '/services' },
    { name: 'ICU', to: '/services' },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/SocsargenCountyHospitalOfficial/',
      icon: FiFacebook
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/explore/locations/111506110436043/soccsksargen-general-hospital/',
      icon: FiInstagram
    },
    {
      name: 'TikTok',
      href: 'https://www.tiktok.com/@ppiaaya/video/7150000371698519322',
      icon: null,
      customIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-primary-900 to-gray-950 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1 - Logo & Tagline (wider) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={logo}
                alt="Socsargen County Hospital Logo"
                className="h-14 w-14 object-contain bg-white rounded-full p-1 shadow-lg"
              />
              <div>
                <h3 className="text-lg font-extrabold uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                  SOCSARGEN
                </h3>
                <p className="text-primary-300 text-xs tracking-widest uppercase">County Hospital</p>
              </div>
            </div>
            <p className="text-primary-300/80 text-sm leading-relaxed mb-6 max-w-xs">
              Leading with Innovation, Serving with Compassion. Providing quality healthcare to the people of General Santos City and Region 12 since 1992.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
                  aria-label={`Follow us on ${link.name}`}
                >
                  {link.icon ? (
                    <link.icon className="w-5 h-5" />
                  ) : (
                    link.customIcon
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-5 text-white" style={{ fontFamily: 'var(--font-display)' }}>Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-primary-300/70 hover:text-white transition-colors text-sm flex items-center gap-1.5 group"
                  >
                    <FiArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Services */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-5 text-white" style={{ fontFamily: 'var(--font-display)' }}>Services</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-primary-300/70 hover:text-white transition-colors text-sm flex items-center gap-1.5 group"
                  >
                    <FiArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div className="lg:col-span-4">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-5 text-white" style={{ fontFamily: 'var(--font-display)' }}>Contact Information</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiMapPin className="text-primary-400" size={16} />
                </div>
                <span className="text-primary-300/80">
                  L. Arradaza St., Bula-Lagao Road, Lagao, General Santos City, Philippines, 9500
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiPhone className="text-primary-400" size={16} />
                </div>
                <div className="text-primary-300/80">
                  <a href="tel:5538906" className="hover:text-white transition-colors">553-8906</a>
                  {' / '}
                  <a href="tel:5538907" className="hover:text-white transition-colors">553-8907</a>
                  <br />
                  <a href="tel:09326924708" className="hover:text-white transition-colors">0932-692-4708</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-primary-400" size={16} />
                </div>
                <a
                  href="mailto:edpsocsargen@gmail.com"
                  className="text-primary-300/80 hover:text-white transition-colors"
                >
                  edpsocsargen@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-400/60">
            <p>&copy; {currentYear} Socsargen County Hospital. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span>|</span>
              <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
