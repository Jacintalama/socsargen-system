import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiUsers, FiCalendar, FiFileText, FiSettings, FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/api';

const AdminDashboard = () => {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['appointmentStats'],
    queryFn: () => api.get('/appointments/stats').then(res => res.data)
  });

  const { data: recentAppointments } = useQuery({
    queryKey: ['recentAppointments'],
    queryFn: () => api.get('/appointments/all?status=pending').then(res => res.data)
  });

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName}. Here's what's happening today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FiCalendar className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-blue-700">{stats?.today || 0}</p>
              </div>
            </div>
          </div>

          <div className="card bg-yellow-50 border border-yellow-200">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FiCalendar className="text-yellow-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-700">{stats?.pending || 0}</p>
              </div>
            </div>
          </div>

          <div className="card bg-green-50 border border-green-200">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FiCalendar className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-green-600">Approved</p>
                <p className="text-2xl font-bold text-green-700">{stats?.approved || 0}</p>
              </div>
            </div>
          </div>

          <div className="card bg-purple-50 border border-purple-200">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FiCalendar className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-purple-600">Total</p>
                <p className="text-2xl font-bold text-purple-700">{stats?.total || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/appointments" className="card hover:shadow-lg transition">
            <FiCalendar className="text-primary-600 text-2xl mb-3" />
            <h3 className="font-semibold">Appointments</h3>
            <p className="text-sm text-gray-500">Manage all appointments</p>
          </Link>

          <Link to="/admin/doctors" className="card hover:shadow-lg transition">
            <FiUsers className="text-primary-600 text-2xl mb-3" />
            <h3 className="font-semibold">Doctors</h3>
            <p className="text-sm text-gray-500">Manage doctor profiles</p>
          </Link>

          <Link to="/admin/news" className="card hover:shadow-lg transition">
            <FiFileText className="text-primary-600 text-2xl mb-3" />
            <h3 className="font-semibold">News</h3>
            <p className="text-sm text-gray-500">Manage announcements</p>
          </Link>

          <Link to="/admin/chat" className="card hover:shadow-lg transition">
            <FiMessageSquare className="text-primary-600 text-2xl mb-3" />
            <h3 className="font-semibold">Chat</h3>
            <p className="text-sm text-gray-500">Respond to inquiries</p>
          </Link>
        </div>

        {/* Pending Appointments */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Pending Appointments</h2>
            <Link to="/admin/appointments" className="text-primary-600 text-sm hover:underline">
              View All
            </Link>
          </div>

          {recentAppointments?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending appointments.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-semibold">Patient</th>
                    <th className="pb-3 font-semibold">Doctor</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments?.slice(0, 5).map((apt) => (
                    <tr key={apt.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{apt.patient?.fullName}</td>
                      <td className="py-3">{apt.doctor?.fullName}</td>
                      <td className="py-3">{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                      <td className="py-3">{apt.appointmentTime}</td>
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

export default AdminDashboard;
