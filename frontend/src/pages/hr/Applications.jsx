import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FiFileText,
  FiUser,
  FiMail,
  FiPhone,
  FiDownload,
  FiEye,
  FiCheck,
  FiX,
  FiArrowLeft,
  FiFilter,
  FiArrowRight,
  FiUserCheck,
  FiUserX,
  FiLoader
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { getBaseURL } from '../../utils/url';

const HRApplications = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch applications
  const { data: applications, isLoading } = useQuery({
    queryKey: ['hrApplications', filter],
    queryFn: () => {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      return api.get(`/applications/all${params}`).then(res => res.data);
    }
  });

  // Update status mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, status, adminNotes }) => api.put(`/applications/${id}`, { status, adminNotes }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['hrApplications']);
      queryClient.invalidateQueries(['applicationStats']);
      setUpdatingId(null);
      if (selectedApp) {
        setSelectedApp(null);
      }
      const statusMessages = {
        reviewing: 'Application moved to Reviewing',
        interviewed: 'Application moved to Interviewed',
        accepted: 'Application Accepted!',
        rejected: 'Application Rejected',
        pending: 'Application moved to Pending'
      };
      toast.success(statusMessages[variables.status] || 'Status updated');
    },
    onError: () => {
      setUpdatingId(null);
      toast.error('Failed to update status');
    }
  });

  // Quick status update handler
  const handleQuickStatusUpdate = (appId, newStatus) => {
    setUpdatingId(appId);
    updateMutation.mutate({ id: appId, status: newStatus });
  };

  // Get next status in workflow
  const getNextStatus = (currentStatus) => {
    const workflow = {
      pending: 'reviewing',
      reviewing: 'interviewed',
      interviewed: 'accepted'
    };
    return workflow[currentStatus] || null;
  };

  // Get next status label
  const getNextStatusLabel = (currentStatus) => {
    const labels = {
      pending: 'Start Review',
      reviewing: 'Mark Interviewed',
      interviewed: 'Accept'
    };
    return labels[currentStatus] || null;
  };

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

  const statusOptions = ['pending', 'reviewing', 'interviewed', 'accepted', 'rejected'];

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link to="/hr/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2 text-sm">
            <FiArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Job Applications</h1>
            <div className="flex items-center gap-2">
              <FiFilter className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="interviewed">Interviewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : applications?.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {applications.map((app) => (
                <div key={app.id} className="p-4 sm:p-6 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                          {app.applicant?.firstName} {app.applicant?.lastName}
                        </h3>
                        <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-primary-600 font-medium text-sm mb-1.5">{app.jobTitle}</p>
                      <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiMail className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[150px] sm:max-w-none">{app.applicant?.email}</span>
                        </span>
                        {app.applicant?.phone && (
                          <span className="flex items-center gap-1">
                            <FiPhone className="w-3.5 h-3.5" />
                            {app.applicant?.phone}
                          </span>
                        )}
                        <span className="text-gray-400">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Action Buttons - Only show if not accepted/rejected */}
                      {app.status !== 'accepted' && app.status !== 'rejected' && (
                        <div className="flex items-center gap-1.5">
                          {/* Proceed to Next Step */}
                          {getNextStatus(app.status) && (
                            <button
                              onClick={() => handleQuickStatusUpdate(app.id, getNextStatus(app.status))}
                              disabled={updatingId === app.id}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                              title={getNextStatusLabel(app.status)}
                            >
                              {updatingId === app.id ? (
                                <FiLoader className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <FiArrowRight className="w-4 h-4" />
                                  <span className="hidden sm:inline">{getNextStatusLabel(app.status)}</span>
                                </>
                              )}
                            </button>
                          )}

                          {/* Reject Button */}
                          <button
                            onClick={() => handleQuickStatusUpdate(app.id, 'rejected')}
                            disabled={updatingId === app.id}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            title="Reject Application"
                          >
                            {updatingId === app.id ? (
                              <FiLoader className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <FiUserX className="w-4 h-4" />
                                <span className="hidden sm:inline">Reject</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Status indicator for completed applications */}
                      {app.status === 'accepted' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-green-100 text-green-700 text-xs sm:text-sm font-medium rounded-lg">
                          <FiUserCheck className="w-4 h-4" />
                          Accepted
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-red-100 text-red-700 text-xs sm:text-sm font-medium rounded-lg">
                          <FiUserX className="w-4 h-4" />
                          Rejected
                        </span>
                      )}

                      {/* View & Download Buttons */}
                      <div className="flex items-center gap-1">
                        {app.resumeUrl && (
                          <a
                            href={`${getBaseURL()}${app.resumeUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                            title="Download Resume"
                          >
                            <FiDownload className="w-4 h-4 sm:w-5 sm:h-5" />
                          </a>
                        )}
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {app.coverLetter && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{app.coverLetter}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <FiFileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No applications found</p>
            </div>
          )}
        </div>

        {/* Application Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Application Details</h2>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FiX size={22} />
                </button>
              </div>
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Applicant Info */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Applicant Information</h3>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="font-semibold text-gray-800 text-base sm:text-lg">
                      {selectedApp.applicant?.firstName} {selectedApp.applicant?.lastName}
                    </p>
                    <p className="text-gray-600 text-sm truncate">{selectedApp.applicant?.email}</p>
                    {selectedApp.applicant?.phone && (
                      <p className="text-gray-600 text-sm">{selectedApp.applicant?.phone}</p>
                    )}
                  </div>
                </div>

                {/* Job Info */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Position Applied</h3>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">{selectedApp.jobTitle}</p>
                    <p className="text-gray-600 text-sm">{selectedApp.department} - {selectedApp.jobType}</p>
                  </div>
                </div>

                {/* Cover Letter */}
                {selectedApp.coverLetter && (
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Cover Letter</h3>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <p className="text-gray-600 text-sm whitespace-pre-wrap">{selectedApp.coverLetter}</p>
                    </div>
                  </div>
                )}

                {/* Resume */}
                {selectedApp.resumeUrl && (
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Resume</h3>
                    <a
                      href={`${getBaseURL()}${selectedApp.resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary-600 hover:underline text-sm"
                    >
                      <FiDownload className="w-4 h-4" />
                      Download Resume
                    </a>
                  </div>
                )}

                {/* Update Status */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-3">Update Status</h3>

                  {/* Workflow Status Steps */}
                  <div className="flex items-center justify-between mb-4 bg-gray-50 rounded-lg p-2 sm:p-3 overflow-x-auto">
                    {statusOptions.filter(s => s !== 'rejected').map((status, index, arr) => (
                      <div key={status} className="flex items-center flex-shrink-0">
                        <button
                          onClick={() => {
                            setUpdatingId(selectedApp.id);
                            updateMutation.mutate({ id: selectedApp.id, status });
                          }}
                          disabled={updateMutation.isPending}
                          className={`flex flex-col items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-lg transition-colors ${
                            selectedApp.status === status
                              ? 'bg-primary-600 text-white'
                              : statusOptions.indexOf(selectedApp.status) > statusOptions.indexOf(status)
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                          }`}
                        >
                          <span className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full text-[10px] sm:text-xs font-bold border-2 border-current">
                            {index + 1}
                          </span>
                          <span className="text-[10px] sm:text-xs font-medium capitalize">{status}</span>
                        </button>
                        {index < arr.length - 1 && (
                          <FiArrowRight className={`mx-0.5 sm:mx-1 w-3 h-3 sm:w-4 sm:h-4 ${
                            statusOptions.indexOf(selectedApp.status) > statusOptions.indexOf(status)
                              ? 'text-green-500'
                              : 'text-gray-300'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Reject Button */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {selectedApp.status !== 'rejected' ? (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to reject this application?')) {
                            setUpdatingId(selectedApp.id);
                            updateMutation.mutate({ id: selectedApp.id, status: 'rejected' });
                          }
                        }}
                        disabled={updateMutation.isPending}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
                      >
                        <FiUserX className="w-4 h-4" />
                        Reject Application
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                          <FiUserX className="w-4 h-4" />
                          Rejected
                        </span>
                        <button
                          onClick={() => {
                            setUpdatingId(selectedApp.id);
                            updateMutation.mutate({ id: selectedApp.id, status: 'pending' });
                          }}
                          disabled={updateMutation.isPending}
                          className="text-sm text-primary-600 hover:underline"
                        >
                          Undo rejection
                        </button>
                      </div>
                    )}

                    {updateMutation.isPending && updatingId === selectedApp.id && (
                      <FiLoader className="w-5 h-5 animate-spin text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Admin Notes</h3>
                  <textarea
                    rows={3}
                    defaultValue={selectedApp.adminNotes || ''}
                    className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="Add notes about this application..."
                    onBlur={(e) => {
                      if (e.target.value !== selectedApp.adminNotes) {
                        updateMutation.mutate({ id: selectedApp.id, adminNotes: e.target.value });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRApplications;
