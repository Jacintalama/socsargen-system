import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

const Services = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then(res => res.data)
  });

  const getIcon = (icon) => {
    const icons = {
      emergency: '🚑',
      outpatient: '🩺',
      lab: '🔬',
      radiology: '📷',
      pharmacy: '💊',
      surgery: '🏥'
    };
    return icons[icon] || '⚕️';
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Our Services</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Socsargen Hospital offers comprehensive healthcare services to meet all your medical needs with state-of-the-art facilities and expert medical staff.
          </p>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.map((service) => (
              <div key={service.id} className="card hover:shadow-lg transition group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition">
                  {getIcon(service.icon)}
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need More Information?</h2>
          <p className="text-gray-600 mb-6">
            Contact us to learn more about our services or to schedule a consultation.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="tel:0831234567" className="btn btn-primary">
              Call Us: (083) 123-4567
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
