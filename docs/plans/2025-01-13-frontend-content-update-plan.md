# Socsargen Hospital System - Frontend Content Update Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update frontend pages with scraped data from https://socsargen-ch.vercel.app/ to match the official hospital website structure and content.

**Architecture:** React components will be updated to reflect the official website's navigation structure, services, and content. Dropdown menus will be added for Services, Doctors, and About Us sections.

**Tech Stack:** React + Tailwind CSS v4 + React Router

---

## Scraped Website Data

### Navigation Structure

```
Header Top Bar:
- Address: L. Arradaza St., Bula-Lagao Road, Lagao, General Santos City | 0956-036-9408
- Contact Us (#)
- Facebook: https://www.facebook.com/SocsargenCountyHospitalOfficial/
- Instagram: https://www.instagram.com/explore/locations/111506110436043/soccsksargen-general-hospital/
- TikTok: https://www.tiktok.com/@ppiaaya/video/7150000371698519322

Main Navigation:
1. Home (/)
2. Our Services (/services) - DROPDOWN
3. Our Doctors (#) - DROPDOWN
4. About Us (/about) - DROPDOWN
5. Contact Us (/contact)
6. Login (/login) - Icon button
```

### Our Services Dropdown Menu

| Column 1 | Column 2 | Column 3 | Column 4 |
|----------|----------|----------|----------|
| Catheterization Laboratory | ICU | Laboratory | Dental Services |
| Open-Heart Surgeries | Outpatient Emergency Care | Radiology / Imaging | Hemodialysis |
| Bypass Surgery | Urgent Care Center | Cardio-Pulmonary | Nutrition & Dietetics |
| Endovascular Aneurysm Repair | Outpatient Services | Sleep Studies | |
| MRI | Express Care Center | Physical Therapy | |
| Cancer Care Center | Satellite Clinic (Alabel) | Occupational Therapy | |
| Chemotherapy | Medical Arts Tower | Speech Therapy | |
| OR/DR | | Educational Therapy | |
| NICU | | | |

### Our Doctors Dropdown Menu

**Header Text:** "At Socsargen County Hospital, we believe in honoring the guardians of health - our esteemed doctors."

| Column 1 | Column 2 |
|----------|----------|
| Department of Cardiology | Department of OB-GYN |
| Department of Orthopedics | Department of Surgery |
| Department of Neurology | Department of Anesthesiology |
| Department of Gastroenterology | Department of Family Medicine |
| Department of Oncology | Department of Dental Medicine |
| Department of Internal Medicine | Department of Pathology |
| Department of Pediatrics | Department of Radiology |

### About Us Dropdown Menu

**Header:** "Welcome to Socsargen County Hospital! Here, you're more than just a patient, you're family."

| Column 1 | Column 2 |
|----------|----------|
| History & Milestones | Leadership |
| Accreditations & Certifications | Socsargen County Hospital |
| Mission & Vision Statements | |
| Core Values | |

---

## Homepage Sections Data

### 1. Hero Section
- **Title:** "Welcome to Socsargen County Hospital"
- **Subtitle:** "Leading with Innovation, Serving with Compassion."
- **CTA Button:** "Learn More"

### 2. Quick Help Section
- **Title:** "Get high-quality healthcare in the heart of General Santos City"
- **Subtitle:** "How can we help you today?"
- **Cards:**
  1. Find a Doctor (icon: doctor emoji)
  2. Book an Executive Check Up (icon: hospital emoji)
  3. Learn about our Wellness Packages (icon: pill emoji)

### 3. Our Services Section (10 Services)

| Service Name | Description |
|--------------|-------------|
| Kidney Care Center | Home away from home with comfortable lazy boy chairs for clients undergoing Hemodialysis. Top of the line Hemodialysis Machines and well trained staff. Most affordable rate for Hemodialysis Service. |
| Heart Station | Cardiovascular disease diagnostic service with excellent facilities and highly skilled personnel. |
| Rehabilitation Medicine Department | Experienced licensed Physical Therapists and Physiatrists. First and only EMG-NCV machine in the area. |
| Digestive Endoscopy Unit | Fast, safe, and effective diagnosis of gastrointestinal diseases. Diagnostic and therapeutic procedures of upper and lower GI tract. |
| Emergency Services | Expert emergency physicians trained in Emergency Medicine. Nursing staff adept in Advance Life Support and Triaging. 24 hours a day service. |
| Intensive Care Unit | Optimum healthcare service for patients needing special 24-hour care. Intensive care equipment for complete patient monitoring. |
| Laboratory | Comprehensive and advanced laboratory services. Precise, accurate and fast clinical diagnosis. Highly competent medical technologists and technicians. |
| Radiology | Diagnostic X-ray, General Ultrasonography, Computerized Tomography, MRI (soon), and Mammography. Most technologically advanced radiology equipment. |
| Overseas Workers and Seafarers (OFW Clinic) | Only clinic of its kind in Region 12. Accredited by DOH, DOLE/POEA, and MARINA. Caters to both land-based and seafarer applicants. |
| Dental Services | State-of-the-art facility at Medical Plaza. Highly competent doctors for all dental needs. |

### 4. Facilities Carousel
- **Catheterization Lab:** "Transforms cardiac care to allow the performance of minimally invasive diagnostic tests and treatment procedures on patients."

### 5. Meet Our Doctors Section
- **Title:** "Meet our Doctors"
- **Subtitle:** "Meet the seasoned experts of Socsargen County Hospital."
- **Categories:** Admitting Physician, Anesthesiologist, Attending Physician, Resident on Duty, Surgeon, Referral

### 6. Health Packages Section
- **Title:** "Health Packages"
- **Packages:**
  1. 2-Benefit Heart Surgery Package
  2. Z-Benefit Package for Breast Cancer
  3. All-Inclusive Maternity Package
  4. Angiogram Package

### 7. About Hospital Section
- **Tagline:** "Socsargen County Hospital is a private and an ISO-accredited tertiary hospital located in General Santos City."
- **Since:** 1992
- **Description:** "Serving the people of General Santos City and setting the standards of healthcare in Region 12"

### 8. Patient Stories Section
- **Title:** "Our SCH Stories"
- **Subtitle:** "Featuring real patients whose journeys remind us that healing starts with compassion and care."
- **Testimonial:** "I am deeply Grateful to Socsargen County Hospital, it was here that I Truly Experienced genuine compassion and care." - KARELLE M. RABIA

### 9. HMO & Insurance Partners Section
- **Title:** "HMO & Insurance Partners"
- **Description:** "We take pride in partnering with various Health Maintenance Organizations (HMOs) to make quality healthcare more accessible to our community."

### 10. Facebook Integration Section
- **Title:** "Stay Connected with Socsargen County Hospital!"
- **Description:** "Don't miss out on the latest hospital news, health tips, and upcoming events."
- **Facebook Page:** https://www.facebook.com/SocsargenCountyHospitalOfficial/ (15,900+ followers)

### 11. News and Events Section
- **Title:** "News and Events"
- **News Items:**
  1. St. Elizabeth Hospital Accreditation Gold status
  2. Patient Care Excellence in Action
  3. Community Health & Wellness Fair 2026

### 12. Additional News Cards
1. **ISO 9001:2015 Certified** - SCH OFW Clinic maintained certification
2. **Renovated Critical Care Complex** - Newly renovated ICU unveiled
3. **Two Awake Brain Surgeries** - Historic milestone in Region 12

---

## Contact Information

### Phone Numbers
- Landline 1: 553-8906
- Landline 2: 553-8907
- Mobile 1: 0932-692-4708
- Mobile 2: 0956-036-9408

### Email Addresses
- socsargencountyhospital@gmail.com
- edpsocsargen@gmail.com

### Physical Address
L. Arradaza St., Bula-Lagao Road, Lagao, General Santos City, Philippines, 9500

### Social Media
- Facebook: https://www.facebook.com/SocsargenCountyHospitalOfficial/
- Instagram: https://www.instagram.com/explore/locations/111506110436043/soccsksargen-general-hospital/
- TikTok: https://www.tiktok.com/@ppiaaya/video/7150000371698519322

---

## Footer Structure

### Quick Links
- Home
- Our Services
- Our Doctors
- Careers (#)
- Contact Us

### Contact Information (Footer)
- Address with icon
- Phone numbers
- Email

### Connect With Us
- Social media icons (Facebook, Instagram, TikTok)

### Copyright
"© 2026 Socsargen County Hospital"

---

## Implementation Tasks

### Task 1: Update Navbar Component with Dropdown Menus

**Files:**
- Modify: `frontend/src/components/Layout/Navbar.jsx`
- Create: `frontend/src/components/Layout/DropdownMenu.jsx`

**Step 1: Create DropdownMenu component**

```jsx
// frontend/src/components/Layout/DropdownMenu.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function DropdownMenu({ title, href, children, columns = 1 }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        to={href}
        className="flex items-center gap-1 text-gray-700 hover:text-primary-600 font-medium"
      >
        {title}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Link>

      {isOpen && (
        <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg p-4 min-w-[200px] z-50">
          <div className={`grid grid-cols-${columns} gap-4`}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Update Navbar with new structure and top bar**

```jsx
// Add to Navbar.jsx - Top bar section
<div className="bg-primary-600 text-white text-sm py-2">
  <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
    <span>L. Arradaza St., Bula-Lagao Road, Lagao, General Santos City | 0956-036-9408</span>
    <div className="flex items-center gap-4">
      <Link to="/contact" className="hover:underline">Contact Us</Link>
      <a href="https://www.facebook.com/SocsargenCountyHospitalOfficial/" target="_blank" rel="noopener noreferrer">
        <img src="/icons/facebook.svg" alt="Facebook" className="w-5 h-5" />
      </a>
      <a href="https://www.instagram.com/explore/locations/111506110436043/" target="_blank" rel="noopener noreferrer">
        <img src="/icons/instagram.svg" alt="Instagram" className="w-5 h-5" />
      </a>
      <a href="https://www.tiktok.com/@ppiaaya/video/7150000371698519322" target="_blank" rel="noopener noreferrer">
        <img src="/icons/tiktok.svg" alt="TikTok" className="w-5 h-5" />
      </a>
    </div>
  </div>
</div>
```

**Step 3: Run dev server to verify changes**

Run: `cd frontend && npm run dev`

**Step 4: Commit**

```bash
git add frontend/src/components/Layout/Navbar.jsx frontend/src/components/Layout/DropdownMenu.jsx
git commit -m "feat: add dropdown menus to navbar with official website structure"
```

---

### Task 2: Update Services Data in Database

**Files:**
- Modify: `backend/src/database/seed.sql`

**Step 1: Update services seed data**

```sql
-- Clear existing services
DELETE FROM services;

-- Insert all 31 services from dropdown menu
INSERT INTO services (name, description, category, icon, is_active) VALUES
-- Column 1 Services
('Catheterization Laboratory', 'Advanced cardiac catheterization procedures for diagnosis and treatment of heart conditions.', 'Cardiac', 'heart', true),
('Open-Heart Surgeries', 'Complex cardiac surgical procedures performed by expert surgeons.', 'Cardiac', 'heart', true),
('Bypass Surgery', 'Coronary artery bypass grafting (CABG) procedures.', 'Cardiac', 'heart', true),
('Endovascular Aneurysm Repair', 'Minimally invasive treatment for aortic aneurysms.', 'Cardiac', 'heart', true),
('MRI', 'Magnetic Resonance Imaging for detailed body scans.', 'Diagnostic', 'scan', true),
('Cancer Care Center', 'Comprehensive cancer treatment and support services.', 'Oncology', 'ribbon', true),
('Chemotherapy', 'Cancer treatment using powerful chemical agents.', 'Oncology', 'pill', true),
('OR/DR', 'Operating Room and Delivery Room services.', 'Surgical', 'scalpel', true),
('NICU', 'Neonatal Intensive Care Unit for newborn care.', 'Pediatric', 'baby', true),
-- Column 2 Services
('ICU', 'Intensive Care Unit for critical patient monitoring and care.', 'Critical Care', 'monitor', true),
('Outpatient Emergency Care', 'Emergency medical services for outpatient cases.', 'Emergency', 'ambulance', true),
('Urgent Care Center', 'Immediate medical attention for non-life-threatening conditions.', 'Emergency', 'clock', true),
('Outpatient Services', 'Medical services that do not require overnight stay.', 'General', 'clipboard', true),
('Express Care Center', 'Quick medical consultations and treatments.', 'General', 'lightning', true),
('Satellite Clinic (Alabel)', 'Branch clinic located in Alabel for community access.', 'General', 'building', true),
('Medical Arts Tower', 'Specialist consultations and outpatient services.', 'General', 'building', true),
-- Column 3 Services
('Laboratory', 'Comprehensive clinical laboratory testing services.', 'Diagnostic', 'flask', true),
('Radiology / Imaging', 'X-ray, CT scan, ultrasound and other imaging services.', 'Diagnostic', 'scan', true),
('Cardio-Pulmonary', 'Heart and lung diagnostic and treatment services.', 'Diagnostic', 'heart-pulse', true),
('Sleep Studies', 'Diagnosis and treatment of sleep disorders.', 'Diagnostic', 'moon', true),
('Physical Therapy', 'Rehabilitation services for physical recovery.', 'Rehabilitation', 'person-running', true),
('Occupational Therapy', 'Therapy to help patients perform daily activities.', 'Rehabilitation', 'hand', true),
('Speech Therapy', 'Treatment for speech and language disorders.', 'Rehabilitation', 'comments', true),
('Educational Therapy', 'Specialized learning support and therapy.', 'Rehabilitation', 'book', true),
-- Column 4 Services
('Dental Services', 'Complete dental care at Medical Plaza.', 'Dental', 'tooth', true),
('Hemodialysis', 'Kidney dialysis treatment at Kidney Care Center.', 'Nephrology', 'droplet', true),
('Nutrition & Dietetics', 'Nutritional counseling and diet planning.', 'General', 'apple', true);

-- Main 10 featured services with full descriptions
UPDATE services SET description = 'Home away from home with comfortable lazy boy chairs for clients undergoing Hemodialysis. Top of the line Hemodialysis Machines and well trained staff. Most affordable rate for Hemodialysis Service.' WHERE name = 'Hemodialysis';
```

**Step 2: Run database setup**

Run: `cd backend && node src/database/setup.js`

**Step 3: Verify services endpoint**

Run: `curl http://localhost:5000/api/services`

**Step 4: Commit**

```bash
git add backend/src/database/seed.sql
git commit -m "feat: update services data to match official website"
```

---

### Task 3: Update Homepage Component

**Files:**
- Modify: `frontend/src/pages/Home.jsx`

**Step 1: Update hero section**

**Step 2: Add quick help cards section**

**Step 3: Update services section with new data**

**Step 4: Add facilities carousel**

**Step 5: Add doctors preview section**

**Step 6: Add health packages section**

**Step 7: Add about hospital section**

**Step 8: Add testimonials section**

**Step 9: Add HMO partners section**

**Step 10: Add Facebook integration section**

**Step 11: Add news and events section**

**Step 12: Run and verify**

Run: `npm run dev`

**Step 13: Commit**

```bash
git add frontend/src/pages/Home.jsx
git commit -m "feat: update homepage with all sections from official website"
```

---

### Task 4: Update Footer Component

**Files:**
- Modify: `frontend/src/components/Layout/Footer.jsx`

**Step 1: Update footer with official contact info and links**

**Step 2: Verify footer displays correctly**

**Step 3: Commit**

```bash
git add frontend/src/components/Layout/Footer.jsx
git commit -m "feat: update footer with official contact information"
```

---

### Task 5: Add Doctor Departments Data

**Files:**
- Modify: `backend/src/database/seed.sql`
- Create: `frontend/src/pages/Doctors.jsx` (update)

**Step 1: Add departments to database**

```sql
-- Add departments table or category to doctors
-- Departments: Cardiology, Orthopedics, Neurology, Gastroenterology, Oncology, Internal Medicine, Pediatrics, OB-GYN, Surgery, Anesthesiology, Family Medicine, Dental Medicine, Pathology, Radiology
```

**Step 2: Update doctors page with department filtering**

**Step 3: Commit**

---

### Task 6: Create About Us Page Sections

**Files:**
- Create: `frontend/src/pages/about/History.jsx`
- Create: `frontend/src/pages/about/Accreditations.jsx`
- Create: `frontend/src/pages/about/MissionVision.jsx`
- Create: `frontend/src/pages/about/CoreValues.jsx`
- Create: `frontend/src/pages/about/Leadership.jsx`

---

### Task 7: Update Contact Page with Official Info

**Files:**
- Modify: `frontend/src/pages/Contact.jsx`

**Contact Data:**
- Address: L. Arradaza St., Bula-Lagao Road, Lagao, General Santos City, Philippines, 9500
- Phones: 553-8906, 553-8907, 0932-692-4708, 0956-036-9408
- Emails: socsargencountyhospital@gmail.com, edpsocsargen@gmail.com
- Social: Facebook, Instagram, TikTok links

---

## Summary

This plan documents all content scraped from the official Socsargen County Hospital website at https://socsargen-ch.vercel.app/. The implementation tasks will update the React frontend to match the official website's:

1. Navigation structure with dropdown menus
2. All 31 services offered
3. 14 medical departments
4. Complete contact information
5. Homepage sections (hero, services, facilities, doctors, packages, testimonials, HMO partners, news)
6. Footer with quick links and social media

All dropdown menu items that don't have actual pages yet will use `#` as placeholder links.
