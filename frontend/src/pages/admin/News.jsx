import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiX, FiFileText, FiUpload, FiImage, FiArrowLeft, FiVideo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { getBaseURL } from '../../utils/url';

const API_URL = getBaseURL();

const AdminNews = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  // Fetch all news (including drafts)
  const { data: newsList, isLoading } = useQuery({
    queryKey: ['adminNews'],
    queryFn: () => api.get('/news/admin/all').then(res => res.data)
  });

  // Create news mutation
  const createNews = useMutation({
    mutationFn: (data) => api.post('/news', data),
    onSuccess: () => {
      toast.success('News article created!');
      queryClient.invalidateQueries(['adminNews']);
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create article.');
    }
  });

  // Update news mutation
  const updateNews = useMutation({
    mutationFn: ({ id, data }) => api.put(`/news/${id}`, data),
    onSuccess: () => {
      toast.success('News article updated!');
      queryClient.invalidateQueries(['adminNews']);
      setEditingNews(null);
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update article.');
    }
  });

  // Delete news mutation
  const deleteNews = useMutation({
    mutationFn: (id) => api.delete(`/news/${id}`),
    onSuccess: () => {
      toast.success('News article deleted!');
      queryClient.invalidateQueries(['adminNews']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete article.');
    }
  });

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteNews.mutate(id);
    }
  };

  const handleEdit = (news) => {
    setEditingNews(news);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingNews(null);
    setShowModal(true);
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
              <h1 className="text-2xl font-bold">Manage News</h1>
              <p className="text-gray-600">Create and manage hospital news and announcements.</p>
            </div>
            <button onClick={handleAdd} className="btn btn-primary flex items-center gap-2 w-fit">
              <FiPlus /> Create Article
            </button>
          </div>
        </div>

        {/* News List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : newsList?.length === 0 ? (
          <div className="card text-center py-12">
            <FiFileText className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Articles Yet</h3>
            <p className="text-gray-500 mb-6">Create your first news article to get started.</p>
            <button onClick={handleAdd} className="btn btn-primary">
              Create First Article
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {newsList?.map((news) => (
              <div key={news.id} className="card">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{news.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        news.isPublished
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {news.isPublished ? 'Published' : 'Draft'}
                      </span>
                      {news.videoUrl && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          <FiVideo size={12} /> Video
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{news.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>By {news.author}</span>
                      {news.publishedAt && (
                        <span>
                          Published: {new Date(news.publishedAt).toLocaleDateString('en-PH')}
                        </span>
                      )}
                      <span>
                        Created: {new Date(news.createdAt).toLocaleDateString('en-PH')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(news)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(news.id, news.title)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <NewsModal
            news={editingNews}
            onClose={() => {
              setShowModal(false);
              setEditingNews(null);
            }}
            onSubmit={(data) => {
              if (editingNews) {
                updateNews.mutate({ id: editingNews.id, data });
              } else {
                createNews.mutate(data);
              }
            }}
            isLoading={createNews.isPending || updateNews.isPending}
          />
        )}
      </div>
    </div>
  );
};

// News Modal Component
const NewsModal = ({ news, onClose, onSubmit, isLoading }) => {
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: news?.title || '',
    content: news?.content || '',
    excerpt: news?.excerpt || '',
    imageUrl: news?.imageUrl || '',
    videoUrl: news?.videoUrl || '',
    isPublished: news?.isPublished ?? false
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(news?.imageUrl ? `${API_URL}${news.imageUrl}` : '');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(news?.videoUrl ? `${API_URL}${news.videoUrl}` : '');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only image files are allowed (JPEG, PNG, GIF, WebP)');
        return;
      }

      // Validate file size (5MB)
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

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only video files are allowed (MP4, WebM, OGG)');
        return;
      }
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

    let imageUrl = formData.imageUrl;
    let videoUrl = formData.videoUrl;

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

    onSubmit({ ...formData, imageUrl, videoUrl });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {news ? 'Edit Article' : 'Create New Article'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input"
                placeholder="Article title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={10}
                className="input"
                placeholder="Write your article content here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt <span className="text-gray-400">(optional - auto-generated if empty)</span>
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={2}
                className="input"
                placeholder="Brief summary of the article..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>

              {/* Image Preview */}
              {previewUrl ? (
                <div className="relative mb-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto max-h-96 rounded-lg"
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
              ) : null}

              {/* Upload Button */}
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                >
                  <FiUpload />
                  {previewUrl ? 'Change Image' : 'Upload Image'}
                </label>
                <span className="text-sm text-gray-500">
                  JPEG, PNG, GIF, WebP (max 5MB)
                </span>
              </div>
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video <span className="text-gray-400">(optional)</span>
              </label>

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
                  id="newsVideoUpload"
                />
                <label
                  htmlFor="newsVideoUpload"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                >
                  <FiVideo />
                  {videoPreviewUrl ? 'Change Video' : 'Upload Video'}
                </label>
                <span className="text-sm text-gray-500">
                  MP4, WebM, OGG (max 100MB)
                </span>
              </div>

              {/* Upload Progress */}
              {uploading && uploadProgress > 0 && (
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                Publish immediately
              </label>
            </div>
          </div>

          <div className="flex gap-4 mt-6 pt-6 border-t">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isLoading || uploading} className="btn btn-primary flex-1">
              {uploading ? 'Uploading...' : isLoading ? 'Saving...' : news ? 'Update Article' : 'Create Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNews;
