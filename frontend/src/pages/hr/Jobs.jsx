import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FiPlus,
  FiBriefcase,
  FiEdit2,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiArrowLeft,
  FiMapPin,
  FiX
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const HRJobs = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    jobType: 'Full-time',
    location: 'General Santos City',
    description: '',
    requirements: '',
    isActive: true
  });

  // Fetch jobs
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['hrJobs'],
    queryFn: () => api.get('/jobs/admin/all').then(res => res.data)
  });

  // Create job mutation
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/jobs', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['hrJobs']);
      setShowModal(false);
      resetForm();
    }
  });

  // Update job mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/jobs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['hrJobs']);
      setShowModal(false);
      resetForm();
    }
  });

  // Delete job mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/jobs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['hrJobs']);
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      jobType: 'Full-time',
      location: 'General Santos City',
      description: '',
      requirements: '',
      isActive: true
    });
    setEditingJob(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingJob) {
      updateMutation.mutate({ id: editingJob.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      jobType: job.jobType,
      location: job.location,
      description: job.description,
      requirements: job.requirements || '',
      isActive: job.isActive
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      deleteMutation.mutate(id);
    }
  };

  const toggleStatus = (job) => {
    updateMutation.mutate({
      id: job.id,
      data: { ...job, isActive: !job.isActive }
    });
  };

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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Job Postings</h1>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto text-sm font-medium"
            >
              <FiPlus className="w-4 h-4" />
              Add New Job
            </button>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : jobs?.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-800">{job.title}</p>
                          <p className="text-sm text-gray-500">{job.location}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{job.department}</td>
                        <td className="px-6 py-4 text-gray-600">{job.jobType}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleStatus(job)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              job.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {job.isActive ? <FiToggleRight className="w-4 h-4" /> : <FiToggleLeft className="w-4 h-4" />}
                            {job.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleEdit(job)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {jobs.map((job) => (
                  <div key={job.id} className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm">{job.title}</h3>
                        <p className="text-xs text-primary-600 font-medium mt-0.5">{job.department}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(job)}
                          className="p-2.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <button
                        onClick={() => toggleStatus(job)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          job.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {job.isActive ? <FiToggleRight className="w-3.5 h-3.5" /> : <FiToggleLeft className="w-3.5 h-3.5" />}
                        {job.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {job.jobType}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <FiMapPin className="w-3 h-3" />
                      {job.location}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <FiBriefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No job postings yet</p>
              <p className="text-sm mt-1">Click "Add New Job" to create one</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  {editingJob ? 'Edit Job Posting' : 'Add New Job Posting'}
                </h2>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 p-1">
                  <FiX size={22} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                    <input
                      type="text"
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <select
                      value={formData.jobType}
                      onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                      className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Temporary">Temporary</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                  <textarea
                    rows={4}
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="Enter requirements (one per line)"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">Active (visible to applicants)</label>
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="px-4 py-2.5 text-gray-600 hover:text-gray-800 border rounded-lg sm:border-0 text-sm font-medium flex-1 sm:flex-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium flex-1 sm:flex-none"
                  >
                    {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRJobs;
