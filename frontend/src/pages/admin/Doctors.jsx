import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiCalendar, FiUser, FiX, FiCheck, FiSearch, FiArrowLeft, FiTrash2, FiUpload, FiCamera } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { getBaseURL } from '../../utils/url';

const API_URL = getBaseURL();

const AdminDoctors = () => {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all doctors (including unavailable ones for admin)
  const { data: doctors, isLoading } = useQuery({
    queryKey: ['adminDoctors'],
    queryFn: () => api.get('/doctors/admin/all').then(res => res.data)
  });

  // Create doctor mutation
  const createDoctor = useMutation({
    mutationFn: (data) => api.post('/doctors', data),
    onSuccess: () => {
      toast.success('Doctor added successfully!');
      queryClient.invalidateQueries(['adminDoctors']);
      setShowAddModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to add doctor.');
    }
  });

  // Update doctor mutation
  const updateDoctor = useMutation({
    mutationFn: ({ id, data }) => api.put(`/doctors/${id}`, data),
    onSuccess: () => {
      toast.success('Doctor updated successfully!');
      queryClient.invalidateQueries(['adminDoctors']);
      setEditingDoctor(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update doctor.');
    }
  });

  // Add schedule mutation
  const addSchedule = useMutation({
    mutationFn: ({ doctorId, data }) => api.post(`/doctors/${doctorId}/schedule`, data),
    onSuccess: () => {
      toast.success('Schedule added successfully!');
      queryClient.invalidateQueries(['adminDoctors']);
      setShowScheduleModal(false);
      setSelectedDoctor(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to add schedule.');
    }
  });

  // Delete doctor mutation
  const deleteDoctor = useMutation({
    mutationFn: (id) => api.delete(`/doctors/${id}`),
    onSuccess: () => {
      toast.success('Doctor deleted successfully!');
      queryClient.invalidateQueries(['adminDoctors']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete doctor.');
    }
  });

  const handleDelete = (doctor) => {
    if (window.confirm(`Are you sure you want to delete Dr. ${doctor.fullName}? This action cannot be undone.`)) {
      deleteDoctor.mutate(doctor.id);
    }
  };

  // Filter doctors by search term
  const filteredDoctors = doctors?.filter(doc =>
    doc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h1 className="text-2xl font-bold">Manage Doctors</h1>
              <p className="text-gray-600">Add, edit, and manage doctor profiles and schedules.</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary flex items-center gap-2 w-fit"
            >
              <FiPlus /> Add New Doctor
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="card mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors by name, specialization, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Doctors List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredDoctors?.length === 0 ? (
          <div className="card text-center py-12">
            <FiUser className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Doctors Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'No doctors match your search.' : 'No doctors have been added yet.'}
            </p>
            {!searchTerm && (
              <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                Add Your First Doctor
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredDoctors?.map((doctor) => (
              <div key={doctor.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${doctor.photoUrl ? '' : 'bg-primary-100 p-3'} rounded-full overflow-hidden`}>
                      {doctor.photoUrl ? (
                        <img
                          src={`${API_URL}${doctor.photoUrl}`}
                          alt={doctor.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <FiUser className="text-primary-600 text-xl" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{doctor.fullName}</h3>
                      <p className="text-sm text-gray-500">{doctor.specialization}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    doctor.isAvailable
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {doctor.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                {doctor.department && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Department:</span> {doctor.department}
                  </p>
                )}

                {doctor.consultationFee && (
                  <p className="text-sm text-gray-600 mb-4">
                    <span className="font-medium">Consultation Fee:</span> PHP {doctor.consultationFee}
                  </p>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => setEditingDoctor(doctor)}
                    className="btn btn-secondary flex-1 flex items-center justify-center gap-1 text-sm"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setShowScheduleModal(true);
                    }}
                    className="btn btn-outline flex-1 flex items-center justify-center gap-1 text-sm"
                  >
                    <FiCalendar /> Schedule
                  </button>
                  <button
                    onClick={() => handleDelete(doctor)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    title="Delete Doctor"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Doctor Modal */}
        {showAddModal && (
          <AddDoctorModal
            onClose={() => setShowAddModal(false)}
            onSubmit={(data) => createDoctor.mutate(data)}
            isLoading={createDoctor.isPending}
          />
        )}

        {/* Edit Doctor Modal */}
        {editingDoctor && (
          <EditDoctorModal
            doctor={editingDoctor}
            onClose={() => setEditingDoctor(null)}
            onSubmit={(data) => updateDoctor.mutate({ id: editingDoctor.id, data })}
            isLoading={updateDoctor.isPending}
          />
        )}

        {/* Add Schedule Modal */}
        {showScheduleModal && selectedDoctor && (
          <AddScheduleModal
            doctor={selectedDoctor}
            onClose={() => {
              setShowScheduleModal(false);
              setSelectedDoctor(null);
            }}
            onSubmit={(data) => addSchedule.mutate({ doctorId: selectedDoctor.id, data })}
            isLoading={addSchedule.isPending}
          />
        )}
      </div>
    </div>
  );
};

// Add Doctor Modal Component
const AddDoctorModal = ({ onClose, onSubmit, isLoading }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    specialization: '',
    department: '',
    licenseNumber: '',
    bio: '',
    consultationFee: '',
    photoUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    setFormData({ ...formData, photoUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let photoUrl = formData.photoUrl;

    if (selectedFile) {
      setUploading(true);
      try {
        const uploadData = new FormData();
        uploadData.append('image', selectedFile);
        const response = await api.post('/upload/image', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        photoUrl = response.data.imageUrl;
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to upload image.');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    onSubmit({ ...formData, photoUrl });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add New Doctor</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Photo Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-primary-100">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                id="photoUpload"
              />
              <label
                htmlFor="photoUpload"
                className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition"
                title="Upload Photo"
              >
                <FiCamera size={16} />
              </label>
              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                  title="Remove Photo"
                >
                  <FiX size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Account Information */}
            <div className="md:col-span-2">
              <h3 className="font-medium text-gray-700 mb-3">Account Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input"
                placeholder="doctor@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="input"
                placeholder="Minimum 6 characters"
              />
            </div>

            {/* Personal Information */}
            <div className="md:col-span-2 mt-4">
              <h3 className="font-medium text-gray-700 mb-3">Personal Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
                placeholder="+63 XXX XXX XXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            {/* Professional Information */}
            <div className="md:col-span-2 mt-4">
              <h3 className="font-medium text-gray-700 mb-3">Professional Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                className="input"
                placeholder="e.g., Cardiology, Pediatrics"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Internal Medicine"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (PHP)</label>
              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                className="input"
                placeholder="500"
                min="0"
                step="0.01"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="input"
                placeholder="Brief description about the doctor..."
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6 pt-6 border-t">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isLoading || uploading} className="btn btn-primary flex-1">
              {uploading ? 'Uploading...' : isLoading ? 'Adding...' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Doctor Modal Component
const EditDoctorModal = ({ doctor, onClose, onSubmit, isLoading }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    specialization: doctor.specialization || '',
    department: doctor.department || '',
    licenseNumber: doctor.licenseNumber || '',
    bio: doctor.bio || '',
    consultationFee: doctor.consultationFee || '',
    isAvailable: doctor.isAvailable ?? true,
    photoUrl: doctor.photoUrl || ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(doctor.photoUrl ? `${API_URL}${doctor.photoUrl}` : '');
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
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
    setFormData({ ...formData, photoUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let photoUrl = formData.photoUrl;

    if (selectedFile) {
      setUploading(true);
      try {
        const uploadData = new FormData();
        uploadData.append('image', selectedFile);
        const response = await api.post('/upload/image', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        photoUrl = response.data.imageUrl;
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to upload image.');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    onSubmit({ ...formData, photoUrl });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Doctor</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Photo Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-primary-100">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                id="editPhotoUpload"
              />
              <label
                htmlFor="editPhotoUpload"
                className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition"
                title="Change Photo"
              >
                <FiCamera size={14} />
              </label>
              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                  title="Remove Photo"
                >
                  <FiX size={12} />
                </button>
              )}
            </div>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg text-center">
            <p className="font-medium">{doctor.fullName}</p>
            <p className="text-sm text-gray-500">{doctor.email}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (PHP)</label>
              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                className="input"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="input"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAvailable"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
                Available for appointments
              </label>
            </div>
          </div>

          <div className="flex gap-4 mt-6 pt-6 border-t">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isLoading || uploading} className="btn btn-primary flex-1">
              {uploading ? 'Uploading...' : isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Schedule Modal Component
const AddScheduleModal = ({ doctor, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    dayOfWeek: '1',
    startTime: '08:00',
    endTime: '17:00',
    maxPatients: '20'
  });

  const days = [
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      dayOfWeek: parseInt(formData.dayOfWeek),
      startTime: formData.startTime,
      endTime: formData.endTime,
      maxPatients: parseInt(formData.maxPatients)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add Schedule</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">{doctor.fullName}</p>
            <p className="text-sm text-gray-500">{doctor.specialization}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
              <select
                name="dayOfWeek"
                value={formData.dayOfWeek}
                onChange={handleChange}
                className="input"
              >
                {days.map((day) => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Patients per Day</label>
              <input
                type="number"
                name="maxPatients"
                value={formData.maxPatients}
                onChange={handleChange}
                min="1"
                className="input"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6 pt-6 border-t">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn btn-primary flex-1">
              {isLoading ? 'Adding...' : 'Add Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDoctors;
