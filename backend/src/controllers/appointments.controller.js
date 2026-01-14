const pool = require('../config/database');

// Create appointment (patient)
const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reason } = req.body;
    const patientId = req.user.id;

    // Check if slot is available
    const existing = await pool.query(
      `SELECT id FROM appointments
       WHERE doctor_id = $1 AND appointment_date = $2 AND appointment_time = $3
       AND status NOT IN ('cancelled', 'rejected')`,
      [doctorId, appointmentDate, appointmentTime]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'This time slot is already booked. Please choose another.' });
    }

    // Check if patient already has appointment at same time
    const patientConflict = await pool.query(
      `SELECT id FROM appointments
       WHERE patient_id = $1 AND appointment_date = $2 AND appointment_time = $3
       AND status NOT IN ('cancelled', 'rejected')`,
      [patientId, appointmentDate, appointmentTime]
    );

    if (patientConflict.rows.length > 0) {
      return res.status(400).json({ error: 'You already have an appointment at this time.' });
    }

    const result = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [patientId, doctorId, appointmentDate, appointmentTime, reason]
    );

    res.status(201).json({
      message: 'Appointment booked successfully! Please wait for confirmation.',
      appointment: result.rows[0]
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Failed to book appointment.' });
  }
};

// Get my appointments (patient or doctor)
const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { status, upcoming } = req.query;

    let query;
    let params = [];

    if (userRole === 'patient') {
      query = `
        SELECT a.*, d.specialization,
               u.first_name as doctor_first_name, u.last_name as doctor_last_name,
               d.photo_url as doctor_photo
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users u ON d.user_id = u.id
        WHERE a.patient_id = $1
      `;
      params.push(userId);
    } else if (userRole === 'doctor') {
      // Get doctor id first
      const doctorResult = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [userId]);
      if (doctorResult.rows.length === 0) {
        return res.status(404).json({ error: 'Doctor profile not found.' });
      }

      query = `
        SELECT a.*,
               u.first_name as patient_first_name, u.last_name as patient_last_name,
               u.phone as patient_phone, u.email as patient_email
        FROM appointments a
        JOIN users u ON a.patient_id = u.id
        WHERE a.doctor_id = $1
      `;
      params.push(doctorResult.rows[0].id);
    }

    if (status) {
      params.push(status);
      query += ` AND a.status = $${params.length}`;
    }

    if (upcoming === 'true') {
      query += ` AND a.appointment_date >= CURRENT_DATE`;
    }

    query += ' ORDER BY a.appointment_date ASC, a.appointment_time ASC';

    const result = await pool.query(query, params);

    res.json(result.rows.map(a => ({
      id: a.id,
      appointmentDate: a.appointment_date,
      appointmentTime: a.appointment_time,
      status: a.status,
      reason: a.reason,
      notes: a.notes,
      createdAt: a.created_at,
      // Doctor info (for patients)
      doctor: a.doctor_first_name ? {
        firstName: a.doctor_first_name,
        lastName: a.doctor_last_name,
        fullName: `Dr. ${a.doctor_first_name} ${a.doctor_last_name}`,
        specialization: a.specialization,
        photoUrl: a.doctor_photo
      } : undefined,
      // Patient info (for doctors)
      patient: a.patient_first_name ? {
        firstName: a.patient_first_name,
        lastName: a.patient_last_name,
        fullName: `${a.patient_first_name} ${a.patient_last_name}`,
        phone: a.patient_phone,
        email: a.patient_email
      } : undefined
    })));
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments.' });
  }
};

// Cancel appointment (patient)
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE appointments SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND patient_id = $2 AND status IN ('pending', 'approved')
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Cannot cancel this appointment.' });
    }

    res.json({ message: 'Appointment cancelled successfully.', appointment: result.rows[0] });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ error: 'Failed to cancel appointment.' });
  }
};

// Update appointment status (doctor/admin)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const result = await pool.query(
      `UPDATE appointments SET status = $1, notes = COALESCE($2, notes), updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING *`,
      [status, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    res.json({
      message: `Appointment ${status} successfully.`,
      appointment: result.rows[0]
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ error: 'Failed to update appointment.' });
  }
};

// Admin: Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const { status, date, doctorId } = req.query;

    let query = `
      SELECT a.*,
             p.first_name as patient_first_name, p.last_name as patient_last_name, p.phone as patient_phone,
             d_user.first_name as doctor_first_name, d_user.last_name as doctor_last_name,
             doc.specialization
      FROM appointments a
      JOIN users p ON a.patient_id = p.id
      JOIN doctors doc ON a.doctor_id = doc.id
      JOIN users d_user ON doc.user_id = d_user.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND a.status = $${params.length}`;
    }

    if (date) {
      params.push(date);
      query += ` AND a.appointment_date = $${params.length}`;
    }

    if (doctorId) {
      params.push(doctorId);
      query += ` AND a.doctor_id = $${params.length}`;
    }

    query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

    const result = await pool.query(query, params);

    res.json(result.rows.map(a => ({
      id: a.id,
      appointmentDate: a.appointment_date,
      appointmentTime: a.appointment_time,
      status: a.status,
      reason: a.reason,
      notes: a.notes,
      patient: {
        firstName: a.patient_first_name,
        lastName: a.patient_last_name,
        fullName: `${a.patient_first_name} ${a.patient_last_name}`,
        phone: a.patient_phone
      },
      doctor: {
        firstName: a.doctor_first_name,
        lastName: a.doctor_last_name,
        fullName: `Dr. ${a.doctor_first_name} ${a.doctor_last_name}`,
        specialization: a.specialization
      }
    })));
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments.' });
  }
};

// Admin: Get appointment stats
const getAppointmentStats = async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'approved') as approved,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
        COUNT(*) FILTER (WHERE appointment_date = CURRENT_DATE) as today,
        COUNT(*) as total
      FROM appointments
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  updateAppointmentStatus,
  getAllAppointments,
  getAppointmentStats
};
