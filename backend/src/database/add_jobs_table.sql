-- ===========================================
-- ADD JOBS TABLE MIGRATION
-- Run this script to add jobs table to existing database
-- ===========================================

-- Create jobs table if it doesn't exist
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    job_type VARCHAR(50) DEFAULT 'Full-time' CHECK (job_type IN ('Full-time', 'Part-time', 'Contract', 'Temporary')),
    location VARCHAR(255) DEFAULT 'General Santos City',
    description TEXT NOT NULL,
    requirements TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_department ON jobs(department);

-- Insert sample job postings
INSERT INTO jobs (title, department, job_type, location, description, requirements, is_active)
VALUES
    ('Registered Nurse', 'Nursing Department', 'Full-time', 'General Santos City',
     'We are looking for compassionate and skilled registered nurses to join our healthcare team. You will provide patient care, administer medications, and collaborate with doctors and other healthcare professionals.',
     'Bachelor of Science in Nursing\nValid PRC License\nBLS/ACLS Certification\nAt least 1 year hospital experience',
     true),
    ('Medical Technologist', 'Laboratory Department', 'Full-time', 'General Santos City',
     'Join our laboratory team and help provide accurate diagnostic results for patient care. You will perform various laboratory tests and maintain quality control standards.',
     'Bachelor of Science in Medical Technology\nValid PRC License\nKnowledge of laboratory procedures\nAttention to detail',
     true),
    ('Pharmacist', 'Pharmacy Department', 'Full-time', 'General Santos City',
     'We need licensed pharmacists to ensure safe and effective medication management for our patients.',
     'Bachelor of Science in Pharmacy\nValid PRC License\nKnowledge of drug interactions\nExcellent communication skills',
     true),
    ('Radiologic Technologist', 'Radiology Department', 'Full-time', 'General Santos City',
     'Operate imaging equipment and assist in diagnostic procedures. You will work with state-of-the-art imaging technology.',
     'Bachelor of Science in Radiologic Technology\nValid PRC License\nExperience with CT/MRI preferred\nRadiation safety knowledge',
     true)
ON CONFLICT DO NOTHING;

-- ===========================================
-- JOB APPLICATIONS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'interviewed', 'accepted', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, user_id)
);

-- Create indexes for job_applications
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);

SELECT 'Jobs and Job Applications tables created successfully!' as status;
