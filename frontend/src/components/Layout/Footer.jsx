import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram } from 'react-icons/fi';
import logo from '../../assets/newlogo.jfif';

/**
 * Footer - Official Socsargen County Hospital footer
 * Green background with contact info, quick links, and social media
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', to: '/' },
    { name: 'Our Services', to: '/services' },
    { name: 'Our Doctors', to: '/doctors' },
    { name: 'Careers', to: '/careers' },
    { name: 'Contact Us', to: '/contact' },
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
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-primary-800 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - Logo & Copyright */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logo}
                alt="Socsargen County Hospital Logo"
                className="h-14 w-14 object-contain bg-white rounded-full p-1"
              />
              <h3 className="text-lg font-bold uppercase tracking-wide">
                SOCSARGEN COUNTY HOSPITAL
              </h3>
            </div>
            <p className="text-primary-200 text-sm">
              "Leading with Innovation, Serving with Compassion"
            </p>
            <p className="text-primary-300 text-sm mt-4">
              &copy; {currentYear} Socsargen County Hospital
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-primary-200 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contact Information */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Contact Information</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin className="mt-1 flex-shrink-0 text-primary-300" size={16} />
                <span className="text-primary-200">
                  L. Arradaza St., Bula-Lagao Road, Lagao, General Santos City, Philippines, 9500
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="flex-shrink-0 text-primary-300" size={16} />
                <div className="text-primary-200">
                  <a href="tel:5538906" className="hover:text-white transition-colors">
                    553-8906
                  </a>
                  {' / '}
                  <a href="tel:5538907" className="hover:text-white transition-colors">
                    553-8907
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="flex-shrink-0 text-primary-300" size={16} />
                <a
                  href="tel:09326924708"
                  className="text-primary-200 hover:text-white transition-colors"
                >
                  0932-692-4708
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="flex-shrink-0 text-primary-300" size={16} />
                <a
                  href="mailto:edpsocsargen@gmail.com"
                  className="text-primary-200 hover:text-white transition-colors"
                >
                  edpsocsargen@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Connect With Us */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Connect With Us</h4>
            <p className="text-primary-200 text-sm mb-4">
              Follow us on social media for updates and health tips.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-700 hover:bg-primary-600 p-2.5 rounded-full transition-colors"
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
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-primary-300">
            <p>&copy; {currentYear} Socsargen County Hospital. All rights reserved.</p>
            <Link
              to="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
