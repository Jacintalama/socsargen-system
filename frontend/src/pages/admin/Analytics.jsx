import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FiUsers,
  FiCalendar,
  FiFileText,
  FiBriefcase,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiPieChart,
  FiBarChart2,
  FiDownload,
  FiFilter,
  FiRefreshCw,
  FiArrowLeft
} from 'react-icons/fi';
import api from '../../utils/api';

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState('month'); // week, month, year, all

  // Fetch analytics data
  const { data: analyticsData, isLoading, refetch } = useQuery({
    queryKey: ['adminAnalytics', dateRange],
    queryFn: () => api.get(`/analytics?range=${dateRange}`).then(res => res.data).catch(() => null)
  });

  // Fetch appointment stats
  const { data: appointmentStats } = useQuery({
    queryKey: ['appointmentStats'],
    queryFn: () => api.get('/appointments/stats').then(res => res.data).catch(() => ({}))
  });

  // Fetch all appointments for breakdown
  const { data: allAppointments } = useQuery({
    queryKey: ['allAppointmentsAnalytics'],
    queryFn: () => api.get('/appointments/all').then(res => res.data).catch(() => [])
  });

  // Fetch doctors
  const { data: doctors } = useQuery({
    queryKey: ['doctorsAnalytics'],
    queryFn: () => api.get('/doctors').then(res => res.data).catch(() => [])
  });

  // Fetch news
  const { data: newsData } = useQuery({
    queryKey: ['newsAnalytics'],
    queryFn: () => api.get('/news/admin/all').then(res => res.data).catch(() => [])
  });

  // Fetch jobs
  const { data: jobsData } = useQuery({
    queryKey: ['jobsAnalytics'],
    queryFn: () => api.get('/jobs/admin/all').then(res => res.data).catch(() => [])
  });

  // Calculate statistics
  const totalAppointments = allAppointments?.length || 0;
  const pendingAppointments = allAppointments?.filter(a => a.status === 'pending')?.length || 0;
  const approvedAppointments = allAppointments?.filter(a => a.status === 'approved')?.length || 0;
  const completedAppointments = allAppointments?.filter(a => a.status === 'completed')?.length || 0;
  const cancelledAppointments = allAppointments?.filter(a => a.status === 'cancelled' || a.status === 'rejected')?.length || 0;

  const totalDoctors = doctors?.length || 0;
  const availableDoctors = doctors?.filter(d => d.isAvailable)?.length || 0;

  const totalNews = newsData?.length || 0;
  const publishedNews = newsData?.filter(n => n.isPublished)?.length || 0;
  const draftNews = totalNews - publishedNews;

  const totalJobs = jobsData?.length || 0;
  const activeJobs = jobsData?.filter(j => j.isActive)?.length || 0;
  const inactiveJobs = totalJobs - activeJobs;

  // Appointment by status for pie chart visualization
  const appointmentsByStatus = [
    { label: 'Pending', value: pendingAppointments, color: 'bg-yellow-500' },
    { label: 'Approved', value: approvedAppointments, color: 'bg-blue-500' },
    { label: 'Completed', value: completedAppointments, color: 'bg-green-500' },
    { label: 'Cancelled/Rejected', value: cancelledAppointments, color: 'bg-red-500' }
  ];

  // Appointments by doctor
  const appointmentsByDoctor = {};
  allAppointments?.forEach(apt => {
    const doctorName = apt.doctor?.fullName || 'Unknown';
    appointmentsByDoctor[doctorName] = (appointmentsByDoctor[doctorName] || 0) + 1;
  });
  const topDoctors = Object.entries(appointmentsByDoctor)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Appointments by day of week
  const appointmentsByDay = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  allAppointments?.forEach(apt => {
    const day = new Date(apt.appointmentDate).getDay();
    appointmentsByDay[day]++;
  });

  // Recent activity (last 7 days appointments)
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  const recentAppointments = allAppointments?.filter(apt =>
    new Date(apt.createdAt) >= last7Days
  )?.length || 0;

  // Export report function - CSV format
  const exportReport = () => {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    // Build CSV content
    let csv = '';

    // Header
    csv += 'SOCSARGEN COUNTY HOSPITAL\n';
    csv += 'ANALYTICS REPORT\n';
    csv += `Generated: ${today}\n`;
    csv += `Date Range: ${dateRange === 'week' ? 'Last 7 Days' : dateRange === 'month' ? 'Last 30 Days' : dateRange === 'year' ? 'Last Year' : 'All Time'}\n`;
    csv += '\n';

    // Summary Section
    csv += '=== SUMMARY ===\n';
    csv += 'Category,Value\n';
    csv += `Total Appointments,${totalAppointments}\n`;
    csv += `Pending Appointments,${pendingAppointments}\n`;
    csv += `Approved Appointments,${approvedAppointments}\n`;
    csv += `Completed Appointments,${completedAppointments}\n`;
    csv += `Cancelled/Rejected,${cancelledAppointments}\n`;
    csv += `Total Doctors,${totalDoctors}\n`;
    csv += `Available Doctors,${availableDoctors}\n`;
    csv += `Total News Articles,${totalNews}\n`;
    csv += `Published Articles,${publishedNews}\n`;
    csv += `Draft Articles,${draftNews}\n`;
    csv += `Total Job Postings,${totalJobs}\n`;
    csv += `Active Jobs,${activeJobs}\n`;
    csv += '\n';

    // Appointments by Doctor
    csv += '=== TOP DOCTORS BY APPOINTMENTS ===\n';
    csv += 'Doctor Name,Appointments\n';
    topDoctors.forEach(([name, count]) => {
      csv += `"${name}",${count}\n`;
    });
    csv += '\n';

    // Appointments by Day
    csv += '=== APPOINTMENTS BY DAY OF WEEK ===\n';
    csv += 'Day,Appointments\n';
    dayNames.forEach((day, i) => {
      csv += `${day},${appointmentsByDay[i]}\n`;
    });
    csv += '\n';

    // Recent Appointments
    if (allAppointments?.length > 0) {
      csv += '=== RECENT APPOINTMENTS ===\n';
      csv += 'Patient,Doctor,Date,Time,Status\n';
      allAppointments.slice(0, 20).forEach(apt => {
        csv += `"${apt.patient?.fullName || 'N/A'}","${apt.doctor?.fullName || 'N/A'}",${new Date(apt.appointmentDate).toLocaleDateString()},${apt.appointmentTime},${apt.status}\n`;
      });
    }

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SCH-Analytics-Report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Analytics & Reports</h1>
              <p className="text-gray-600">Overview of hospital system performance and statistics.</p>
            </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input w-full sm:w-auto"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>
            <button
              onClick={() => refetch()}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              title="Refresh"
            >
              <FiRefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={exportReport}
              className="btn btn-primary flex items-center gap-2"
            >
              <FiDownload /> Export Report
            </button>
          </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-8">
          <StatCard
            title="Total Appointments"
            value={totalAppointments}
            icon={<FiCalendar />}
            color="blue"
            trend={recentAppointments > 0 ? `+${recentAppointments} this week` : null}
          />
          <StatCard
            title="Active Doctors"
            value={`${availableDoctors}/${totalDoctors}`}
            icon={<FiUsers />}
            color="green"
          />
          <StatCard
            title="Published News"
            value={`${publishedNews}/${totalNews}`}
            icon={<FiFileText />}
            color="purple"
          />
          <StatCard
            title="Active Jobs"
            value={`${activeJobs}/${totalJobs}`}
            icon={<FiBriefcase />}
            color="orange"
          />
        </div>

        {/* Appointment Status Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Status Distribution */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiPieChart className="text-primary-600" />
              Appointment Status Distribution
            </h2>
            <div className="space-y-4">
              {appointmentsByStatus.map((status) => (
                <div key={status.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{status.label}</span>
                    <span className="text-sm text-gray-500">
                      {status.value} ({totalAppointments > 0 ? ((status.value / totalAppointments) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${status.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${totalAppointments > 0 ? (status.value / totalAppointments) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-yellow-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-yellow-600">{pendingAppointments}</p>
                <p className="text-xs text-yellow-700">Pending</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">{approvedAppointments}</p>
                <p className="text-xs text-blue-700">Approved</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{completedAppointments}</p>
                <p className="text-xs text-green-700">Completed</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-red-600">{cancelledAppointments}</p>
                <p className="text-xs text-red-700">Cancelled</p>
              </div>
            </div>
          </div>

          {/* Appointments by Day */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiBarChart2 className="text-primary-600" />
              Appointments by Day of Week
            </h2>
            <div className="space-y-3">
              {dayNames.map((day, index) => {
                const maxCount = Math.max(...appointmentsByDay, 1);
                return (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-24">{day}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                      <div
                        className="bg-primary-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${(appointmentsByDay[index] / maxCount) * 100}%`, minWidth: appointmentsByDay[index] > 0 ? '30px' : '0' }}
                      >
                        {appointmentsByDay[index] > 0 && (
                          <span className="text-xs text-white font-medium">{appointmentsByDay[index]}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Doctors & Content Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Top Doctors by Appointments */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiUsers className="text-primary-600" />
              Top Doctors by Appointments
            </h2>
            {topDoctors.length > 0 ? (
              <div className="space-y-3">
                {topDoctors.map(([name, count], index) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-primary-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{name}</p>
                      <p className="text-xs text-gray-500">{count} appointments</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No appointment data yet</p>
            )}
          </div>

          {/* News Statistics */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiFileText className="text-primary-600" />
              News & Articles
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Articles</span>
                <span className="text-xl font-bold text-gray-800">{totalNews}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-600">Published</span>
                <span className="text-xl font-bold text-green-700">{publishedNews}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-600">Drafts</span>
                <span className="text-xl font-bold text-yellow-700">{draftNews}</span>
              </div>
              {/* Recent news */}
              {newsData?.slice(0, 3).map(news => (
                <div key={news.id} className="border-l-4 border-primary-500 pl-3 py-1">
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">{news.title}</p>
                  <p className="text-xs text-gray-500">
                    {news.isPublished ? 'Published' : 'Draft'} • {new Date(news.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Jobs Statistics */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiBriefcase className="text-primary-600" />
              Job Postings
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Postings</span>
                <span className="text-xl font-bold text-gray-800">{totalJobs}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-600">Active</span>
                <span className="text-xl font-bold text-green-700">{activeJobs}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <span className="text-gray-500">Inactive</span>
                <span className="text-xl font-bold text-gray-600">{inactiveJobs}</span>
              </div>
              {/* Recent jobs */}
              {jobsData?.slice(0, 3).map(job => (
                <div key={job.id} className="border-l-4 border-primary-500 pl-3 py-1">
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">{job.title}</p>
                  <p className="text-xs text-gray-500">
                    {job.department} • {job.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiActivity className="text-primary-600" />
            Recent Appointments
          </h2>
          {allAppointments?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-semibold text-sm">Patient</th>
                    <th className="pb-3 font-semibold text-sm">Doctor</th>
                    <th className="pb-3 font-semibold text-sm">Date</th>
                    <th className="pb-3 font-semibold text-sm">Time</th>
                    <th className="pb-3 font-semibold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allAppointments?.slice(0, 10).map((apt) => (
                    <tr key={apt.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 text-sm">{apt.patient?.fullName || 'N/A'}</td>
                      <td className="py-3 text-sm">{apt.doctor?.fullName || 'N/A'}</td>
                      <td className="py-3 text-sm">{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                      <td className="py-3 text-sm">{apt.appointmentTime}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          apt.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                          apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No appointments found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    red: 'bg-red-50 border-red-200 text-red-600'
  };

  const iconBgClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100',
    red: 'bg-red-100'
  };

  return (
    <div className={`card border ${colorClasses[color]} p-3 sm:p-5`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`${iconBgClasses[color]} p-2 sm:p-3 rounded-lg`}>
          <span className="text-lg sm:text-xl">{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm opacity-80 truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-bold">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <FiTrendingUp className="w-3 h-3" />
              {trend}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
