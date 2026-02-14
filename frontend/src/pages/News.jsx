import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiCalendar, FiUser, FiArrowRight, FiChevronLeft, FiChevronRight, FiAward, FiBriefcase, FiMapPin, FiClock, FiVideo } from 'react-icons/fi';
import api from '../utils/api';
import { getBaseURL } from '../utils/url';

const API_URL = getBaseURL();

// Helper to get full image URL
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_URL}${imageUrl}`;
};

const News = () => {
  // Fetch featured news for slider (first 3)
  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['news', 'featured'],
    queryFn: () => api.get('/news?limit=3').then(res => res.data)
  });

  // Fetch all news for card slider
  const { data: allNewsData, isLoading: allNewsLoading } = useQuery({
    queryKey: ['news', 'all'],
    queryFn: () => api.get('/news?limit=20').then(res => res.data)
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            News & Updates
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay informed with the latest news, announcements, and health updates from Socsargen County Hospital.
          </p>
        </div>

        {/* Featured News Slider */}
        {featuredLoading ? (
          <div className="relative h-[350px] md:h-[450px] bg-gray-200 animate-pulse rounded-xl max-w-6xl mx-auto mb-12" />
        ) : (featuredData?.data || []).length > 0 ? (
          <div className="mb-12">
            <FeaturedNewsSlider newsItems={featuredData?.data || []} />
          </div>
        ) : null}

        {/* Latest Updates - Card Slider */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Latest Updates</h2>

          {allNewsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl h-80 animate-pulse shadow" />
              ))}
            </div>
          ) : (allNewsData?.data || []).length > 0 ? (
            <NewsCardSlider newsItems={allNewsData?.data || []} formatDate={formatDate} />
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No News Yet</h3>
              <p className="text-gray-500">Check back later for updates and announcements.</p>
            </div>
          )}
        </div>

        {/* Hiring Section */}
        <HiringSection />
      </div>
    </div>
  );
};

// Featured News Slider Component
const FeaturedNewsSlider = ({ newsItems }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRefs = useRef({});

  // Auto-rotate: 5s for images, 30s for videos
  useEffect(() => {
    if (newsItems.length <= 1) return;
    const currentNews = newsItems[currentSlide];
    const duration = currentNews?.videoUrl ? 10000 : 5000;
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % newsItems.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [newsItems.length, currentSlide, newsItems]);

  // Handle video play/pause when slide changes
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([idx, video]) => {
      if (!video) return;
      if (parseInt(idx) === currentSlide) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentSlide]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % newsItems.length);
  };

  if (newsItems.length === 0) return null;

  return (
    <div className="relative h-[350px] md:h-[450px] max-w-6xl mx-auto rounded-xl overflow-hidden shadow-xl">
      {/* Slides */}
      {newsItems.map((news, index) => (
        <div
          key={news.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background: Video or Image */}
          {news.videoUrl ? (
            <video
              ref={(el) => { videoRefs.current[index] = el; }}
              src={getImageUrl(news.videoUrl)}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay={index === 0}
              muted
              loop
              playsInline
              preload="auto"
            />
          ) : news.imageUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${getImageUrl(news.imageUrl)})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800" />
          )}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
            <div className="max-w-2xl">
              <span className="inline-block bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Featured
              </span>
              <h3 className="text-xl md:text-3xl font-bold text-white mb-4 line-clamp-3">
                {news.title}
              </h3>
              <p className="text-gray-200 text-sm md:text-base mb-4 line-clamp-2 hidden md:block">
                {news.excerpt}
              </p>
              <Link
                to={`/news/${news.slug}`}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-primary-700 font-semibold px-5 py-2.5 rounded-lg transition-all duration-300"
              >
                Learn More
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Left Arrow */}
      <button
        onClick={goToPrev}
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={goToNext}
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300"
        aria-label="Next slide"
      >
        <FiChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {newsItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-6 md:w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// News Card Slider Component - Shows 3 cards on desktop, 1 on mobile
const NewsCardSlider = ({ newsItems, formatDate }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  // Update visible count based on screen size
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  // Reset startIndex when visibleCount changes
  useEffect(() => {
    if (startIndex + visibleCount > newsItems.length) {
      setStartIndex(Math.max(0, newsItems.length - visibleCount));
    }
  }, [visibleCount, newsItems.length, startIndex]);

  const prevSlide = () => {
    setStartIndex((prev) => {
      const newIndex = prev - 1;
      if (newIndex < 0) {
        return Math.max(0, newsItems.length - visibleCount);
      }
      return newIndex;
    });
  };

  const nextSlide = () => {
    setStartIndex((prev) => {
      const newIndex = prev + 1;
      if (newIndex + visibleCount > newsItems.length) {
        return 0;
      }
      return newIndex;
    });
  };

  const visibleNews = newsItems.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="relative px-4">
      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 bg-primary-600 text-white hover:bg-primary-700 shadow-lg"
        aria-label="Previous news"
      >
        <FiChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* News Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-12 md:mx-16">
        {visibleNews.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {/* Featured Image */}
            {article.imageUrl ? (
              <div className="h-48 overflow-hidden relative">
                <img
                  src={getImageUrl(article.imageUrl)}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {article.videoUrl && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full">
                    <FiVideo size={12} /> Video
                  </span>
                )}
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center relative">
                <FiAward className="w-16 h-16 text-white/50" />
                {article.videoUrl && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full">
                    <FiVideo size={12} /> Video
                  </span>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <FiCalendar className="text-primary-600" />
                  {formatDate(article.publishedAt)}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition line-clamp-2">
                <Link to={`/news/${article.slug}`}>
                  {article.title}
                </Link>
              </h3>

              {/* Excerpt */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {article.excerpt}
              </p>

              {/* Read More Link */}
              <Link
                to={`/news/${article.slug}`}
                className="inline-flex items-center gap-2 text-primary-600 font-medium hover:gap-3 transition-all"
              >
                Read More <FiArrowRight />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 bg-primary-600 text-white hover:bg-primary-700 shadow-lg"
        aria-label="Next news"
      >
        <FiChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </div>
  );
};

// Hiring Section Component
const HiringSection = () => {
  // Fetch jobs from API
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['jobs', 'public'],
    queryFn: () => api.get('/jobs?limit=4').then(res => res.data)
  });

  const jobOpenings = jobsData?.data || [];

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 h-48 animate-pulse shadow" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <FiBriefcase className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Join Our Team
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Be part of Socsargen County Hospital's mission to provide excellent healthcare services. Explore our current job openings below.
        </p>
      </div>

      {/* Job Listings */}
      {jobOpenings.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {jobOpenings.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition">
                    {job.title}
                  </h3>
                  <p className="text-primary-600 font-medium">{job.department}</p>
                </div>
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {job.type}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {job.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <FiMapPin className="text-primary-600" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <FiClock className="text-primary-600" />
                  {job.type}
                </span>
              </div>

              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 mb-8">
          <p className="text-gray-500">No job openings at the moment. Check back later!</p>
        </div>
      )}

      {/* Contact for Careers */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-3">
          Don't see a position that fits?
        </h3>
        <p className="text-primary-100 mb-6 max-w-xl mx-auto">
          We're always looking for talented individuals to join our team. Send your resume and we'll keep you in mind for future opportunities.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:careers@socsargenhospital.com"
            className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
          >
            <FiBriefcase className="w-5 h-5" />
            Send Your Resume
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
          >
            Contact HR Department
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default News;
