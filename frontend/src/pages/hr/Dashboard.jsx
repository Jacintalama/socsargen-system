import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FiBriefcase,
  FiUsers,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiPlus,
  FiEye
} from 'react-icons/fi';
import api from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';

const HRDashboard = () => {
  const { user } = useAuth();

  // Fetch application stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['applicationStats'],
    queryFn: () => api.get('/applications/stats').then(res => res.data)
  });

  // Fetch recent applications
  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ['recentApplications'],
    queryFn: () => api.get('/applications/all?limit=5').then(res => res.data)
  });

  // Fetch active jobs
  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['activeJobs'],
    queryFn: () => api.get('/jobs/admin/all').then(res => res.data)
  });

  // Fetch rejected applications
  const { data: rejectedApps, isLoading: rejectedLoading } = useQuery({
    queryKey: ['rejectedApplications'],
    queryFn: () => api.get('/applications/all?status=rejected').then(res => res.data)
  });

  const statCards = [
    {
      title: 'Total Applications',
      value: stats?.total || 0,
      icon: FiFileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Pending Review',
      value: stats?.pending || 0,
      icon: FiClock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Accepted',
      value: stats?.accepted || 0,
      icon: FiCheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Rejected',
      value: stats?.rejected || 0,
      icon: FiXCircle,
      color: 'bg-red-500'
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      interviewed: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">HR Dashboard</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Welcome back, {user?.firstName}! Manage job postings and applications.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">{stat.title}</p>
                  <p className="text-xl sm:text-3xl font-bold text-gray-800 mt-1">
                    {statsLoading ? '...' : stat.value}
                  </p>
                </div>
                <div className={`w-9 h-9 sm:w-12 sm:h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Link
            to="/hr/jobs"
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow flex items-center gap-3 sm:gap-4"
          >
            <div className="w-11 h-11 sm:w-14 sm:h-14 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FiBriefcase className="w-5 h-5 sm:w-7 sm:h-7 text-primary-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-800">Manage Job Postings</h3>
              <p className="text-gray-500 text-xs sm:text-sm">Create, edit, and manage job listings</p>
            </div>
          </Link>

          <Link
            to="/hr/applications"
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow flex items-center gap-3 sm:gap-4"
          >
            <div className="w-11 h-11 sm:w-14 sm:h-14 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FiUsers className="w-5 h-5 sm:w-7 sm:h-7 text-green-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-800">Review Applications</h3>
              <p className="text-gray-500 text-xs sm:text-sm">View and process job applications</p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 mb-3 sm:mb-6">
          {/* Recent Applications */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">Recent Applications</h2>
                <Link to="/hr/applications" className="text-primary-600 text-xs sm:text-sm hover:underline">
                  View All
                </Link>
              </div>
            </div>
            <div className="p-3 sm:p-6">
              {appsLoading ? (
                <p className="text-gray-500 text-center py-4 text-sm">Loading...</p>
              ) : applications?.length > 0 ? (
                <div className="space-y-2 sm:space-y-4">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">
                          {app.applicant?.firstName} {app.applicant?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{app.jobTitle}</p>
                      </div>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4 text-sm">No applications yet</p>
              )}
            </div>
          </div>

          {/* Active Job Postings */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">Active Job Postings</h2>
                <Link to="/hr/jobs" className="text-primary-600 text-xs sm:text-sm hover:underline">
                  Manage Jobs
                </Link>
              </div>
            </div>
            <div className="p-3 sm:p-6">
              {jobsLoading ? (
                <p className="text-gray-500 text-center py-4 text-sm">Loading...</p>
              ) : jobs?.filter(j => j.isActive)?.length > 0 ? (
                <div className="space-y-2 sm:space-y-4">
                  {jobs.filter(j => j.isActive).slice(0, 5).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">{job.title}</p>
                        <p className="text-xs text-gray-500 truncate">{job.department}</p>
                      </div>
                      <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex-shrink-0">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4 text-sm">No active job postings</p>
              )}
            </div>
          </div>
        </div>

        {/* Rejected Applications Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <FiXCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">Rejected Applications</h2>
              </div>
              <Link to="/hr/applications?status=rejected" className="text-primary-600 text-xs sm:text-sm hover:underline">
                View All
              </Link>
            </div>
          </div>
          <div className="p-3 sm:p-6">
            {rejectedLoading ? (
              <p className="text-gray-500 text-center py-4 text-sm">Loading...</p>
            ) : rejectedApps?.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 border-b">
                        <th className="pb-3 font-medium">Applicant</th>
                        <th className="pb-3 font-medium">Position</th>
                        <th className="pb-3 font-medium">Email</th>
                        <th className="pb-3 font-medium">Date Applied</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {rejectedApps.slice(0, 10).map((app) => (
                        <tr key={app.id} className="text-sm">
                          <td className="py-3">
                            <p className="font-medium text-gray-800">
                              {app.applicant?.firstName} {app.applicant?.lastName}
                            </p>
                          </td>
                          <td className="py-3 text-gray-600">{app.jobTitle}</td>
                          <td className="py-3 text-gray-600">{app.applicant?.email}</td>
                          <td className="py-3 text-gray-500">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              Rejected
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-2">
                  {rejectedApps.slice(0, 10).map((app) => (
                    <div key={app.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-gray-800 text-sm truncate">
                          {app.applicant?.firstName} {app.applicant?.lastName}
                        </p>
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium flex-shrink-0">
                          Rejected
                        </span>
                      </div>
                      <p className="text-xs text-primary-600 font-medium truncate">{app.jobTitle}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{app.applicant?.email}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm">No rejected applications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
