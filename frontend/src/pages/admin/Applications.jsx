import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FiArrowLeft,
  FiFileText,
  FiDownload,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiBriefcase,
  FiFilter,
  FiX,
  FiEye,
  FiCheck,
  FiClock,
  FiUserCheck,
  FiXCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { getBaseURL } from '../../utils/url';

const AdminApplications = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch all applications
  const { data: applications, isLoading } = useQuery({
    queryKey: ['adminApplications', statusFilter, jobFilter],
    queryFn: () => {
      let url = '/applications/all';
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (jobFilter) params.append('jobId', jobFilter);
      if (params.toString()) url += `?${params.toString()}`;
      return api.get(url).then(res => res.data);
    }
  });

  // Fetch all jobs for filter dropdown
  const { data: jobs } = useQuery({
    queryKey: ['adminJobsList'],
    queryFn: () => api.get('/jobs/admin/all').then(res => res.data)
  });

  // Fetch application stats
  const { data: stats } = useQuery({
    queryKey: ['applicationStats'],
    queryFn: () => api.get('/applications/stats').then(res => res.data)
  });

  // Update application mutation
  const updateApp = useMutation({
    mutationFn: ({ id, data }) => api.put(`/applications/${id}`, data),
    onSuccess: () => {
      toast.success('Application updated!');
      queryClient.invalidateQueries(['adminApplications']);
      queryClient.invalidateQueries(['applicationStats']);
      setShowModal(false);
      setSelectedApp(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update application.');
    }
  });

  // Delete application mutation
  const deleteApp = useMutation({
    mutationFn: (id) => api.delete(`/applications/${id}`),
    onSuccess: () => {
      toast.success('Application deleted!');
      queryClient.invalidateQueries(['adminApplications']);
      queryClient.invalidateQueries(['applicationStats']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete application.');
    }
  });

  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const handleStatusUpdate = (id, status) => {
    updateApp.mutate({ id, data: { status } });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the application from ${name}?`)) {
      deleteApp.mutate(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'reviewing': return 'bg-blue-100 text-blue-700';
      case 'interviewed': return 'bg-purple-100 text-purple-700';
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock />;
      case 'reviewing': return <FiEye />;
      case 'interviewed': return <FiUserCheck />;
      case 'accepted': return <FiCheck />;
      case 'rejected': return <FiXCircle />;
      default: return <FiFileText />;
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Manage Job Applications</h1>
              <p className="text-gray-600">Review and manage candidate applications for job postings.</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-8">
          <div className="card text-center p-3 sm:p-5">
            <p className="text-lg sm:text-2xl font-bold text-gray-800">{stats?.total || 0}</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>
          <div className="card text-center bg-yellow-50 p-3 sm:p-5">
            <p className="text-lg sm:text-2xl font-bold text-yellow-600">{stats?.pending || 0}</p>
            <p className="text-sm text-yellow-700">Pending</p>
          </div>
          <div className="card text-center bg-blue-50 p-3 sm:p-5">
            <p className="text-lg sm:text-2xl font-bold text-blue-600">{stats?.reviewing || 0}</p>
            <p className="text-sm text-blue-700">Reviewing</p>
          </div>
          <div className="card text-center bg-purple-50 p-3 sm:p-5">
            <p className="text-lg sm:text-2xl font-bold text-purple-600">{stats?.interviewed || 0}</p>
            <p className="text-sm text-purple-700">Interviewed</p>
          </div>
          <div className="card text-center bg-green-50 p-3 sm:p-5">
            <p className="text-lg sm:text-2xl font-bold text-green-600">{stats?.accepted || 0}</p>
            <p className="text-sm text-green-700">Accepted</p>
          </div>
          <div className="card text-center bg-red-50 p-3 sm:p-5">
            <p className="text-lg sm:text-2xl font-bold text-red-600">{stats?.rejected || 0}</p>
            <p className="text-sm text-red-700">Rejected</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <FiFilter />
              <span className="font-medium">Filters:</span>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input w-full sm:w-auto"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="interviewed">Interviewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="input w-full sm:w-auto"
              >
                <option value="">All Jobs</option>
                {jobs?.map((job) => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
              {(statusFilter || jobFilter) && (
                <button
                  onClick={() => { setStatusFilter(''); setJobFilter(''); }}
                  className="text-primary-600 hover:underline text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : applications?.length === 0 ? (
          <div className="card text-center py-12">
            <FiFileText className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Applications Found</h3>
            <p className="text-gray-500">
              {statusFilter || jobFilter ? 'Try adjusting your filters.' : 'No job applications have been submitted yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications?.map((app) => (
              <div key={app.id} className="card hover:shadow-md transition">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">
                        {app.applicant.firstName} {app.applicant.lastName}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>

                    <p className="text-primary-600 font-medium mb-2 flex items-center gap-2">
                      <FiBriefcase className="text-sm" />
                      {app.jobTitle} - {app.department}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FiMail className="text-primary-600" />
                        {app.applicant.email}
                      </span>
                      {app.applicant.phone && (
                        <span className="flex items-center gap-1">
                          <FiPhone className="text-primary-600" />
                          {app.applicant.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FiCalendar className="text-primary-600" />
                        {new Date(app.createdAt).toLocaleDateString('en-PH')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {app.resumeUrl && (
                      <a
                        href={`${getBaseURL()}${app.resumeUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary text-sm flex items-center gap-1"
                      >
                        <FiDownload /> Resume
                      </a>
                    )}
                    <button
                      onClick={() => handleViewDetails(app)}
                      className="btn btn-primary text-sm flex items-center gap-1"
                    >
                      <FiEye /> View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Application Detail Modal */}
        {showModal && selectedApp && (
          <ApplicationModal
            application={selectedApp}
            onClose={() => { setShowModal(false); setSelectedApp(null); }}
            onStatusUpdate={(status, notes) => updateApp.mutate({ id: selectedApp.id, data: { status, adminNotes: notes } })}
            onDelete={() => handleDelete(selectedApp.id, `${selectedApp.applicant.firstName} ${selectedApp.applicant.lastName}`)}
            isLoading={updateApp.isPending}
          />
        )}
      </div>
    </div>
  );
};

// Application Detail Modal
const ApplicationModal = ({ application, onClose, onStatusUpdate, onDelete, isLoading }) => {
  const [status, setStatus] = useState(application.status);
  const [adminNotes, setAdminNotes] = useState(application.adminNotes || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onStatusUpdate(status, adminNotes);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'reviewing': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'interviewed': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'accepted': return 'bg-green-100 text-green-700 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Application Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Applicant Info */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <FiUser className="text-primary-600" />
              Applicant Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p><span className="font-medium">Name:</span> {application.applicant.firstName} {application.applicant.lastName}</p>
              <p><span className="font-medium">Email:</span> {application.applicant.email}</p>
              {application.applicant.phone && (
                <p><span className="font-medium">Phone:</span> {application.applicant.phone}</p>
              )}
            </div>
          </div>

          {/* Job Info */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <FiBriefcase className="text-primary-600" />
              Position Applied For
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p><span className="font-medium">Job Title:</span> {application.jobTitle}</p>
              <p><span className="font-medium">Department:</span> {application.department}</p>
              <p><span className="font-medium">Type:</span> {application.jobType}</p>
              <p><span className="font-medium">Applied On:</span> {new Date(application.createdAt).toLocaleString('en-PH')}</p>
            </div>
          </div>

          {/* Cover Letter */}
          {application.coverLetter && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FiFileText className="text-primary-600" />
                Cover Letter
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="whitespace-pre-wrap text-gray-700">{application.coverLetter}</p>
              </div>
            </div>
          )}

          {/* Resume */}
          {application.resumeUrl && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Resume</h3>
              <a
                href={`${getBaseURL()}${application.resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary inline-flex items-center gap-2"
              >
                <FiDownload /> Download Resume
              </a>
            </div>
          )}

          {/* Status Update Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Status</label>
              <div className="flex flex-wrap gap-2">
                {['pending', 'reviewing', 'interviewed', 'accepted', 'rejected'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                      status === s ? getStatusColor(s) + ' border-2' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (Internal)</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                className="input"
                placeholder="Add internal notes about this application..."
              />
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this application?')) {
                    onDelete();
                    onClose();
                  }
                }}
                className="btn bg-red-100 text-red-600 hover:bg-red-200"
              >
                Delete
              </button>
              <div className="flex-1"></div>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="btn btn-primary">
                {isLoading ? 'Saving...' : 'Update Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminApplications;
