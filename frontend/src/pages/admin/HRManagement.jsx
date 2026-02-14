import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FiUserPlus,
  FiUsers,
  FiMail,
  FiPhone,
  FiToggleLeft,
  FiToggleRight,
  FiTrash2,
  FiArrowLeft
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const HRManagement = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [error, setError] = useState('');

  // Fetch HR accounts
  const { data: hrAccounts, isLoading } = useQuery({
    queryKey: ['hrAccounts'],
    queryFn: () => api.get('/users/hr').then(res => res.data)
  });

  // Create HR mutation
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/users/hr', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['hrAccounts']);
      setShowModal(false);
      resetForm();
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Failed to create HR account');
    }
  });

  // Update status mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }) => api.patch(`/users/${id}/status`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries(['hrAccounts']);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['hrAccounts']);
    }
  });

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: ''
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    createMutation.mutate(formData);
  };

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete ${name}'s account?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2 text-sm">
            <FiArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">HR Management</h1>
              <p className="text-gray-600 mt-1 text-sm">Create and manage HR accounts</p>
            </div>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center text-sm font-medium"
            >
              <FiUserPlus className="w-4 h-4" />
              Add HR Account
            </button>
          </div>
        </div>

        {/* HR Accounts List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : hrAccounts?.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {hrAccounts.map((hr) => (
                      <tr key={hr.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-800">{hr.firstName} {hr.lastName}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-gray-600 text-sm">
                            <FiMail className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{hr.email}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {hr.phone ? (
                            <span className="flex items-center gap-2 text-gray-600 text-sm">
                              <FiPhone className="w-4 h-4 flex-shrink-0" />
                              {hr.phone}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => statusMutation.mutate({ id: hr.id, isActive: !hr.isActive })}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              hr.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {hr.isActive ? <FiToggleRight className="w-4 h-4" /> : <FiToggleLeft className="w-4 h-4" />}
                            {hr.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {new Date(hr.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(hr.id, `${hr.firstName} ${hr.lastName}`)}
                            className="text-red-600 hover:text-red-800 p-2"
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
                {hrAccounts.map((hr) => (
                  <div key={hr.id} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{hr.firstName} {hr.lastName}</p>
                        <p className="text-sm text-gray-500 truncate flex items-center gap-1.5 mt-0.5">
                          <FiMail className="w-3.5 h-3.5 flex-shrink-0" />
                          {hr.email}
                        </p>
                        {hr.phone && (
                          <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <FiPhone className="w-3.5 h-3.5 flex-shrink-0" />
                            {hr.phone}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(hr.id, `${hr.firstName} ${hr.lastName}`)}
                        className="text-red-500 hover:text-red-700 p-2 -mr-2 -mt-1 flex-shrink-0"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => statusMutation.mutate({ id: hr.id, isActive: !hr.isActive })}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                          hr.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {hr.isActive ? <FiToggleRight className="w-3.5 h-3.5" /> : <FiToggleLeft className="w-3.5 h-3.5" />}
                        {hr.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <span className="text-xs text-gray-400">
                        {new Date(hr.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <FiUsers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No HR accounts yet</p>
              <p className="text-sm mt-1">Click "Add HR Account" to create one</p>
            </div>
          )}
        </div>

        {/* Create HR Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Create HR Account</h2>
                <button
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FiArrowLeft className="w-5 h-5 sm:hidden" />
                  <span className="hidden sm:inline text-sm text-gray-500 hover:text-gray-700">Cancel</span>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="px-4 py-2.5 text-gray-600 hover:text-gray-800 border rounded-lg sm:border-0 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium"
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create Account'}
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

export default HRManagement;
