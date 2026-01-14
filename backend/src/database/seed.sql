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
-- SAMPLE DOCTORS
-- Password: doctor123 (bcrypt hashed)
-- ===========================================
INSERT INTO users (id, email, password, first_name, last_name, phone, role) VALUES
('d1111111-1111-1111-1111-111111111111', 'dr.santos@socsargen-hospital.com', '$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy', 'Maria', 'Santos', '09171234567', 'doctor'),
('d2222222-2222-2222-2222-222222222222', 'dr.reyes@socsargen-hospital.com', '$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy', 'Juan', 'Reyes', '09181234567', 'doctor'),
('d3333333-3333-3333-3333-333333333333', 'dr.cruz@socsargen-hospital.com', '$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy', 'Ana', 'Cruz', '09191234567', 'doctor'),
-- Additional doctors for all departments
('d4444444-4444-4444-4444-444444444444', 'dr.garcia@socsargen-hospital.com', '$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy', 'Carlos', 'Garcia', '09201234567', 'doctor'),
('d5555555-5555-5555-5555-555555555555', 'dr.mendoza@socsargen-hospital.com', '$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy', 'Elena', 'Mendoza', '09211234567', 'doctor'),
('d6666666-6666-6666-6666-666666666666', 'dr.villanueva@socsargen-hospital.com', '$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy', 'Roberto', 'Villanueva', '09221234567', 'doctor'),
('d7777777-7777-7777-7777-777777777777', 'dr.torres@socsargen-hospital.com', '$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy', 'Patricia', 'Torres', '09231234567', 'doctor'),
('d8888888-8888-8888-8888-888888888888', 'dr.bautista@socsargen-hospital.com', '$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy', 'Miguel', 'Bautista', '09241234567', 'doctor'),
('d9999999-9999-9999-9999-999999999999', 'dr.fernandez@socsargen-hospital.com', '$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy', 'Isabel', 'Fernandez', '09251234567', 'doctor'),
('da111111-1111-1111-1111-111111111111', 'dr.ramos@socsargen-hospital.com', '$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy', 'Antonio', 'Ramos', '09261234567', 'doctor'),
('db222222-2222-2222-2222-222222222222', 'dr.castro@socsargen-hospital.com', '$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy', 'Carmen', 'Castro', '09271234567', 'doctor'),
('dc333333-3333-3333-3333-333333333333', 'dr.aquino@socsargen-hospital.com', '$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy', 'David', 'Aquino', '09281234567', 'doctor'),
('dd444444-4444-4444-4444-444444444444', 'dr.navarro@socsargen-hospital.com', '$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy', 'Rosa', 'Navarro', '09291234567', 'doctor'),
('de555555-5555-5555-5555-555555555555', 'dr.ocampo@socsargen-hospital.com', '$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy', 'Fernando', 'Ocampo', '09301234567', 'doctor'),
('df666666-6666-6666-6666-666666666666', 'dr.delrosario@socsargen-hospital.com', '$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy', 'Lucia', 'Del Rosario', '09311234567', 'doctor')
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- Doctor profiles with departments (14 departments from official website)
INSERT INTO doctors (user_id, specialization, department, license_number, bio, consultation_fee) VALUES
('d1111111-1111-1111-1111-111111111111', 'Internal Medicine', 'Department of Internal Medicine', 'PRC-12345', 'Dr. Maria Santos is a board-certified internist with over 10 years of experience in diagnosing and treating adult diseases.', 500.00),
('d2222222-2222-2222-2222-222222222222', 'Pediatrics', 'Department of Pediatrics', 'PRC-23456', 'Dr. Juan Reyes specializes in child healthcare and development, with expertise in childhood diseases and immunization.', 600.00),
('d3333333-3333-3333-3333-333333333333', 'OB-Gynecology', 'Department of OB-GYN', 'PRC-34567', 'Dr. Ana Cruz is a dedicated OB-GYN specialist focused on womens health, prenatal care, and reproductive medicine.', 700.00),
('d4444444-4444-4444-4444-444444444444', 'Cardiology', 'Department of Cardiology', 'PRC-45678', 'Dr. Carlos Garcia is a board-certified cardiologist specializing in heart disease diagnosis and treatment.', 800.00),
('d5555555-5555-5555-5555-555555555555', 'Orthopedics', 'Department of Orthopedics', 'PRC-56789', 'Dr. Elena Mendoza specializes in bone and joint disorders, sports injuries, and orthopedic surgery.', 750.00),
('d6666666-6666-6666-6666-666666666666', 'Neurology', 'Department of Neurology', 'PRC-67890', 'Dr. Roberto Villanueva is an expert in diagnosing and treating disorders of the nervous system.', 850.00),
('d7777777-7777-7777-7777-777777777777', 'Gastroenterology', 'Department of Gastroenterology', 'PRC-78901', 'Dr. Patricia Torres specializes in digestive system disorders and gastrointestinal diseases.', 750.00),
('d8888888-8888-8888-8888-888888888888', 'Oncology', 'Department of Oncology', 'PRC-89012', 'Dr. Miguel Bautista is dedicated to cancer diagnosis, treatment, and patient care.', 900.00),
('d9999999-9999-9999-9999-999999999999', 'General Surgery', 'Department of Surgery', 'PRC-90123', 'Dr. Isabel Fernandez is an experienced general surgeon performing various surgical procedures.', 800.00),
('da111111-1111-1111-1111-111111111111', 'Anesthesiology', 'Department of Anesthesiology', 'PRC-01234', 'Dr. Antonio Ramos specializes in anesthesia and perioperative medicine for surgical patients.', 700.00),
('db222222-2222-2222-2222-222222222222', 'Family Medicine', 'Department of Family Medicine', 'PRC-11234', 'Dr. Carmen Castro provides comprehensive healthcare for patients of all ages as a family medicine specialist.', 500.00),
('dc333333-3333-3333-3333-333333333333', 'Dental Medicine', 'Department of Dental Medicine', 'PRC-21234', 'Dr. David Aquino is a skilled dentist providing comprehensive dental care and oral health services.', 450.00),
('dd444444-4444-4444-4444-444444444444', 'Pathology', 'Department of Pathology', 'PRC-31234', 'Dr. Rosa Navarro specializes in laboratory medicine and disease diagnosis through tissue analysis.', 650.00),
('de555555-5555-5555-5555-555555555555', 'Radiology', 'Department of Radiology', 'PRC-41234', 'Dr. Fernando Ocampo is an expert in medical imaging and diagnostic radiology services.', 600.00),
('df666666-6666-6666-6666-666666666666', 'Cardiology', 'Department of Cardiology', 'PRC-51234', 'Dr. Lucia Del Rosario specializes in interventional cardiology and heart disease prevention.', 850.00)
ON CONFLICT DO NOTHING;

-- Doctor schedules (Monday to Friday, 8AM to 5PM) for all doctors
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, max_patients)
SELECT d.id, day_num, '08:00:00', '17:00:00', 20
FROM doctors d
CROSS JOIN generate_series(1, 5) as day_num
ON CONFLICT DO NOTHING;

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
