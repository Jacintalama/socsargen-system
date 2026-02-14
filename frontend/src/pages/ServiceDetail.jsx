import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiArrowLeft, FiPhone, FiActivity } from 'react-icons/fi';
import api from '../utils/api';
import { getBaseURL } from '../utils/url';

const API_URL = getBaseURL();

const ServiceDetail = () => {
  const { slug } = useParams();

  // Fetch all services and find the one matching the slug
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then(res => res.data)
  });

  // Find service by slug (convert name to slug format)
  const service = services?.find(s => {
    const serviceSlug = s.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return serviceSlug === slug;
  });

  // Get gradient color based on service type
  const getGradientColor = (service) => {
    if (!service) return 'from-primary-500 to-primary-600';
    const name = (service.name || '').toLowerCase();
    const category = (service.category || '').toLowerCase();

    if (name.includes('cardiac') || name.includes('heart') || name.includes('cardio') || category.includes('cardiac')) {
      return 'from-red-500 to-red-600';
    }
    if (name.includes('surgery') || name.includes('surgical') || category.includes('surgical')) {
      return 'from-blue-500 to-blue-600';
    }
    if (name.includes('emergency') || name.includes('urgent') || category.includes('emergency')) {
      return 'from-orange-500 to-orange-600';
    }
    if (name.includes('lab') || name.includes('diagnostic') || category.includes('diagnostic')) {
      return 'from-purple-500 to-purple-600';
    }
    if (name.includes('therapy') || name.includes('rehab') || category.includes('therapy')) {
      return 'from-teal-500 to-teal-600';
    }
    if (name.includes('icu') || name.includes('intensive') || category.includes('critical')) {
      return 'from-rose-500 to-rose-600';
    }
    if (name.includes('cancer') || name.includes('oncology')) {
      return 'from-pink-500 to-pink-600';
    }
    if (name.includes('dental')) {
      return 'from-cyan-500 to-cyan-600';
    }
    if (name.includes('radiology') || name.includes('imaging') || name.includes('mri')) {
      return 'from-indigo-500 to-indigo-600';
    }
    return 'from-primary-500 to-primary-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <FiActivity className="text-6xl text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Service Not Found</h1>
          <p className="text-gray-500 mb-6">The service you're looking for doesn't exist or has been removed.</p>
          <Link to="/services" className="btn btn-primary">
            <FiArrowLeft className="mr-2" /> Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const gradientColor = getGradientColor(service);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image */}
      <div className={`bg-gradient-to-br ${gradientColor} relative`}>
        {service.imageUrl ? (
          <div className="relative h-[300px] md:h-[400px]">
            <img
              src={`${API_URL}${service.imageUrl}`}
              alt={service.name}
              className="w-full h-full object-cover"
              style={{ objectPosition: 'top' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        ) : (
          <div className="h-[300px] md:h-[400px] flex items-center justify-center">
            <FiActivity className="text-white/20 text-[150px]" />
          </div>
        )}

        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-gray-700 px-4 py-2 rounded-full font-medium transition shadow-lg"
          >
            <FiArrowLeft /> Back to Services
          </Link>
        </div>

        {/* Service Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container mx-auto">
            <span className="inline-block bg-white/90 text-primary-700 text-sm font-medium px-3 py-1 rounded-full mb-3">
              {service.category || 'General'}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
              {service.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Description */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">About This Service</h2>
            {service.description ? (
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="whitespace-pre-line">{service.description}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                For more detailed information about this service, please contact us directly.
              </p>
            )}
          </div>

          {/* Contact CTA */}
          <div className={`bg-gradient-to-r ${gradientColor} rounded-2xl p-6 md:p-10 text-center text-white`}>
            <h2 className="text-2xl font-bold mb-4">Interested in This Service?</h2>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              Contact us to learn more or to schedule a consultation with our medical experts.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="tel:553-8906"
                className="inline-flex items-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                <FiPhone /> Call: 553-8906
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Back to Services Link */}
          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <FiArrowLeft /> View All Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
