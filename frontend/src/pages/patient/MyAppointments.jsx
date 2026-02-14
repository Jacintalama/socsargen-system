import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiCalendar, FiClock, FiUser, FiPlus, FiX, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const MyAppointments = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  // Fetch all appointments
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['myAppointments', statusFilter],
    queryFn: () => {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      return api.get(`/appointments/my${params}`).then(res => res.data);
    }
  });

  // Cancel appointment mutation
  const cancelAppointment = useMutation({
    mutationFn: (id) => api.patch(`/appointments/${id}/cancel`),
    onSuccess: () => {
      toast.success('Appointment cancelled successfully.');
      queryClient.invalidateQueries(['myAppointments']);
      setCancellingId(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to cancel appointment.');
      setCancellingId(null);
    }
  });

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setCancellingId(id);
      cancelAppointment.mutate(id);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const canCancel = (status) => {
    return status === 'pending' || status === 'approved';
  };

  const isUpcoming = (date) => {
    return new Date(date) >= new Date(new Date().toDateString());
  };

  // Separate appointments into upcoming and past
  const upcomingAppointments = appointments?.filter(apt =>
    isUpcoming(apt.appointmentDate) && !['cancelled', 'rejected', 'completed'].includes(apt.status)
  ) || [];

  const pastAppointments = appointments?.filter(apt =>
    !isUpcoming(apt.appointmentDate) || ['cancelled', 'rejected', 'completed'].includes(apt.status)
  ) || [];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Appointments</h1>
            <p className="text-gray-600">View and manage your appointments.</p>
          </div>
          <Link to="/patient/book" className="btn btn-primary flex items-center gap-2 w-fit">
            <FiPlus /> Book New Appointment
          </Link>
        </div>

        {/* Filter */}
        <div className="card mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <FiFilter className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            {['all', 'pending', 'approved', 'completed', 'cancelled', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-full text-sm transition
                  ${statusFilter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : appointments?.length === 0 ? (
          <div className="card text-center py-12">
            <FiCalendar className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No appointments found</h3>
            <p className="text-gray-500 mb-6">
              {statusFilter !== 'all'
                ? `You don't have any ${statusFilter} appointments.`
                : "You haven't booked any appointments yet."
              }
            </p>
            <Link to="/patient/book" className="btn btn-primary">
              Book Your First Appointment
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Appointments */}
            {statusFilter === 'all' && upcomingAppointments.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Upcoming Appointments ({upcomingAppointments.length})
                </h2>
                <div className="space-y-4">
                  {upcomingAppointments.map((apt) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      onCancel={handleCancel}
                      cancellingId={cancellingId}
                      canCancel={canCancel}
                      getStatusBadge={getStatusBadge}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past/Other Appointments or Filtered Results */}
            {(statusFilter !== 'all' ? appointments : pastAppointments)?.length > 0 && (
              <div>
                {statusFilter === 'all' && (
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    Past Appointments ({pastAppointments.length})
                  </h2>
                )}
                <div className="space-y-4">
                  {(statusFilter !== 'all' ? appointments : pastAppointments)?.map((apt) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      onCancel={handleCancel}
                      cancellingId={cancellingId}
                      canCancel={canCancel}
                      getStatusBadge={getStatusBadge}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Appointment Card Component
const AppointmentCard = ({ appointment, onCancel, cancellingId, canCancel, getStatusBadge }) => {
  const apt = appointment;

  return (
    <div className="card hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="bg-primary-100 p-3 rounded-lg h-fit">
            {apt.doctor?.photoUrl ? (
              <img
                src={apt.doctor.photoUrl}
                alt={apt.doctor.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <FiUser className="text-primary-600 text-xl" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">{apt.doctor?.fullName || 'Doctor'}</h3>
            <p className="text-sm text-gray-500">{apt.doctor?.specialization}</p>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <FiCalendar className="text-gray-400" />
                {new Date(apt.appointmentDate).toLocaleDateString('en-PH', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1">
                <FiClock className="text-gray-400" />
                {apt.appointmentTime}
              </span>
            </div>

            {apt.reason && (
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-medium">Reason:</span> {apt.reason}
              </p>
            )}

            {apt.notes && (
              <p className="text-sm text-blue-600 mt-2 bg-blue-50 px-3 py-1 rounded">
                <span className="font-medium">Doctor's notes:</span> {apt.notes}
              </p>
            )}
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(apt.status)}`}>
            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
          </span>

          {canCancel(apt.status) && (
            <button
              onClick={() => onCancel(apt.id)}
              disabled={cancellingId === apt.id}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              {cancellingId === apt.id ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600"></div>
              ) : (
                <>
                  <FiX /> Cancel
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
