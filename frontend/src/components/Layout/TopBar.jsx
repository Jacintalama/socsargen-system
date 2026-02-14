import { FiFacebook, FiInstagram, FiPhone, FiMapPin } from 'react-icons/fi';

/**
 * TopBar - Top information bar with contact info and social links
 * Blue background with address, phone, and social media links
 */
const TopBar = () => {
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
    }
  ];

  return (
    <div className="bg-primary-600 text-white text-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {/* Left: Address */}
          <div className="flex items-center gap-1.5 text-primary-100 min-w-0">
            <FiMapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline truncate">
              L. Arradaza St., Bula-Lagao Road, Lagao, General Santos City
            </span>
            <span className="sm:hidden">General Santos City</span>
          </div>

          {/* Right: Phone, Contact Us, Social Icons - single line */}
          <div className="flex items-center gap-2 md:gap-4 text-primary-100 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <FiPhone className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <a
                href="tel:09560369408"
                className="hover:text-white transition-colors whitespace-nowrap"
              >
                0956-036-9408
              </a>
            </div>
            <a
              href="#contact"
              className="hidden md:inline hover:text-white transition-colors whitespace-nowrap"
            >
              Contact Us
            </a>
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label={`Follow us on ${link.name}`}
              >
                <link.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
