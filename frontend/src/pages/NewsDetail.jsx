import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiCalendar, FiUser, FiArrowLeft, FiShare2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { getBaseURL } from '../utils/url';

const API_URL = getBaseURL();

// Helper to get full media URL
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_URL}${imageUrl}`;
};

const getVideoUrl = (videoUrl) => {
  if (!videoUrl) return null;
  if (videoUrl.startsWith('http')) return videoUrl;
  return `${API_URL}${videoUrl}`;
};

const NewsDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['news', slug],
    queryFn: () => api.get(`/news/${slug}`).then(res => res.data)
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: url
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy link');
      }
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/news" className="btn btn-primary">
              Back to News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/news')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6"
        >
          <FiArrowLeft /> Back to News
        </button>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-gray-500">
              <span className="flex items-center gap-2">
                <FiCalendar className="text-primary-600" />
                {formatDate(article.publishedAt)}
              </span>
              {article.author && (
                <span className="flex items-center gap-2">
                  <FiUser className="text-primary-600" />
                  {article.author}
                </span>
              )}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 ml-auto"
              >
                <FiShare2 /> Share
              </button>
            </div>
          </header>

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <img
                src={getImageUrl(article.imageUrl)}
                alt={article.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Video Player */}
          {article.videoUrl && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <video
                src={getVideoUrl(article.videoUrl)}
                controls
                className="w-full"
                preload="metadata"
                aria-label={`Video for ${article.title}`}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Content */}
          <div className="card">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {article.content}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link
                to="/news"
                className="flex items-center gap-2 text-gray-600 hover:text-primary-600"
              >
                <FiArrowLeft /> Back to all news
              </Link>
              <button
                onClick={handleShare}
                className="btn btn-outline flex items-center gap-2"
              >
                <FiShare2 /> Share this article
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsDetail;
