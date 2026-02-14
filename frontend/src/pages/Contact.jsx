import { useState } from 'react';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      firstName: '',
      lastName: '',
      contactNumber: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-10 sm:py-16">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">Contact Us</h1>
          <p className="text-sm sm:text-xl text-primary-100 max-w-2xl mx-auto">
            We are here to take care of you
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-6 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid lg:grid-cols-2 gap-5 sm:gap-8 lg:gap-12">
            {/* Contact Information Cards */}
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Let's Talk</h2>

              <div className="space-y-3 sm:space-y-6">
                {/* Address Card */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-primary-100 p-2.5 sm:p-3 rounded-full flex-shrink-0">
                      <FiMapPin className="text-primary-600 text-base sm:text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">Our Address</h3>
                      <p className="text-gray-600 text-xs sm:text-base leading-relaxed">
                        L. Arradaza St., Bula-Lagao Road,<br />
                        Lagao, General Santos City,<br />
                        Philippines, 9500
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone Numbers Card */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-primary-100 p-2.5 sm:p-3 rounded-full flex-shrink-0">
                      <FiPhone className="text-primary-600 text-base sm:text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">Phone Numbers</h3>
                      <div className="text-gray-600 text-xs sm:text-base space-y-1">
                        <p>
                          <span className="text-gray-500">Landline:</span>{' '}
                          <a href="tel:553-8906" className="text-primary-600 hover:underline">553-8906</a>
                          {' / '}
                          <a href="tel:553-8907" className="text-primary-600 hover:underline">553-8907</a>
                        </p>
                        <p>
                          <span className="text-gray-500">Mobile:</span>{' '}
                          <a href="tel:09326924708" className="text-primary-600 hover:underline">0932-692-4708</a>
                        </p>
                        <p className="pl-[42px] sm:pl-[52px]">
                          <a href="tel:09560369408" className="text-primary-600 hover:underline">0956-036-9408</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Card */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-primary-100 p-2.5 sm:p-3 rounded-full flex-shrink-0">
                      <FiMail className="text-primary-600 text-base sm:text-xl" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">Email Addresses</h3>
                      <div className="text-gray-600 text-xs sm:text-base space-y-1">
                        <p>
                          <a
                            href="mailto:socsargencountyhospital@gmail.com"
                            className="text-primary-600 hover:underline break-all"
                          >
                            socsargencountyhospital@gmail.com
                          </a>
                        </p>
                        <p>
                          <a
                            href="mailto:edpsocsargen@gmail.com"
                            className="text-primary-600 hover:underline"
                          >
                            edpsocsargen@gmail.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media Card */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-3 sm:mb-4">Follow Us</h3>
                  <div className="flex gap-3 sm:gap-4">
                    <a
                      href="https://www.facebook.com/SocsargenCountyHospitalOfficial/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary-100 p-2.5 sm:p-3 rounded-full text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
                      aria-label="Facebook"
                    >
                      <FaFacebookF className="text-base sm:text-xl" />
                    </a>
                    <a
                      href="https://www.instagram.com/explore/locations/111506110436043/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary-100 p-2.5 sm:p-3 rounded-full text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
                      aria-label="Instagram"
                    >
                      <FaInstagram className="text-base sm:text-xl" />
                    </a>
                    <a
                      href="https://www.tiktok.com/@ppiaaya/video/7150000371698519322"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary-100 p-2.5 sm:p-3 rounded-full text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
                      aria-label="TikTok"
                    >
                      <FaTiktok className="text-base sm:text-xl" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 md:p-8">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="input w-full text-sm sm:text-base"
                        placeholder="Juan"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="input w-full text-sm sm:text-base"
                        placeholder="Dela Cruz"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label htmlFor="contactNumber" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="input w-full text-sm sm:text-base"
                        placeholder="09XX-XXX-XXXX"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input w-full text-sm sm:text-base"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="input w-full resize-none text-sm sm:text-base"
                      placeholder="How can we help you?"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full py-2.5 sm:py-3 text-sm sm:text-lg font-semibold"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Find Us on the Map Section */}
      <div className="bg-white">
        <div className="text-center py-6 sm:py-10">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">Find Us on the Map</h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-3 sm:px-4">
            Visit us at Socsargen County Hospital in Lagao, General Santos City
          </p>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5610.317122515964!2d125.18693377253548!3d6.118144569811807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f79fb707dc388d%3A0x3dc68b9d61e2c8c4!2sSocsargen%20County%20Hospital!5e0!3m2!1sen!2sph!4v1768029721585!5m2!1sen!2sph"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Socsargen County Hospital Location"
          className="w-full sm:h-[400px]"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
