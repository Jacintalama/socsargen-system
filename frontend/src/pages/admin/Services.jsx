import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiActivity, FiUpload, FiArrowLeft, FiStar, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { getBaseURL } from '../../utils/url';

const API_URL = getBaseURL();

const AdminServices = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');

  // Fetch all services (including inactive)
  const { data: services, isLoading } = useQuery({
    queryKey: ['adminServices'],
    queryFn: () => api.get('/services/admin/all').then(res => res.data)
  });

  // Fetch categories for filter
  const { data: categories } = useQuery({
    queryKey: ['serviceCategories'],
    queryFn: () => api.get('/services/categories').then(res => res.data)
  });

  // Create service mutation
  const createService = useMutation({
    mutationFn: (data) => api.post('/services', data),
    onSuccess: () => {
      toast.success('Service created successfully!');
      queryClient.invalidateQueries(['adminServices']);
      queryClient.invalidateQueries(['serviceCategories']);
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create service.');
    }
  });

  // Update service mutation
  const updateService = useMutation({
    mutationFn: ({ id, data }) => api.put(`/services/${id}`, data),
    onSuccess: () => {
      toast.success('Service updated successfully!');
      queryClient.invalidateQueries(['adminServices']);
      queryClient.invalidateQueries(['serviceCategories']);
      setEditingService(null);
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update service.');
    }
  });

  // Delete service mutation
  const deleteService = useMutation({
    mutationFn: (id) => api.delete(`/services/${id}`),
    onSuccess: () => {
      toast.success('Service deleted successfully!');
      queryClient.invalidateQueries(['adminServices']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete service.');
    }
  });

  // Toggle active status
  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }) => api.put(`/services/${id}`, { isActive }),
    onSuccess: () => {
      toast.success('Service status updated!');
      queryClient.invalidateQueries(['adminServices']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update status.');
    }
  });

  // Toggle featured status
  const toggleFeatured = useMutation({
    mutationFn: ({ id, isFeatured }) => api.put(`/services/${id}`, { isFeatured }),
    onSuccess: () => {
      toast.success('Featured status updated!');
      queryClient.invalidateQueries(['adminServices']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update status.');
    }
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteService.mutate(id);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingService(null);
    setShowModal(true);
  };

  // Filter services by category
  const filteredServices = filterCategory
    ? services?.filter(s => s.category === filterCategory)
    : services;

  // Get unique categories from all services (including inactive)
  const allCategories = [...new Set(services?.map(s => s.category).filter(Boolean))];

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
              <h1 className="text-xl sm:text-2xl font-bold">Manage Services</h1>
              <p className="text-gray-600 text-sm">Create and manage hospital services displayed on the website.</p>
            </div>
            <button onClick={handleAdd} className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto text-sm">
              <FiPlus /> Add Service
            </button>
          </div>
        </div>

        {/* Filter */}
        {allCategories.length > 0 && (
          <div className="mb-4 sm:mb-6">
            {/* Mobile: Dropdown */}
            <div className="sm:hidden">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input text-sm w-full"
              >
                <option value="">All Categories ({services?.length || 0})</option>
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat} ({services?.filter(s => s.category === cat).length || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop: Pills */}
            <div className="hidden sm:flex flex-wrap gap-2">
              <button
                onClick={() => setFilterCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filterCategory === ''
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({services?.length || 0})
              </button>
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    filterCategory === cat
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat} ({services?.filter(s => s.category === cat).length || 0})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Services List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredServices?.length === 0 ? (
          <div className="card text-center py-12">
            <FiActivity className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Services Yet</h3>
            <p className="text-gray-500 mb-6 text-sm">Create your first service to display on the website.</p>
            <button onClick={handleAdd} className="btn btn-primary">
              Add First Service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredServices?.map((service) => (
              <div key={service.id} className={`card overflow-hidden ${!service.is_active ? 'opacity-60' : ''}`}>
                {/* Service Image */}
                <div className="h-32 sm:h-40 bg-gradient-to-br from-primary-500 to-primary-600 relative -mx-6 -mt-6 mb-3 sm:mb-4">
                  {service.image_url ? (
                    <img
                      src={`${API_URL}${service.image_url}`}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiActivity className="text-white/30 text-4xl sm:text-5xl" />
                    </div>
                  )}
                  {/* Status badges */}
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    {service.is_featured && (
                      <span className="bg-yellow-400 text-yellow-900 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex items-center gap-1">
                        <FiStar size={10} /> Featured
                      </span>
                    )}
                    {!service.is_active && (
                      <span className="bg-gray-600 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>

                {/* Service Info */}
                <div className="mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs font-medium text-primary-600 bg-primary-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                    {service.category || 'General'}
                  </span>
                  <h3 className="font-semibold text-base sm:text-lg mt-1.5 sm:mt-2">{service.name}</h3>
                  {service.description && (
                    <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">{service.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 sm:gap-2 pt-3 sm:pt-4 border-t">
                  <button
                    onClick={() => toggleActive.mutate({ id: service.id, isActive: !service.is_active })}
                    className={`p-2.5 sm:p-2 rounded-lg transition ${
                      service.is_active
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={service.is_active ? 'Hide from website' : 'Show on website'}
                  >
                    {service.is_active ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => toggleFeatured.mutate({ id: service.id, isFeatured: !service.is_featured })}
                    className={`p-2.5 sm:p-2 rounded-lg transition ${
                      service.is_featured
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={service.is_featured ? 'Remove from featured' : 'Mark as featured'}
                  >
                    <FiStar className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2.5 sm:p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                    title="Edit"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id, service.name)}
                    className="p-2.5 sm:p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition ml-auto"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <ServiceModal
            service={editingService}
            categories={allCategories}
            onClose={() => {
              setShowModal(false);
              setEditingService(null);
            }}
            onSubmit={(data) => {
              if (editingService) {
                updateService.mutate({ id: editingService.id, data });
              } else {
                createService.mutate(data);
              }
            }}
            isLoading={createService.isPending || updateService.isPending}
          />
        )}
      </div>
    </div>
  );
};

// Service Modal Component
const ServiceModal = ({ service, categories, onClose, onSubmit, isLoading }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    category: service?.category || '',
    imageUrl: service?.image_url || '',
    isFeatured: service?.is_featured ?? false,
    isActive: service?.is_active ?? true,
    displayOrder: service?.display_order || 0
  });
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(service?.image_url ? `${API_URL}${service.image_url}` : '');
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === '__new__') {
      setShowNewCategory(true);
      setFormData({ ...formData, category: '' });
    } else {
      setShowNewCategory(false);
      setFormData({ ...formData, category: value });
    }
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
    setFormData({ ...formData, category: e.target.value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only image files are allowed (JPEG, PNG, GIF, WebP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large. Maximum size is 5MB.');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData({ ...formData, imageUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = formData.imageUrl;

    // Upload image if a new file is selected
    if (selectedFile) {
      setUploading(true);
      try {
        const uploadData = new FormData();
        uploadData.append('image', selectedFile);

        const response = await api.post('/upload/image', uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        imageUrl = response.data.imageUrl;
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to upload image.');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    onSubmit({ ...formData, imageUrl });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-lg shadow-xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-xl font-semibold">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <FiX size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="space-y-4">
            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input text-sm"
                placeholder="e.g., Emergency Care, Cardiac Surgery"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              {!showNewCategory ? (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  required
                  className="input text-sm"
                >
                  <option value="">Select a category</option>
                  {categories?.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="__new__">+ Add New Category</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={handleNewCategoryChange}
                    required
                    className="input flex-1 text-sm"
                    placeholder="Enter new category name"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCategory('');
                      setFormData({ ...formData, category: '' });
                    }}
                    className="btn btn-secondary text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input text-sm"
                placeholder="Describe the service, what it offers, who it's for, etc."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Image</label>

              {/* Image Preview */}
              {previewUrl ? (
                <div className="relative mb-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-36 sm:h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition"
                    title="Remove image"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center mb-3">
                  <FiActivity className="mx-auto text-3xl sm:text-4xl text-gray-300 mb-2" />
                  <p className="text-gray-500 text-xs sm:text-sm">No image selected</p>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="serviceImageUpload"
                />
                <label
                  htmlFor="serviceImageUpload"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition text-sm"
                >
                  <FiUpload />
                  {previewUrl ? 'Change Image' : 'Upload Image'}
                </label>
                <span className="text-xs text-gray-500 text-center sm:text-left">
                  JPEG, PNG, GIF, WebP (max 5MB)
                </span>
              </div>
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order <span className="text-gray-400">(lower = first)</span>
              </label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                min="0"
                className="input w-32 text-sm"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                  Featured Service
                </label>
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
                  Active (visible on website)
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6 pt-6 border-t">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1 py-2.5">
              Cancel
            </button>
            <button type="submit" disabled={isLoading || uploading} className="btn btn-primary flex-1 py-2.5">
              {uploading ? 'Uploading...' : isLoading ? 'Saving...' : service ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminServices;
