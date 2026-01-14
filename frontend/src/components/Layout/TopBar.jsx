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
    },
    {
      name: 'TikTok',
      href: 'https://www.tiktok.com/@ppiaaya/video/7150000371698519322',
      // Custom TikTok SVG icon since react-icons doesn't have FiTikTok
      icon: null,
      customIcon: (
        <svg
          className="w-4 h-4"
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
    <div className="bg-primary-600 text-white text-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between py-2 gap-2">
          {/* Address and Phone */}
          <div className="flex flex-wrap items-center gap-4 text-primary-100">
            <div className="flex items-center gap-1.5">
              <FiMapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">
                L. Arradaza St., Bula-Lagao Road, Lagao, General Santos City
              </span>
              <span className="sm:hidden">General Santos City</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiPhone className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <a
                href="tel:09560369408"
                className="hover:text-white transition-colors"
              >
                0956-036-9408
              </a>
            </div>
          </div>

          {/* Right Side Links */}
          <div className="flex items-center gap-4">
            {/* Contact Us Link */}
            <a
              href="#contact"
              className="hidden md:inline text-primary-100 hover:text-white transition-colors"
            >
              Contact Us
            </a>

            {/* Social Media Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-100 hover:text-white transition-colors"
                  aria-label={`Follow us on ${link.name}`}
                >
                  {link.icon ? (
                    <link.icon className="w-4 h-4" />
                  ) : (
                    link.customIcon
                  )}
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
