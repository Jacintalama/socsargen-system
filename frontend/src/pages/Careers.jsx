import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  FiUsers,
  FiHeart,
  FiAward,
  FiTrendingUp,
  FiDollarSign,
  FiBookOpen,
  FiShield,
  FiBriefcase,
  FiCalendar,
  FiChevronRight,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiX,
  FiSend,
  FiUpload,
  FiFile,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi';
import { getAPIURL } from '../utils/url';

const API_URL = getAPIURL();

const Careers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyingJob, setApplyingJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(API_URL + '/jobs');
        const result = await response.json();
        const jobsData = result.data || result;
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApplyClick = (job) => {
    if (!user) {
      navigate('/login', { state: { from: '/careers', message: 'Please login to apply for this job.' } });
      return;
    }
    setApplyingJob(job);
    setShowApplyModal(true);
    setCoverLetter('');
    setResumeFile(null);
    setSubmitMessage(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setSubmitMessage({ type: 'error', text: 'Only PDF, DOC, and DOCX files are allowed.' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setSubmitMessage({ type: 'error', text: 'File size must be less than 5MB.' });
        return;
      }
      setResumeFile(file);
      setSubmitMessage(null);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!applyingJob) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('jobId', applyingJob.id);
      formData.append('coverLetter', coverLetter);
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const response = await fetch(API_URL + '/applications', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage({ type: 'success', text: 'Application submitted successfully! Redirecting to your applications...' });
        setTimeout(() => {
          setShowApplyModal(false);
          setApplyingJob(null);
          navigate('/my-applications');
        }, 2000);
      } else {
        setSubmitMessage({ type: 'error', text: data.error || 'Failed to submit application.' });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitMessage({ type: 'error', text: 'Failed to submit application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-24">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-accent-500 text-accent-900 text-sm font-semibold px-4 py-1 rounded-full mb-6">
              We are Hiring
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Build your career with Socsargen County Hospital.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#openings"
                className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 shadow-lg"
              >
                View Open Positions
                <FiChevronRight className="w-5 h-5" />
              </a>
              {user && (
                <Link
                  to="/my-applications"
                  className="inline-flex items-center gap-2 bg-primary-500 text-white hover:bg-primary-400 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 border-2 border-white/30"
                >
                  <FiBriefcase className="w-5 h-5" />
                  My Applications
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Why Work With Us
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                  <FiAward className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Excellence</h3>
                <p className="text-gray-600 text-sm">ISO-certified tertiary hospital</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                  <FiUsers className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Team Work</h3>
                <p className="text-gray-600 text-sm">Supportive team environment</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                  <FiHeart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Make Impact</h3>
                <p className="text-gray-600 text-sm">Help patients daily</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                  <FiTrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Growth</h3>
                <p className="text-gray-600 text-sm">Career advancement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Employee Benefits
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  <FiShield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Health Insurance</h3>
                  <p className="text-gray-600 text-sm">HMO coverage for you and dependents</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  <FiCalendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Paid Time Off</h3>
                  <p className="text-gray-600 text-sm">Vacation and sick leaves</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  <FiBookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Training</h3>
                  <p className="text-gray-600 text-sm">Learning opportunities</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  <FiDollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Competitive Salary</h3>
                  <p className="text-gray-600 text-sm">With performance bonuses</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  <FiHeart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Wellness Programs</h3>
                  <p className="text-gray-600 text-sm">Mental health support</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  <FiTrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Career Growth</h3>
                  <p className="text-gray-600 text-sm">Promotion opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section id="openings" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Job Openings
              </h2>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <FiBriefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Open Positions</h3>
                <p className="text-gray-500 mb-6">
                  Please check back later for job openings.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-grow cursor-pointer" onClick={() => setSelectedJob(job)}>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                            {job.department}
                          </span>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {job.type}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FiMapPin className="w-4 h-4" />
                            {job.location || 'General Santos City'}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock className="w-4 h-4" />
                            {job.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="flex items-center gap-2 border-2 border-primary-600 text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleApplyClick(job)}
                          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                        >
                          <FiSend className="w-4 h-4" />
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact HR */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Have Questions?
              </h2>
              <p className="text-primary-100 mb-8">
                Contact our HR team for career inquiries.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:hr@socsargenhospital.com"
                  className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
                >
                  <FiMail className="w-5 h-5" />
                  Email HR
                </a>
                <a
                  href="tel:553-8906"
                  className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
                >
                  <FiPhone className="w-5 h-5" />
                  Call: 553-8906
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white relative">
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">
                  {selectedJob.department}
                </span>
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">
                  {selectedJob.type}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{selectedJob.title}</h2>
              <div className="flex items-center gap-2 text-primary-100 text-sm">
                <FiMapPin className="w-4 h-4" />
                {selectedJob.location || 'General Santos City'}
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Job Description</h3>
                <p className="text-gray-600 whitespace-pre-line">{selectedJob.description}</p>
              </div>

              {selectedJob.requirements && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-3">Requirements</h3>
                  <p className="text-gray-600 whitespace-pre-line">{selectedJob.requirements}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    handleApplyClick(selectedJob);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  <FiSend className="w-4 h-4" />
                  Apply Now
                </button>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && applyingJob && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowApplyModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white relative">
              <button
                onClick={() => setShowApplyModal(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold mb-1">Apply for Position</h2>
              <p className="text-primary-100">{applyingJob.title}</p>
            </div>

            <form onSubmit={handleSubmitApplication} className="p-6">
              {submitMessage && (
                <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
                  submitMessage.type === 'success'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {submitMessage.type === 'success' ? (
                    <FiCheck className="w-5 h-5" />
                  ) : (
                    <FiAlertCircle className="w-5 h-5" />
                  )}
                  {submitMessage.text}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Tell us why you are interested in this position and what makes you a good fit..."
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume / CV
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="resume" className="cursor-pointer">
                    {resumeFile ? (
                      <div className="flex items-center justify-center gap-2 text-primary-600">
                        <FiFile className="w-6 h-6" />
                        <span className="font-medium">{resumeFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Click to upload your resume</p>
                        <p className="text-gray-400 text-sm mt-1">PDF, DOC, DOCX (max 5MB)</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
