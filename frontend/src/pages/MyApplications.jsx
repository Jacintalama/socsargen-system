import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  FiBriefcase,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiArrowLeft,
  FiEye,
  FiCalendar,
  FiMapPin,
  FiUser
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { getBaseURL } from '../utils/url';

const MyApplications = () => {
  const { user } = useAuth();
  const [selectedApp, setSelectedApp] = useState(null);

  // Fetch user's applications
  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['myApplications'],
    queryFn: () => api.get('/applications/my').then(res => res.data),
    enabled: !!user
  });

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: FiClock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-200',
        label: 'Pending Review',
        description: 'Your application is waiting to be reviewed by our HR team.'
      },
      reviewing: {
        icon: FiEye,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-200',
        label: 'Under Review',
        description: 'Great news! Your application is currently being reviewed.'
      },
      interviewed: {
        icon: FiUser,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        borderColor: 'border-purple-200',
        label: 'Interviewed',
        description: 'You have been interviewed. We are evaluating your candidacy.'
      },
      accepted: {
        icon: FiCheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-200',
        label: 'Accepted',
        description: 'Congratulations! Your application has been accepted. We will contact you soon with next steps.'
      },
      rejected: {
        icon: FiXCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-200',
        label: 'Not Selected',
        description: 'Thank you for your interest. Unfortunately, we have decided to move forward with other candidates.'
      }
    };
    return configs[status] || configs.pending;
  };

  const getProgressPercentage = (status) => {
    const progress = {
      pending: 25,
      reviewing: 50,
      interviewed: 75,
      accepted: 100,
      rejected: 100
    };
    return progress[status] || 0;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <FiBriefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Login Required</h2>
          <p className="text-gray-500 mb-4">Please login to view your job applications.</p>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/careers" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4">
            <FiArrowLeft className="w-4 h-4" />
            Back to Careers
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">My Job Applications</h1>
          <p className="text-gray-600 mt-1">Track the status of your job applications</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <FiXCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-red-600">Failed to load applications. Please try again later.</p>
          </div>
        )}

        {/* No Applications */}
        {!isLoading && !error && applications?.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FiBriefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Applications Yet</h2>
            <p className="text-gray-500 mb-6">You haven't applied to any jobs yet. Browse our open positions and start your career journey!</p>
            <Link to="/careers" className="btn btn-primary">
              Browse Job Openings
            </Link>
          </div>
        )}

        {/* Applications List */}
        {!isLoading && applications?.length > 0 && (
          <div className="space-y-4">
            {applications.map((app) => {
              const statusConfig = getStatusConfig(app.status);
              const StatusIcon = statusConfig.icon;
              const progress = getProgressPercentage(app.status);

              return (
                <div
                  key={app.id}
                  className={`bg-white rounded-xl shadow-sm border-l-4 ${statusConfig.borderColor} overflow-hidden hover:shadow-md transition-shadow`}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Job Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 ${statusConfig.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{app.jobTitle}</h3>
                            <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                              {app.department && (
                                <span className="flex items-center gap-1">
                                  <FiBriefcase className="w-4 h-4" />
                                  {app.department}
                                </span>
                              )}
                              {app.jobType && (
                                <span className="flex items-center gap-1">
                                  <FiClock className="w-4 h-4" />
                                  {app.jobType}
                                </span>
                              )}
                              {app.location && (
                                <span className="flex items-center gap-1">
                                  <FiMapPin className="w-4 h-4" />
                                  {app.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex flex-col items-end gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${statusConfig.bgColor} ${statusConfig.color} rounded-full text-sm font-medium`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusConfig.label}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          Applied: {new Date(app.createdAt).toLocaleDateString('en-PH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Application Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            app.status === 'rejected' ? 'bg-red-500' :
                            app.status === 'accepted' ? 'bg-green-500' :
                            'bg-primary-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Status Message */}
                    <div className={`mt-4 p-3 ${statusConfig.bgColor} rounded-lg`}>
                      <p className={`text-sm ${statusConfig.color}`}>
                        {statusConfig.description}
                      </p>
                    </div>

                    {/* View Details Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-xs text-gray-400">
                        Last updated: {new Date(app.updatedAt || app.createdAt).toLocaleDateString('en-PH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                      >
                        <FiEye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Application Details</h2>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <FiXCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {/* Job Title */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedApp.jobTitle}</h3>
                  <p className="text-gray-500">{selectedApp.department} - {selectedApp.jobType}</p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Status</p>
                  <div className={`p-4 ${getStatusConfig(selectedApp.status).bgColor} rounded-lg`}>
                    <div className="flex items-center gap-2 mb-2">
                      {(() => {
                        const config = getStatusConfig(selectedApp.status);
                        const Icon = config.icon;
                        return (
                          <>
                            <Icon className={`w-5 h-5 ${config.color}`} />
                            <span className={`font-semibold ${config.color}`}>{config.label}</span>
                          </>
                        );
                      })()}
                    </div>
                    <p className={`text-sm ${getStatusConfig(selectedApp.status).color}`}>
                      {getStatusConfig(selectedApp.status).description}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Timeline</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Applied on:</span>
                      <span className="font-medium">{new Date(selectedApp.createdAt).toLocaleDateString('en-PH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    {selectedApp.updatedAt && selectedApp.updatedAt !== selectedApp.createdAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last updated:</span>
                        <span className="font-medium">{new Date(selectedApp.updatedAt).toLocaleDateString('en-PH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                {selectedApp.coverLetter && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Your Cover Letter</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedApp.coverLetter}</p>
                    </div>
                  </div>
                )}

                {/* Resume */}
                {selectedApp.resumeUrl && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Your Resume</p>
                    <a
                      href={`${getBaseURL()}${selectedApp.resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary-600 hover:underline"
                    >
                      <FiFileText className="w-4 h-4" />
                      View Resume
                    </a>
                  </div>
                )}
              </div>
              <div className="p-6 border-t bg-gray-50">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="w-full btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
