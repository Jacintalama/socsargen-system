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
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            We are here to take care of you
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Information Cards */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Let's Talk</h2>

              <div className="space-y-6">
                {/* Address Card */}
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-100 p-3 rounded-full flex-shrink-0">
                      <FiMapPin className="text-primary-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Our Address</h3>
                      <p className="text-gray-600 leading-relaxed">
                        L. Arradaza St., Bula-Lagao Road,<br />
                        Lagao, General Santos City,<br />
                        Philippines, 9500
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone Numbers Card */}
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-100 p-3 rounded-full flex-shrink-0">
                      <FiPhone className="text-primary-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Phone Numbers</h3>
                      <div className="text-gray-600 space-y-1">
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
                        <p className="pl-[52px]">
                          <a href="tel:09560369408" className="text-primary-600 hover:underline">0956-036-9408</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Card */}
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-100 p-3 rounded-full flex-shrink-0">
                      <FiMail className="text-primary-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Email Addresses</h3>
                      <div className="text-gray-600 space-y-1">
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
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-gray-800 mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    <a
                      href="https://www.facebook.com/SocsargenCountyHospitalOfficial/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary-100 p-3 rounded-full text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
                      aria-label="Facebook"
                    >
                      <FaFacebookF className="text-xl" />
                    </a>
                    <a
                      href="https://www.instagram.com/explore/locations/111506110436043/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary-100 p-3 rounded-full text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
                      aria-label="Instagram"
                    >
                      <FaInstagram className="text-xl" />
                    </a>
                    <a
                      href="https://www.tiktok.com/@ppiaaya/video/7150000371698519322"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary-100 p-3 rounded-full text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
                      aria-label="TikTok"
                    >
                      <FaTiktok className="text-xl" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="input w-full"
                        placeholder="Juan"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="input w-full"
                        placeholder="Dela Cruz"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="input w-full"
                        placeholder="09XX-XXX-XXXX"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input w-full"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="input w-full resize-none"
                      placeholder="How can we help you?"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full py-3 text-lg font-semibold"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Find Us on the Map</h2>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.0788866668!2d125.1644!3d6.1164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f79f9f9f9f9f9f%3A0x9f9f9f9f9f9f9f9f!2sLagao%2C%20General%20Santos%20City%2C%20South%20Cotabato!5e0!3m2!1sen!2sph!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Socsargen County Hospital Location"
              className="w-full"
            ></iframe>
          </div>
          <div className="mt-4 text-center">
            <a
              href="https://www.google.com/maps/search/L.+Arradaza+St.,+Bula-Lagao+Road,+Lagao,+General+Santos+City,+Philippines,+9500"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline font-medium"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
