const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/socsargen_hospital'
});

async function addSampleJobs() {
  try {
    // Check if jobs table exists and has data
    const existing = await pool.query('SELECT COUNT(*) FROM jobs');

    if (parseInt(existing.rows[0].count) > 0) {
      console.log(`Jobs table already has ${existing.rows[0].count} records.`);
      return;
    }

    // Insert sample jobs
    await pool.query(`
      INSERT INTO jobs (title, department, job_type, location, description, requirements, is_active)
      VALUES
        ('Registered Nurse', 'Nursing Department', 'Full-time', 'General Santos City',
         'We are looking for compassionate and skilled registered nurses to join our healthcare team. You will provide patient care, administer medications, and collaborate with doctors.',
         'Bachelor of Science in Nursing\nValid PRC License\nBLS/ACLS Certification\nAt least 1 year hospital experience',
         true),
        ('Medical Technologist', 'Laboratory Department', 'Full-time', 'General Santos City',
         'Join our laboratory team and help provide accurate diagnostic results for patient care.',
         'Bachelor of Science in Medical Technology\nValid PRC License\nKnowledge of laboratory procedures',
         true),
        ('Pharmacist', 'Pharmacy Department', 'Full-time', 'General Santos City',
         'We need licensed pharmacists to ensure safe and effective medication management for our patients.',
         'Bachelor of Science in Pharmacy\nValid PRC License\nKnowledge of drug interactions',
         true),
        ('Radiologic Technologist', 'Radiology Department', 'Full-time', 'General Santos City',
         'Operate imaging equipment and assist in diagnostic procedures.',
         'Bachelor of Science in Radiologic Technology\nValid PRC License\nExperience with CT/MRI preferred',
         true)
    `);

    console.log('✓ Sample jobs added successfully!');

    const count = await pool.query('SELECT COUNT(*) FROM jobs');
    console.log(`Total jobs: ${count.rows[0].count}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

addSampleJobs();
