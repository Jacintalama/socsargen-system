const pool = require('../config/database');

// Get all available doctors (public)
const getAllDoctors = async (req, res) => {
  try {
    const { specialization, department } = req.query;

    let query = `
      SELECT d.id, d.specialization, d.department, d.bio, d.photo_url, d.consultation_fee, d.is_available,
             u.first_name, u.last_name
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.is_available = true AND u.is_active = true
    `;
    const params = [];

    if (specialization) {
      params.push(specialization);
      query += ` AND d.specialization ILIKE $${params.length}`;
    }

    if (department) {
      params.push(department);
      query += ` AND d.department ILIKE $${params.length}`;
    }

    query += ' ORDER BY d.department, u.last_name, u.first_name';

    const result = await pool.query(query, params);

    res.json(result.rows.map(doc => ({
      id: doc.id,
      firstName: doc.first_name,
      lastName: doc.last_name,
      fullName: `Dr. ${doc.first_name} ${doc.last_name}`,
      specialization: doc.specialization,
      department: doc.department,
      bio: doc.bio,
      photoUrl: doc.photo_url,
      consultationFee: doc.consultation_fee,
      isAvailable: doc.is_available
    })));
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ error: 'Failed to fetch doctors.' });
  }
};

// Get doctor by ID with schedules
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT d.*, u.first_name, u.last_name, u.email
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    const doc = result.rows[0];

    // Get schedules
    const schedules = await pool.query(
      'SELECT * FROM doctor_schedules WHERE doctor_id = $1 ORDER BY day_of_week',
      [id]
    );

    res.json({
      id: doc.id,
      firstName: doc.first_name,
      lastName: doc.last_name,
      fullName: `Dr. ${doc.first_name} ${doc.last_name}`,
      specialization: doc.specialization,
      department: doc.department,
      licenseNumber: doc.license_number,
      bio: doc.bio,
      photoUrl: doc.photo_url,
      consultationFee: doc.consultation_fee,
      isAvailable: doc.is_available,
      schedules: schedules.rows.map(s => ({
        id: s.id,
        dayOfWeek: s.day_of_week,
        startTime: s.start_time,
        endTime: s.end_time,
        maxPatients: s.max_patients
      }))
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ error: 'Failed to fetch doctor.' });
  }
};

// Get available time slots for a doctor on a specific date
const getDoctorSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date is required.' });
    }

    // Get doctor's schedule for the day of week
    const dayOfWeek = new Date(date).getDay();

    const scheduleResult = await pool.query(
      'SELECT * FROM doctor_schedules WHERE doctor_id = $1 AND day_of_week = $2',
      [id, dayOfWeek]
    );

    if (scheduleResult.rows.length === 0) {
      return res.json({ available: false, message: 'Doctor not available on this day.', slots: [] });
    }

    // Get existing appointments for that date
    const appointmentsResult = await pool.query(
      `SELECT appointment_time FROM appointments
       WHERE doctor_id = $1 AND appointment_date = $2 AND status NOT IN ('cancelled', 'rejected')`,
      [id, date]
    );

    const bookedTimes = appointmentsResult.rows.map(a => a.appointment_time.slice(0, 5));
    const schedule = scheduleResult.rows[0];

    // Generate available slots (30 min intervals)
    const slots = [];
    let current = new Date(`2000-01-01T${schedule.start_time}`);
    const end = new Date(`2000-01-01T${schedule.end_time}`);

    while (current < end) {
      const timeStr = current.toTimeString().slice(0, 5);
      slots.push({
        time: timeStr,
        available: !bookedTimes.includes(timeStr)
      });
      current.setMinutes(current.getMinutes() + 30);
    }

    res.json({ available: true, slots });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ error: 'Failed to fetch schedule.' });
  }
};

// Get unique specializations (for filter dropdown)
const getSpecializations = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT specialization FROM doctors
      WHERE is_available = true
      ORDER BY specialization
    `);

    res.json(result.rows.map(r => r.specialization));
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({ error: 'Failed to fetch specializations.' });
  }
};

// Get unique departments (for filter tabs)
const getDepartments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT department FROM doctors
      WHERE is_available = true AND department IS NOT NULL
      ORDER BY department
    `);

    res.json(result.rows.map(r => r.department));
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Failed to fetch departments.' });
  }
};

// Admin: Create doctor
const createDoctor = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, specialization, department, licenseNumber, bio, consultationFee } = req.body;

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user first
    const userResult = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, 'doctor')
       RETURNING id`,
      [email, hashedPassword, firstName, lastName, phone]
    );

    // Create doctor profile
    const doctorResult = await pool.query(
      `INSERT INTO doctors (user_id, specialization, department, license_number, bio, consultation_fee)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userResult.rows[0].id, specialization, department, licenseNumber, bio, consultationFee]
    );

    res.status(201).json({
      message: 'Doctor created successfully!',
      doctor: doctorResult.rows[0]
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({ error: 'Failed to create doctor.' });
  }
};

// Admin: Update doctor
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { specialization, department, licenseNumber, bio, consultationFee, isAvailable } = req.body;

    const result = await pool.query(`
      UPDATE doctors SET
        specialization = COALESCE($1, specialization),
        department = COALESCE($2, department),
        license_number = COALESCE($3, license_number),
        bio = COALESCE($4, bio),
        consultation_fee = COALESCE($5, consultation_fee),
        is_available = COALESCE($6, is_available),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [specialization, department, licenseNumber, bio, consultationFee, isAvailable, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    res.json({
      message: 'Doctor updated successfully!',
      doctor: result.rows[0]
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({ error: 'Failed to update doctor.' });
  }
};

// Admin: Add doctor schedule
const addDoctorSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { dayOfWeek, startTime, endTime, maxPatients } = req.body;

    const result = await pool.query(
      `INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, max_patients)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, dayOfWeek, startTime, endTime, maxPatients || 20]
    );

    res.status(201).json({
      message: 'Schedule added successfully!',
      schedule: result.rows[0]
    });
  } catch (error) {
    console.error('Add schedule error:', error);
    res.status(500).json({ error: 'Failed to add schedule.' });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getDoctorSchedule,
  getSpecializations,
  getDepartments,
  createDoctor,
  updateDoctor,
  addDoctorSchedule
};
