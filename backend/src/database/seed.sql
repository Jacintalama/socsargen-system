-- ===========================================
-- SOCSARGEN HOSPITAL SYSTEM - SEED DATA
-- ===========================================

-- ===========================================
-- DEFAULT ADMIN USER
-- Password: admin123 (bcrypt hashed)
-- ===========================================
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@socsargen-hospital.com', '$2a$10$oM774grA8t87pYuFyc.SROTLVax1iyFvLjMqRuZA2vUDS5Fvx/18q', 'Super', 'Admin', 'admin')
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- ===========================================
-- TEST HR ACCOUNT
-- Password: hr123 (bcrypt hashed)
-- ===========================================
INSERT INTO users (email, password, first_name, last_name, phone, role) VALUES
('hr@socsargen-hospital.com', '$2a$10$Ws0Wc7f8yDcbup92dAHnBeJhtbqtZhj79WM71HvE6sGp.7Op8wraO', 'Test', 'HR', '09171111111', 'hr')
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- ===========================================
-- TEST DOCTOR ACCOUNTS (10 Doctors)
-- Password: doctor123 (bcrypt hashed)
-- ===========================================

-- Clean up old test doctor data first (by known UUIDs and emails)
DELETE FROM doctor_schedules WHERE doctor_id IN (SELECT id FROM doctors WHERE user_id IN (
  'd1111111-1111-1111-1111-111111111111',
  'd2222222-2222-2222-2222-222222222222',
  'd3333333-3333-3333-3333-333333333333',
  'd4444444-4444-4444-4444-444444444444',
  'd5555555-5555-5555-5555-555555555555',
  'd6666666-6666-6666-6666-666666666666',
  'd7777777-7777-7777-7777-777777777777',
  'd8888888-8888-8888-8888-888888888888',
  'd9999999-9999-9999-9999-999999999999',
  'da111111-1111-1111-1111-111111111111'
));
DELETE FROM doctors WHERE user_id IN (
  'd1111111-1111-1111-1111-111111111111',
  'd2222222-2222-2222-2222-222222222222',
  'd3333333-3333-3333-3333-333333333333',
  'd4444444-4444-4444-4444-444444444444',
  'd5555555-5555-5555-5555-555555555555',
  'd6666666-6666-6666-6666-666666666666',
  'd7777777-7777-7777-7777-777777777777',
  'd8888888-8888-8888-8888-888888888888',
  'd9999999-9999-9999-9999-999999999999',
  'da111111-1111-1111-1111-111111111111'
);
-- Also clean up any orphaned doctor records linked to test doctor emails
DELETE FROM doctor_schedules WHERE doctor_id IN (
  SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id
  WHERE u.email LIKE 'doctor.%@socsargen-hospital.com'
);
DELETE FROM doctors WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE 'doctor.%@socsargen-hospital.com'
);
DELETE FROM users WHERE email LIKE 'doctor.%@socsargen-hospital.com';

-- Insert doctor user accounts
INSERT INTO users (id, email, password, first_name, last_name, phone, role) VALUES
('d1111111-1111-1111-1111-111111111111', 'doctor.santos@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Maria', 'Santos', '09171000001', 'doctor'),
('d2222222-2222-2222-2222-222222222222', 'doctor.reyes@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Juan', 'Reyes', '09171000002', 'doctor'),
('d3333333-3333-3333-3333-333333333333', 'doctor.cruz@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Ana', 'Cruz', '09171000003', 'doctor'),
('d4444444-4444-4444-4444-444444444444', 'doctor.garcia@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Carlos', 'Garcia', '09171000004', 'doctor'),
('d5555555-5555-5555-5555-555555555555', 'doctor.mendoza@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Elena', 'Mendoza', '09171000005', 'doctor'),
('d6666666-6666-6666-6666-666666666666', 'doctor.villanueva@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Roberto', 'Villanueva', '09171000006', 'doctor'),
('d7777777-7777-7777-7777-777777777777', 'doctor.torres@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Patricia', 'Torres', '09171000007', 'doctor'),
('d8888888-8888-8888-8888-888888888888', 'doctor.bautista@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Miguel', 'Bautista', '09171000008', 'doctor'),
('d9999999-9999-9999-9999-999999999999', 'doctor.fernandez@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Isabel', 'Fernandez', '09171000009', 'doctor'),
('da111111-1111-1111-1111-111111111111', 'doctor.ramos@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Antonio', 'Ramos', '09171000010', 'doctor')
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  is_active = true;

-- Doctor profiles (10 different departments)
INSERT INTO doctors (user_id, specialization, department, license_number, bio, consultation_fee, is_available) VALUES
('d1111111-1111-1111-1111-111111111111', 'Internal Medicine', 'Department of Internal Medicine', 'PRC-00001', 'Board-certified internist specializing in adult diseases and preventive care.', 500.00, true),
('d2222222-2222-2222-2222-222222222222', 'Pediatrics', 'Department of Pediatrics', 'PRC-00002', 'Child healthcare specialist with expertise in childhood diseases and immunization.', 600.00, true),
('d3333333-3333-3333-3333-333333333333', 'OB-Gynecology', 'Department of OB-GYN', 'PRC-00003', 'OB-GYN specialist focused on womens health, prenatal care, and reproductive medicine.', 700.00, true),
('d4444444-4444-4444-4444-444444444444', 'Cardiology', 'Department of Cardiology', 'PRC-00004', 'Board-certified cardiologist specializing in heart disease diagnosis and treatment.', 800.00, true),
('d5555555-5555-5555-5555-555555555555', 'Orthopedics', 'Department of Orthopedics', 'PRC-00005', 'Specialist in bone and joint disorders, sports injuries, and orthopedic surgery.', 750.00, true),
('d6666666-6666-6666-6666-666666666666', 'General Surgery', 'Department of Surgery', 'PRC-00006', 'Experienced general surgeon performing various surgical procedures.', 800.00, true),
('d7777777-7777-7777-7777-777777777777', 'Neurology', 'Department of Neurology', 'PRC-00007', 'Expert in diagnosing and treating disorders of the nervous system.', 850.00, true),
('d8888888-8888-8888-8888-888888888888', 'Dermatology', 'Department of Dermatology', 'PRC-00008', 'Specialist in skin conditions, cosmetic dermatology, and skin cancer screening.', 650.00, true),
('d9999999-9999-9999-9999-999999999999', 'Ophthalmology', 'Department of Ophthalmology', 'PRC-00009', 'Eye care specialist for vision correction, cataract surgery, and eye disease treatment.', 700.00, true),
('da111111-1111-1111-1111-111111111111', 'Dental Medicine', 'Department of Dental Medicine', 'PRC-00010', 'Comprehensive dental care including preventive, restorative, and cosmetic dentistry.', 450.00, true);

-- Doctor schedules (Monday to Friday, 8AM to 5PM)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, max_patients)
SELECT d.id, day_num, '08:00:00', '17:00:00', 20
FROM doctors d
CROSS JOIN generate_series(1, 5) as day_num
ON CONFLICT DO NOTHING;

-- ===========================================
-- TEST PATIENT ACCOUNT
-- Password: patient123 (bcrypt hashed)
-- ===========================================
INSERT INTO users (email, password, first_name, last_name, phone, role) VALUES
('patient@socsargen-hospital.com', '$2a$10$jEMvIxklWvJds6LNo7agSO9KXCISU3Vo6HbnZIwQmhgcqnpLXHSxC', 'Test', 'Patient', '09174444444', 'patient')
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- ===========================================
-- HOSPITAL SERVICES (31 Services from Official Website)
-- ===========================================

-- Clear existing services to avoid duplicates
TRUNCATE services RESTART IDENTITY CASCADE;

-- Column 1 - Cardiac/Surgical Services (9 services)
INSERT INTO services (name, description, category, icon, is_featured, display_order) VALUES
('Catheterization Laboratory', 'Advanced cardiac catheterization procedures for diagnosis and treatment of heart conditions.', 'Cardiac', 'heart', false, 1),
('Open-Heart Surgeries', 'Complex cardiac surgical procedures performed by experienced cardiac surgeons with state-of-the-art equipment.', 'Cardiac', 'heart', false, 2),
('Bypass Surgery', 'Coronary artery bypass grafting (CABG) for patients with coronary artery disease.', 'Cardiac', 'heart', false, 3),
('Endovascular Aneurysm Repair', 'Minimally invasive aneurysm treatment using advanced endovascular techniques.', 'Cardiac', 'heart', false, 4),
('MRI', 'Magnetic Resonance Imaging for detailed internal body imaging without radiation.', 'Diagnostic', 'radiology', false, 5),
('Cancer Care Center', 'Comprehensive cancer treatment and care with multidisciplinary approach.', 'Specialty', 'medical', false, 6),
('Chemotherapy', 'Cancer treatment using chemical agents administered by specialized oncology staff.', 'Specialty', 'medical', false, 7),
('OR/DR', 'Operating Room and Delivery Room facilities with modern surgical and birthing equipment.', 'Surgical', 'surgery', false, 8),
('NICU', 'Neonatal Intensive Care Unit providing specialized care for critically ill newborns.', 'Specialty', 'baby', false, 9),

-- Column 2 - Emergency/Outpatient Services (7 services)
('ICU', 'Intensive Care Unit providing optimum healthcare service for patients needing special 24-hour care. Excellent facilities including intensive care equipment for complete patient monitoring.', 'Emergency', 'emergency', true, 10),
('Outpatient Emergency Care', 'Emergency services for outpatients requiring immediate medical attention.', 'Emergency', 'emergency', false, 11),
('Urgent Care Center', 'Immediate care for non-life-threatening conditions without the need for an appointment.', 'Emergency', 'emergency', false, 12),
('Outpatient Services', 'Medical services without overnight stay, including consultations and minor procedures.', 'Outpatient', 'outpatient', false, 13),
('Express Care Center', 'Quick consultations and treatments for minor health concerns.', 'Outpatient', 'outpatient', false, 14),
('Satellite Clinic (Alabel)', 'Branch clinic in Alabel providing accessible healthcare services to the community.', 'Outpatient', 'clinic', false, 15),
('Medical Arts Tower', 'Specialist consultations with various medical specialists in one convenient location.', 'Outpatient', 'building', false, 16),

-- Column 3 - Diagnostic/Rehabilitation Services (8 services)
('Laboratory', 'Comprehensive and advanced laboratory services. Precise, accurate and fast clinical diagnosis. Highly competent medical technologists and technicians.', 'Diagnostic', 'lab', true, 17),
('Radiology / Imaging', 'Diagnostic X-ray, General Ultrasonography, Computerized Tomography, MRI (soon), and Mammography with most technologically advanced equipment.', 'Diagnostic', 'radiology', true, 18),
('Cardio-Pulmonary', 'Heart and lung diagnostics including ECG, stress tests, and pulmonary function tests.', 'Diagnostic', 'heart', false, 19),
('Sleep Studies', 'Sleep disorder diagnosis through comprehensive sleep monitoring and analysis.', 'Diagnostic', 'sleep', false, 20),
('Physical Therapy', 'Physical rehabilitation services to help patients recover mobility and function.', 'Rehabilitation', 'therapy', false, 21),
('Occupational Therapy', 'Daily activities therapy to help patients regain independence in everyday tasks.', 'Rehabilitation', 'therapy', false, 22),
('Speech Therapy', 'Speech and language treatment for patients with communication disorders.', 'Rehabilitation', 'speech', false, 23),
('Educational Therapy', 'Learning support therapy for patients with educational and developmental needs.', 'Rehabilitation', 'education', false, 24),

-- Column 4 - Specialty Services (3 services)
('Dental Services', 'State-of-the-art facility at Medical Plaza. Highly competent doctors for all dental needs including preventive, restorative, and cosmetic dentistry.', 'Specialty', 'dental', true, 25),
('Hemodialysis', 'Home away from home with comfortable lazy boy chairs for clients undergoing Hemodialysis. Top of the line Hemodialysis Machines and well trained staff. Most affordable rate for Hemodialysis Service.', 'Specialty', 'kidney', true, 26),
('Nutrition & Dietetics', 'Nutritional counseling and dietary planning for patients with various health conditions.', 'Specialty', 'nutrition', false, 27),

-- Additional Featured Services from Homepage
('Heart Station', 'Today''s lifestyles and rapid changing environments, cardiovascular diseases have become the most leading cause of mortality. The SCH heart station offers the best diagnostic service with excellent facilities and highly skilled personnel.', 'Cardiac', 'heart', true, 28),
('Rehabilitation Medicine Department', 'Composed of very experienced licensed Physical Therapists and Physiatrists. First and only EMG-NCV machine that measures muscle response or electrical activity.', 'Rehabilitation', 'therapy', true, 29),
('Digestive Endoscopy Unit', 'Fast, safe, and effective diagnosis of gastrointestinal diseases. Diagnostic and therapeutic procedures of the upper and lower gastrointestinal tract.', 'Diagnostic', 'medical', true, 30),
('Emergency Services', 'Expert emergency physicians trained in Emergency Medicine with Nursing staff adept in Advance Life Support and Triaging. 24 hours a day service.', 'Emergency', 'emergency', true, 31),
('OFW Clinic', 'Only clinic of its kind in Region 12. Accredited by DOH, DOLE/POEA, and MARINA. Caters to both land-based and seafarer applicants for overseas workers and seafarers medical examinations.', 'Specialty', 'clinic', true, 32)
ON CONFLICT DO NOTHING;

-- ===========================================
-- SAMPLE NEWS/ANNOUNCEMENTS
-- ===========================================
INSERT INTO news (title, slug, content, excerpt, is_published, published_at, author_id) VALUES
(
  'Welcome to Socsargen Hospital Online Services',
  'welcome-to-socsargen-hospital-online-services',
  'We are excited to announce the launch of our new online appointment booking system. Patients can now easily schedule appointments with our doctors from the comfort of their homes. Our new system features an easy-to-use interface for booking appointments, real-time availability checking, and instant confirmation. Register today and experience healthcare made convenient!',
  'We are excited to announce the launch of our new online appointment booking system.',
  true,
  CURRENT_TIMESTAMP,
  (SELECT id FROM users WHERE email = 'admin@socsargen-hospital.com' LIMIT 1)
),
(
  'COVID-19 Safety Protocols Update',
  'covid-19-safety-protocols-update',
  'Socsargen Hospital continues to implement strict COVID-19 safety protocols to ensure the safety of our patients and staff. All visitors are required to wear masks, undergo temperature screening, and practice proper hand hygiene. We have also implemented social distancing measures in our waiting areas. Your health and safety remain our top priority.',
  'Socsargen Hospital continues to implement strict COVID-19 safety protocols.',
  true,
  CURRENT_TIMESTAMP - INTERVAL '1 day',
  (SELECT id FROM users WHERE email = 'admin@socsargen-hospital.com' LIMIT 1)
),
(
  'New Pediatric Wing Now Open',
  'new-pediatric-wing-now-open',
  'We are proud to announce the opening of our new Pediatric Wing, designed specifically with children in mind. The wing features child-friendly decor, a dedicated play area, and specialized equipment for pediatric care. Our team of pediatric specialists is ready to provide the best care for your little ones in a comfortable and welcoming environment.',
  'We are proud to announce the opening of our new Pediatric Wing.',
  true,
  CURRENT_TIMESTAMP - INTERVAL '3 days',
  (SELECT id FROM users WHERE email = 'admin@socsargen-hospital.com' LIMIT 1)
)
ON CONFLICT (slug) DO NOTHING;
