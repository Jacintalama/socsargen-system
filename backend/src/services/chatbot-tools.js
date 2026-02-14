const pool = require('../config/database');

/**
 * Search for doctors by name, specialization, or department.
 * Returns up to 10 matching doctors with basic info.
 */
async function searchDoctors({ name, specialization, department }) {
  let query = `
    SELECT d.id, u.first_name, u.last_name, d.specialization,
           d.department, d.consultation_fee, d.bio
    FROM doctors d
    JOIN users u ON d.user_id = u.id
    WHERE d.is_available = true AND u.is_active = true
  `;
  const params = [];

  if (name) {
    params.push(`%${name}%`);
    query += ` AND (u.first_name ILIKE $${params.length} OR u.last_name ILIKE $${params.length} OR CONCAT(u.first_name, ' ', u.last_name) ILIKE $${params.length})`;
  }
  if (specialization) {
    params.push(`%${specialization}%`);
    query += ` AND d.specialization ILIKE $${params.length}`;
  }
  if (department) {
    params.push(`%${department}%`);
    query += ` AND d.department ILIKE $${params.length}`;
  }

  query += ' ORDER BY d.department, u.last_name LIMIT 10';
  const result = await pool.query(query, params);

  return result.rows.map(doc => ({
    name: `Dr. ${doc.first_name} ${doc.last_name}`,
    specialization: doc.specialization,
    department: doc.department,
    consultationFee: doc.consultation_fee,
    bio: doc.bio ? doc.bio.substring(0, 100) : null
  }));
}

/**
 * Check real-time availability for a specific doctor on a given date.
 * Returns open 30-minute appointment slots.
 */
async function getDoctorAvailability({ doctorName, date }) {
  const doctorResult = await pool.query(`
    SELECT d.id, u.first_name, u.last_name
    FROM doctors d
    JOIN users u ON d.user_id = u.id
    WHERE (u.first_name ILIKE $1 OR u.last_name ILIKE $1
           OR CONCAT(u.first_name, ' ', u.last_name) ILIKE $1)
      AND d.is_available = true AND u.is_active = true
    LIMIT 1
  `, [`%${doctorName}%`]);

  if (doctorResult.rows.length === 0) {
    return { found: false, message: 'No doctor found matching that name in our records.' };
  }

  const doctor = doctorResult.rows[0];
  const targetDate = new Date(date);
  const dayOfWeek = targetDate.getDay();

  const scheduleResult = await pool.query(
    'SELECT start_time, end_time, max_patients FROM doctor_schedules WHERE doctor_id = $1 AND day_of_week = $2',
    [doctor.id, dayOfWeek]
  );

  if (scheduleResult.rows.length === 0) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return {
      found: true,
      doctorName: `Dr. ${doctor.first_name} ${doctor.last_name}`,
      available: false,
      message: `Dr. ${doctor.first_name} ${doctor.last_name} is not scheduled on ${dayNames[dayOfWeek]}s.`
    };
  }

  const bookedResult = await pool.query(
    `SELECT appointment_time FROM appointments
     WHERE doctor_id = $1 AND appointment_date = $2
     AND status NOT IN ('cancelled', 'rejected')`,
    [doctor.id, date]
  );

  const bookedTimes = bookedResult.rows.map(a => a.appointment_time.slice(0, 5));
  const schedule = scheduleResult.rows[0];

  const slots = [];
  let current = new Date(`2000-01-01T${schedule.start_time}`);
  const end = new Date(`2000-01-01T${schedule.end_time}`);

  while (current < end) {
    const timeStr = current.toTimeString().slice(0, 5);
    if (!bookedTimes.includes(timeStr)) {
      const hours = current.getHours();
      const mins = current.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours % 12 || 12;
      slots.push(`${displayHour}:${mins} ${ampm}`);
    }
    current.setMinutes(current.getMinutes() + 30);
  }

  return {
    found: true,
    doctorName: `Dr. ${doctor.first_name} ${doctor.last_name}`,
    date: date,
    available: slots.length > 0,
    availableSlots: slots,
    totalSlots: slots.length
  };
}

/**
 * Get hospital services, optionally filtered by category or keyword.
 */
async function getHospitalServices({ category }) {
  let query = 'SELECT name, description, category FROM services WHERE is_active = true';
  const params = [];

  if (category) {
    params.push(`%${category}%`);
    query += ` AND (category ILIKE $1 OR name ILIKE $1 OR description ILIKE $1)`;
  }

  query += ' ORDER BY display_order, name LIMIT 20';
  const result = await pool.query(query, params);

  return result.rows.map(s => ({
    name: s.name,
    description: s.description ? s.description.substring(0, 120) : null,
    category: s.category
  }));
}

/**
 * Get latest published news and announcements.
 */
async function getLatestNews({ topic }) {
  let query = `
    SELECT n.title, n.excerpt, n.published_at
    FROM news n
    WHERE n.is_published = true
  `;
  const params = [];

  if (topic) {
    params.push(`%${topic}%`);
    query += ` AND (n.title ILIKE $1 OR n.excerpt ILIKE $1 OR n.content ILIKE $1)`;
  }

  query += ' ORDER BY n.published_at DESC LIMIT 5';
  const result = await pool.query(query, params);

  return result.rows.map(n => ({
    title: n.title,
    excerpt: n.excerpt ? n.excerpt.substring(0, 150) : null,
    publishedAt: n.published_at
  }));
}

/**
 * List available departments with doctor counts.
 */
async function getDepartments() {
  const result = await pool.query(`
    SELECT d.department, COUNT(*) as doctor_count
    FROM doctors d
    JOIN users u ON d.user_id = u.id
    WHERE d.is_available = true AND u.is_active = true AND d.department IS NOT NULL
    GROUP BY d.department
    ORDER BY d.department
  `);

  return result.rows.map(r => ({
    department: r.department,
    doctorCount: parseInt(r.doctor_count)
  }));
}

module.exports = {
  searchDoctors,
  getDoctorAvailability,
  getHospitalServices,
  getLatestNews,
  getDepartments
};
