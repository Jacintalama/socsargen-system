import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiCalendar, FiClock, FiUser, FiArrowLeft, FiCheck, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const BookAppointment = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctor');

  const [selectedDoctor, setSelectedDoctor] = useState(preselectedDoctorId || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [step, setStep] = useState(preselectedDoctorId ? 2 : 1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // Fetch all doctors
  const { data: doctors, isLoading: loadingDoctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => api.get('/doctors').then(res => res.data)
  });

  // Fetch departments for filter
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get('/doctors/departments').then(res => res.data)
  });

  // Filter doctors by search and department
  const filteredDoctors = doctors?.filter(doctor => {
    const matchesSearch = searchTerm === '' ||
      doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === '' || doctor.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Get short department name
  const getShortDeptName = (fullName) => {
    return fullName?.replace('Department of ', '') || fullName;
  };

  // Fetch selected doctor details
  const { data: doctorDetails } = useQuery({
    queryKey: ['doctor', selectedDoctor],
    queryFn: () => api.get(`/doctors/${selectedDoctor}`).then(res => res.data),
    enabled: !!selectedDoctor
  });

  // Fetch available time slots
  const { data: scheduleData, isLoading: loadingSlots } = useQuery({
    queryKey: ['doctorSchedule', selectedDoctor, selectedDate],
    queryFn: () => api.get(`/doctors/${selectedDoctor}/schedule?date=${selectedDate}`).then(res => res.data),
    enabled: !!selectedDoctor && !!selectedDate
  });

  // Create appointment mutation
  const createAppointment = useMutation({
    mutationFn: (data) => api.post('/appointments', data),
    onSuccess: () => {
      toast.success('Appointment booked successfully! Please wait for confirmation.');
      queryClient.invalidateQueries(['myAppointments']);
      navigate('/patient/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to book appointment.');
    }
  });

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  const handleDoctorSelect = (doctorId) => {
    setSelectedDoctor(doctorId);
    setSelectedDate('');
    setSelectedTime('');
    setStep(2);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime('');
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error('Please complete all steps.');
      return;
    }

    createAppointment.mutate({
      doctorId: selectedDoctor,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      reason: reason.trim() || null
    });
  };

  const selectedDoctorInfo = doctors?.find(d => d.id === selectedDoctor);

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-4"
          >
            <FiArrowLeft /> Back
          </button>
          <h1 className="text-2xl font-bold">Book an Appointment</h1>
          <p className="text-gray-600">Select a doctor, date, and time for your appointment.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[
            { num: 1, label: 'Select Doctor' },
            { num: 2, label: 'Choose Date & Time' },
            { num: 3, label: 'Confirm' }
          ].map((s, index) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2
                ${step >= s.num
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'border-gray-300 text-gray-400'}`}
              >
                {step > s.num ? <FiCheck /> : s.num}
              </div>
              <span className={`ml-2 text-sm hidden sm:inline ${step >= s.num ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
                {s.label}
              </span>
              {index < 2 && (
                <div className={`w-12 sm:w-24 h-1 mx-2 ${step > s.num ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Doctor */}
        {step === 1 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Select a Doctor</h2>

            {/* Search & Filter Section */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search doctor name or specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FiX />
                    </button>
                  )}
                </div>

                {/* Department Filter */}
                <div className="sm:w-56">
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full py-2.5 px-3 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition bg-white cursor-pointer"
                  >
                    <option value="">All Departments</option>
                    {departments?.map((dept) => (
                      <option key={dept} value={dept}>
                        {getShortDeptName(dept)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(searchTerm || selectedDepartment) && (
                <div className="mt-3 pt-3 border-t border-gray-200 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-500">Filters:</span>
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs">
                      "{searchTerm}"
                      <button onClick={() => setSearchTerm('')}>
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedDepartment && (
                    <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs">
                      {getShortDeptName(selectedDepartment)}
                      <button onClick={() => setSelectedDepartment('')}>
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => { setSearchTerm(''); setSelectedDepartment(''); }}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Results Count */}
            {!loadingDoctors && (
              <p className="text-sm text-gray-500 mb-4">
                {filteredDoctors?.length || 0} doctor{filteredDoctors?.length !== 1 ? 's' : ''} found
                {selectedDepartment && ` in ${getShortDeptName(selectedDepartment)}`}
              </p>
            )}

            {loadingDoctors ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredDoctors?.length === 0 ? (
              <div className="text-center py-8">
                <FiUser className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No doctors found matching your criteria.</p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedDepartment(''); }}
                  className="mt-2 text-primary-600 hover:underline text-sm"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                {filteredDoctors?.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => handleDoctorSelect(doctor.id)}
                    className={`p-4 border rounded-lg text-left hover:border-primary-500 hover:bg-primary-50 transition
                      ${selectedDoctor === doctor.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-primary-100 p-3 rounded-full">
                        {doctor.photoUrl ? (
                          <img
                            src={doctor.photoUrl}
                            alt={doctor.fullName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <FiUser className="text-primary-600 text-2xl" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{doctor.fullName}</h3>
                        <p className="text-sm text-gray-500">{doctor.specialization}</p>
                        {doctor.department && (
                          <p className="text-xs text-primary-600 font-medium">{getShortDeptName(doctor.department)}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Choose Date & Time</h2>
              <button
                onClick={() => setStep(1)}
                className="text-sm text-primary-600 hover:underline"
              >
                Change Doctor
              </button>
            </div>

            {/* Selected Doctor Info */}
            {selectedDoctorInfo && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-100 p-2 rounded-full">
                    <FiUser className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedDoctorInfo.fullName}</h3>
                    <p className="text-sm text-gray-500">{selectedDoctorInfo.specialization}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiCalendar className="inline mr-2" />
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={getMinDate()}
                max={getMaxDate()}
                className="input w-full md:w-auto"
              />
              {doctorDetails?.schedules?.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Available days: {doctorDetails.schedules.map(s =>
                    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][s.dayOfWeek]
                  ).join(', ')}
                </p>
              )}
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiClock className="inline mr-2" />
                  Select Time
                </label>

                {loadingSlots ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div>
                  </div>
                ) : !scheduleData?.available ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-700">
                      {scheduleData?.message || 'Doctor is not available on this day. Please select another date.'}
                    </p>
                  </div>
                ) : scheduleData?.slots?.length === 0 ? (
                  <p className="text-gray-500">No available slots for this date.</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {scheduleData?.slots?.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition
                          ${!slot.available
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                            : selectedTime === slot.time
                              ? 'bg-primary-600 text-white'
                              : 'bg-white border border-gray-200 hover:border-primary-500 hover:bg-primary-50'
                          }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Confirm Appointment</h2>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-sm text-primary-600 hover:underline"
              >
                Change Time
              </button>
            </div>

            {/* Appointment Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-medium text-gray-700 mb-4">Appointment Details</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FiUser className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Doctor</p>
                    <p className="font-medium">{selectedDoctorInfo?.fullName}</p>
                    <p className="text-sm text-gray-500">{selectedDoctorInfo?.specialization}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FiCalendar className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {new Date(selectedDate).toLocaleDateString('en-PH', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FiClock className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{selectedTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reason for Visit */}
            <div className="mb-6">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Visit (Optional)
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="input w-full"
                placeholder="Briefly describe your symptoms or reason for the appointment..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-secondary flex-1"
              >
                Start Over
              </button>
              <button
                type="submit"
                disabled={createAppointment.isPending}
                className="btn btn-primary flex-1"
              >
                {createAppointment.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Booking...
                  </span>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4 text-center">
              Your appointment will be pending until confirmed by the doctor.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
