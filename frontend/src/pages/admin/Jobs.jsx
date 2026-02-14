import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiBriefcase, FiMapPin, FiClock, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const AdminJobs = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Fetch all jobs
  const { data: jobsList, isLoading } = useQuery({
    queryKey: ['adminJobs'],
    queryFn: () => api.get('/jobs/admin/all').then(res => res.data)
  });

  // Create job mutation
  const createJob = useMutation({
    mutationFn: (data) => api.post('/jobs', data),
    onSuccess: () => {
      toast.success('Job posting created!');
      queryClient.invalidateQueries(['adminJobs']);
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create job posting.');
    }
  });

  // Update job mutation
  const updateJob = useMutation({
    mutationFn: ({ id, data }) => api.put(`/jobs/${id}`, data),
    onSuccess: () => {
      toast.success('Job posting updated!');
      queryClient.invalidateQueries(['adminJobs']);
      setEditingJob(null);
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update job posting.');
    }
  });

  // Delete job mutation
  const deleteJob = useMutation({
    mutationFn: (id) => api.delete(`/jobs/${id}`),
    onSuccess: () => {
      toast.success('Job posting deleted!');
      queryClient.invalidateQueries(['adminJobs']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete job posting.');
    }
  });

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteJob.mutate(id);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingJob(null);
    setShowModal(true);
  };

  return (
    <div className="py-6 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition mb-4 text-sm"
          >
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Manage Job Postings</h1>
              <p className="text-gray-600 text-sm">Create and manage hospital job openings and hiring posts.</p>
            </div>
            <button onClick={handleAdd} className="btn btn-primary flex items-center gap-2 w-full sm:w-auto justify-center text-sm">
              <FiPlus /> Create Job Posting
            </button>
          </div>
        </div>

        {/* Jobs List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : jobsList?.length === 0 ? (
          <div className="card text-center py-12">
            <FiBriefcase className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Job Postings Yet</h3>
            <p className="text-gray-500 mb-6 text-sm">Create your first job posting to get started.</p>
            <button onClick={handleAdd} className="btn btn-primary">
              Create First Job Posting
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {jobsList?.map((job) => (
              <div key={job.id} className="card p-4 sm:p-5">
                <div className="flex flex-col gap-3">
                  {/* Title + Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1.5">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          job.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {job.type}
                        </span>
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(job)}
                        className="p-2.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id, job.title)}
                        className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <p className="text-primary-600 font-medium text-sm mb-1">{job.department}</p>
                    <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="text-primary-600 w-3.5 h-3.5" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock className="text-primary-600 w-3.5 h-3.5" />
                      {new Date(job.createdAt).toLocaleDateString('en-PH')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <JobModal
            job={editingJob}
            onClose={() => {
              setShowModal(false);
              setEditingJob(null);
            }}
            onSubmit={(data) => {
              if (editingJob) {
                updateJob.mutate({ id: editingJob.id, data });
              } else {
                createJob.mutate(data);
              }
            }}
            isLoading={createJob.isPending || updateJob.isPending}
          />
        )}
      </div>
    </div>
  );
};

// Job Modal Component
const JobModal = ({ job, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    department: job?.department || '',
    type: job?.type || 'Full-time',
    location: job?.location || 'General Santos City',
    description: job?.description || '',
    requirements: job?.requirements || '',
    isActive: job?.isActive ?? true
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const departments = [
    'Nursing Department',
    'Laboratory Department',
    'Pharmacy Department',
    'Radiology Department',
    'Emergency Department',
    'Surgery Department',
    'Pediatrics Department',
    'OB-GYN Department',
    'Cardiology Department',
    'Administration',
    'Human Resources',
    'Finance Department',
    'IT Department',
    'Housekeeping',
    'Security',
    'Other'
  ];

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-lg shadow-xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-xl font-semibold">
            {job ? 'Edit Job Posting' : 'Create New Job Posting'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <FiX size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input"
                placeholder="e.g., Registered Nurse"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input"
                placeholder="e.g., General Santos City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="input"
                placeholder="Describe the job responsibilities and duties..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                className="input"
                placeholder="List the qualifications and requirements..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active (visible to public)
              </label>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6 pt-6 border-t">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1 py-2.5">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn btn-primary flex-1 py-2.5">
              {isLoading ? 'Saving...' : job ? 'Update Job Posting' : 'Create Job Posting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminJobs;
