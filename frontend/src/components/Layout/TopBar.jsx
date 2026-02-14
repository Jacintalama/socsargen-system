import { FiFacebook, FiInstagram, FiPhone, FiMapPin } from 'react-icons/fi';

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
    <div className="bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 text-white text-xs">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-1.5">
          {/* Left: Address */}
          <div className="flex items-center gap-1.5 text-primary-200/80 min-w-0">
            <FiMapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline truncate tracking-wide">
              L. Arradaza St., Bula-Lagao Road, Lagao, General Santos City
            </span>
            <span className="sm:hidden tracking-wide">General Santos City</span>
          </div>

          {/* Right: Phone, Contact, Social */}
          <div className="flex items-center gap-3 md:gap-5 text-primary-200/80 flex-shrink-0">
            <a
              href="tel:09560369408"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <FiPhone className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap tracking-wide">0956-036-9408</span>
            </a>
            <span className="hidden md:inline text-primary-500/50">|</span>
            <a
              href="#contact"
              className="hidden md:inline hover:text-white transition-colors tracking-wide"
            >
              Contact Us
            </a>
            <span className="hidden md:inline text-primary-500/50">|</span>
            <div className="flex items-center gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  aria-label={`Follow us on ${link.name}`}
                >
                  <link.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
