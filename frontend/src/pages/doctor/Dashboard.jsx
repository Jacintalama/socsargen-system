import { useQuery } from '@tanstack/react-query';
import { FiCalendar, FiClock, FiUser, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/api';

const DoctorDashboard = () => {
  const { user } = useAuth();

  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ['doctorAppointments'],
    queryFn: () => api.get('/appointments/my').then(res => res.data)
  });

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status}!`);
      refetch();
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

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

  const todayAppointments = appointments?.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.appointmentDate === today;
  });

  const pendingAppointments = appointments?.filter(apt => apt.status === 'pending');

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Welcome, Dr. {user?.lastName}!</h1>
          <p className="text-gray-600">View and manage your appointments.</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-primary-50 border border-primary-200">
            <h3 className="text-sm text-primary-600 font-medium">Today's Appointments</h3>
            <p className="text-3xl font-bold text-primary-700">{todayAppointments?.length || 0}</p>
          </div>
          <div className="card bg-yellow-50 border border-yellow-200">
            <h3 className="text-sm text-yellow-600 font-medium">Pending Approval</h3>
            <p className="text-3xl font-bold text-yellow-700">{pendingAppointments?.length || 0}</p>
          </div>
          <div className="card bg-green-50 border border-green-200">
            <h3 className="text-sm text-green-600 font-medium">Total Appointments</h3>
            <p className="text-3xl font-bold text-green-700">{appointments?.length || 0}</p>
          </div>
        </div>

        {/* Appointments List */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Your Appointments</h2>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : appointments?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No appointments found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-semibold">Patient</th>
                    <th className="pb-3 font-semibold">Date & Time</th>
                    <th className="pb-3 font-semibold">Reason</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments?.map((apt) => (
                    <tr key={apt.id} className="border-b hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 p-2 rounded-full">
                            <FiUser className="text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">{apt.patient?.fullName}</p>
                            <p className="text-sm text-gray-500">{apt.patient?.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          <span>{new Date(apt.appointmentDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FiClock className="text-gray-400" />
                          <span>{apt.appointmentTime}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="text-sm text-gray-600 max-w-xs truncate">
                          {apt.reason || 'Not specified'}
                        </p>
                      </td>
                      <td className="py-4">
                        <span className={`badge ${getStatusBadge(apt.status)}`}>
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4">
                        {apt.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'approved')}
                              className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 transition"
                              title="Approve"
                            >
                              <FiCheck />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'rejected')}
                              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                              title="Reject"
                            >
                              <FiX />
                            </button>
                          </div>
                        )}
                        {apt.status === 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'completed')}
                            className="btn btn-primary text-sm py-1"
                          >
                            Mark Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
