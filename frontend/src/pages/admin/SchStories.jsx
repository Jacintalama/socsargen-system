import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiCheck, FiX, FiVideo, FiUpload, FiArrowLeft, FiPlay, FiStar, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { getBaseURL } from '../../utils/url';

const API_URL = getBaseURL();

const AdminSchStories = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingStory, setEditingStory] = useState(null);

  // Fetch all stories
  const { data: storiesList, isLoading } = useQuery({
    queryKey: ['adminSchStories'],
    queryFn: () => api.get('/sch-stories/admin/all').then(res => res.data)
  });

  // Create story mutation
  const createStory = useMutation({
    mutationFn: (data) => api.post('/sch-stories', data),
    onSuccess: () => {
      toast.success('Story created!');
      queryClient.invalidateQueries(['adminSchStories']);
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create story.');
    }
  });

  // Update story mutation
  const updateStory = useMutation({
    mutationFn: ({ id, data }) => api.put(`/sch-stories/${id}`, data),
    onSuccess: () => {
      toast.success('Story updated!');
      queryClient.invalidateQueries(['adminSchStories']);
      setEditingStory(null);
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update story.');
    }
  });

  // Set active story mutation
  const setActiveStory = useMutation({
    mutationFn: (id) => api.patch(`/sch-stories/${id}/activate`),
    onSuccess: () => {
      toast.success('Story set as active!');
      queryClient.invalidateQueries(['adminSchStories']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to set active story.');
    }
  });

  // Delete story mutation
  const deleteStoryMutation = useMutation({
    mutationFn: (id) => api.delete(`/sch-stories/${id}`),
    onSuccess: () => {
      toast.success('Story deleted!');
      queryClient.invalidateQueries(['adminSchStories']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete story.');
    }
  });

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      deleteStoryMutation.mutate(id);
    }
  };

  const handleSetActive = (id, title) => {
    if (window.confirm(`Set "${title}" as the active story on homepage?`)) {
      setActiveStory.mutate(id);
    }
  };

  const handleEdit = (story) => {
    setEditingStory(story);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingStory(null);
    setShowModal(true);
  };

  const getVideoUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
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
              <h1 className="text-2xl font-bold">SCH Stories</h1>
              <p className="text-gray-600">Manage patient testimonial videos displayed on the homepage.</p>
            </div>
            <button onClick={handleAdd} className="btn btn-primary flex items-center gap-2 w-fit">
              <FiPlus /> Add New Story
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> Only one story can be active at a time. The active story will be displayed on the homepage.
            Old stories are kept for archive purposes and can be reactivated anytime.
          </p>
        </div>

        {/* Stories List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : storiesList?.length === 0 ? (
          <div className="card text-center py-12">
            <FiVideo className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Stories Yet</h3>
            <p className="text-gray-500 mb-6">Upload your first patient story video.</p>
            <button onClick={handleAdd} className="btn btn-primary">
              Add First Story
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storiesList?.map((story) => (
              <div key={story.id} className={`card relative ${story.isActive ? 'ring-2 ring-primary-500' : ''}`}>
                {/* Active Badge */}
                {story.isActive && (
                  <div className="absolute top-3 right-3 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-10">
                    <FiStar className="w-3 h-3" /> Active
                  </div>
                )}

                {/* Video Preview */}
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                  <video
                    src={getVideoUrl(story.videoUrl)}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <FiPlay className="w-12 h-12 text-white opacity-80" />
                  </div>
                </div>

                {/* Story Info */}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-1">{story.title}</h3>
                  <p className="text-primary-600 font-medium text-sm mb-2">{story.patientName}</p>
                  {story.quote && (
                    <p className="text-gray-600 text-sm italic line-clamp-2">"{story.quote}"</p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">{story.year}</span>
                    <span>by {story.uploadedBy}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  <button
                    onClick={() => handleEdit(story)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                  >
                    <FiEdit2 className="w-4 h-4" /> Edit
                  </button>
                  {!story.isActive && (
                    <button
                      onClick={() => handleSetActive(story.id, story.title)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition text-sm font-medium"
                    >
                      <FiCheck className="w-4 h-4" /> Set Active
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(story.id, story.title)}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                    title="Delete story"
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
          <StoryModal
            story={editingStory}
            onClose={() => {
              setShowModal(false);
              setEditingStory(null);
            }}
            onSubmit={(data) => {
              if (editingStory) {
                updateStory.mutate({ id: editingStory.id, data });
              } else {
                createStory.mutate(data);
              }
            }}
            isLoading={createStory.isPending || updateStory.isPending}
          />
        )}
      </div>
    </div>
  );
};

// Story Modal Component
const StoryModal = ({ story, onClose, onSubmit, isLoading }) => {
  const videoInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: story?.title || '',
    patientName: story?.patientName || '',
    quote: story?.quote || '',
    videoUrl: story?.videoUrl || '',
    thumbnailUrl: story?.thumbnailUrl || '',
    year: story?.year || new Date().getFullYear(),
    isActive: story?.isActive ?? false
  });
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(story?.videoUrl ? `${API_URL}${story.videoUrl}` : '');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only video files are allowed (MP4, WebM, OGG)');
        return;
      }

      // Validate file size (100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast.error('Video too large. Maximum size is 100MB.');
        return;
      }

      setSelectedVideo(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveVideo = () => {
    setSelectedVideo(null);
    setVideoPreviewUrl('');
    setFormData({ ...formData, videoUrl: '' });
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let videoUrl = formData.videoUrl;

    // Upload video if a new file is selected
    if (selectedVideo) {
      setUploading(true);
      setUploadProgress(0);
      try {
        const uploadData = new FormData();
        uploadData.append('video', selectedVideo);

        const response = await api.post('/upload/video', uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        });

        videoUrl = response.data.videoUrl;
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to upload video.');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    if (!videoUrl) {
      toast.error('Please upload a video.');
      return;
    }

    onSubmit({ ...formData, videoUrl });
  };

  // Generate year options (last 10 years + next year)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear + 1; y >= currentYear - 10; y--) {
    yearOptions.push(y);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {story ? 'Edit Story' : 'Add New Story'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video *</label>

              {/* Video Preview */}
              {videoPreviewUrl ? (
                <div className="relative mb-3">
                  <video
                    src={videoPreviewUrl}
                    controls
                    className="w-full rounded-lg max-h-64"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition"
                    title="Remove video"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : null}

              {/* Upload Button */}
              <div className="flex items-center gap-3">
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={handleVideoSelect}
                  className="hidden"
                  id="videoUpload"
                />
                <label
                  htmlFor="videoUpload"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                >
                  <FiUpload />
                  {videoPreviewUrl ? 'Change Video' : 'Upload Video'}
                </label>
                <span className="text-sm text-gray-500">
                  MP4, WebM, OGG (max 100MB)
                </span>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="e.g., Patient Highlight 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  {yearOptions.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
                className="input"
                placeholder="Patient's name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quote <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                name="quote"
                value={formData.quote}
                onChange={handleChange}
                rows={3}
                className="input"
                placeholder="Patient's testimonial quote..."
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
                Set as active story (displayed on homepage)
              </label>
            </div>
          </div>

          <div className="flex gap-4 mt-6 pt-6 border-t">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isLoading || uploading} className="btn btn-primary flex-1">
              {uploading ? `Uploading... ${uploadProgress}%` : isLoading ? 'Saving...' : story ? 'Update Story' : 'Add Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSchStories;
