import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiCalendar, FiClock, FiUser, FiCheck, FiX, FiFilter, FiSearch, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const AdminAppointments = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Fetch all appointments
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['adminAppointments', statusFilter, selectedDate],
    queryFn: () => {
      let url = '/appointments/all?';
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;
      if (selectedDate) url += `date=${selectedDate}`;
      return api.get(url).then(res => res.data);
    }
  });

  // Update appointment status
  const updateStatus = useMutation({
    mutationFn: ({ id, status, notes }) => api.patch(`/appointments/${id}/status`, { status, notes }),
    onSuccess: (_, variables) => {
      toast.success(`Appointment ${variables.status}!`);
      queryClient.invalidateQueries(['adminAppointments']);
      queryClient.invalidateQueries(['appointmentStats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update appointment.');
    }
  });

  // Filter appointments by search term
  const filteredAppointments = appointments?.filter(apt =>
    apt.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctor?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-600'
    };
    return badges[status] || 'bg-gray-100 text-gray-600';
  };

  const handleStatusUpdate = (id, status) => {
    if (window.confirm(`Are you sure you want to mark this appointment as ${status}?`)) {
      updateStatus.mutate({ id, status });
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition mb-4"
          >
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Manage Appointments</h1>
          <p className="text-gray-600">View and manage all patient appointments.</p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient or doctor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Date Filter */}
            <div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input"
              />
            </div>

            {/* Clear Filters */}
            {(selectedDate || searchTerm) && (
              <button
                onClick={() => { setSelectedDate(''); setSearchTerm(''); }}
                className="btn btn-secondary"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <FiFilter className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Status:</span>
            {['all', 'pending', 'approved', 'completed', 'cancelled', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  statusFilter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredAppointments?.length === 0 ? (
          <div className="card text-center py-12">
            <FiCalendar className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Appointments Found</h3>
            <p className="text-gray-500">
              {statusFilter !== 'all' || selectedDate || searchTerm
                ? 'No appointments match your filters.'
                : 'No appointments have been made yet.'
              }
            </p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-semibold">Patient</th>
                    <th className="text-left p-4 font-semibold">Doctor</th>
                    <th className="text-left p-4 font-semibold">Date & Time</th>
                    <th className="text-left p-4 font-semibold">Reason</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments?.map((apt) => (
                    <tr key={apt.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary-100 p-2 rounded-full">
                            <FiUser className="text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium">{apt.patient?.fullName}</p>
                            <p className="text-sm text-gray-500">{apt.patient?.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{apt.doctor?.fullName}</p>
                        <p className="text-sm text-gray-500">{apt.doctor?.specialization}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          <span>{new Date(apt.appointmentDate).toLocaleDateString('en-PH', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FiClock className="text-gray-400" />
                          <span>{apt.appointmentTime}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-600 max-w-[200px] truncate">
                          {apt.reason || '-'}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(apt.status)}`}>
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        {apt.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusUpdate(apt.id, 'approved')}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                              title="Approve"
                            >
                              <FiCheck />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(apt.id, 'rejected')}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                              title="Reject"
                            >
                              <FiX />
                            </button>
                          </div>
                        )}
                        {apt.status === 'approved' && (
                          <button
                            onClick={() => handleStatusUpdate(apt.id, 'completed')}
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition text-sm"
                          >
                            Mark Complete
                          </button>
                        )}
                        {['completed', 'cancelled', 'rejected'].includes(apt.status) && (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;
