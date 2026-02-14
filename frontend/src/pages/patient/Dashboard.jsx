import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiCalendar, FiClock, FiUser, FiPlus, FiBriefcase, FiCheckCircle, FiXCircle, FiEye } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/api';

const PatientDashboard = () => {
  const { user } = useAuth();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['myAppointments'],
    queryFn: () => api.get('/appointments/my?upcoming=true').then(res => res.data)
  });

  // Fetch job applications
  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ['myJobApplications'],
    queryFn: () => api.get('/applications/my').then(res => res.data)
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-pending',
      approved: 'badge-approved',
      rejected: 'badge-rejected',
      completed: 'badge-completed',
      cancelled: 'badge-cancelled'
    };
    return badges[status] || 'badge-pending';
  };

  const getAppStatusStyle = (status) => {
    const styles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
      reviewing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Reviewing' },
      interviewed: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Interviewed' },
      accepted: { bg: 'bg-green-100', text: 'text-green-700', label: 'Accepted' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Not Selected' }
    };
    return styles[status] || styles.pending;
  };

  // Count applications with updates (accepted or rejected)
  const updatedApplications = applications?.filter(
    app => app.status === 'accepted' || app.status === 'rejected'
  )?.length || 0;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Welcome, {user?.firstName}!</h1>
          <p className="text-gray-600">Manage your appointments and health information.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/patient/book" className="card hover:shadow-lg transition flex items-center gap-4">
            <div className="bg-primary-100 p-3 rounded-lg">
              <FiPlus className="text-primary-600 text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold">Book Appointment</h3>
              <p className="text-sm text-gray-500">Schedule a new appointment</p>
            </div>
          </Link>

          <Link to="/doctors" className="card hover:shadow-lg transition flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FiUser className="text-green-600 text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold">Find a Doctor</h3>
              <p className="text-sm text-gray-500">Browse our specialists</p>
            </div>
          </Link>

          <Link to="/patient/appointments" className="card hover:shadow-lg transition flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiCalendar className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold">My Appointments</h3>
              <p className="text-sm text-gray-500">View all appointments</p>
            </div>
          </Link>

          <Link to="/my-applications" className="card hover:shadow-lg transition flex items-center gap-4 relative">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiBriefcase className="text-purple-600 text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold">Job Applications</h3>
              <p className="text-sm text-gray-500">Track your applications</p>
            </div>
            {updatedApplications > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {updatedApplications}
              </span>
            )}
          </Link>
        </div>

        {/* Upcoming Appointments */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
            <Link to="/patient/appointments" className="text-primary-600 text-sm hover:underline">
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : appointments?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You don't have any upcoming appointments.</p>
              <Link to="/patient/book" className="btn btn-primary">
                Book Your First Appointment
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments?.slice(0, 5).map((apt) => (
                <div key={apt.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="bg-primary-100 p-3 rounded-lg">
                        <FiUser className="text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{apt.doctor?.fullName}</h3>
                        <p className="text-sm text-gray-500">{apt.doctor?.specialization}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FiCalendar />
                            {new Date(apt.appointmentDate).toLocaleDateString('en-PH', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock />
                            {apt.appointmentTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`badge ${getStatusBadge(apt.status)}`}>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Job Applications */}
        {applications?.length > 0 && (
          <div className="card mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Job Applications</h2>
              <Link to="/my-applications" className="text-primary-600 text-sm hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {applications?.slice(0, 3).map((app) => {
                const statusStyle = getAppStatusStyle(app.status);
                return (
                  <div key={app.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className={`${statusStyle.bg} p-3 rounded-lg`}>
                          {app.status === 'accepted' ? (
                            <FiCheckCircle className={`${statusStyle.text} text-xl`} />
                          ) : app.status === 'rejected' ? (
                            <FiXCircle className={`${statusStyle.text} text-xl`} />
                          ) : (
                            <FiBriefcase className={`${statusStyle.text} text-xl`} />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{app.jobTitle}</h3>
                          <p className="text-sm text-gray-500">{app.department}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Applied: {new Date(app.createdAt).toLocaleDateString('en-PH', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.label}
                      </span>
                    </div>
                    {(app.status === 'accepted' || app.status === 'rejected') && (
                      <div className={`mt-3 p-3 rounded-lg ${statusStyle.bg}`}>
                        <p className={`text-sm ${statusStyle.text}`}>
                          {app.status === 'accepted'
                            ? 'Congratulations! Your application has been accepted. We will contact you soon.'
                            : 'Thank you for your interest. Unfortunately, we have decided to move forward with other candidates.'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {applications?.length > 3 && (
              <div className="mt-4 text-center">
                <Link to="/my-applications" className="text-primary-600 text-sm hover:underline">
                  View all {applications.length} applications
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
