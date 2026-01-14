# Socsargen Hospital System - Design Document

**Date:** January 13, 2025
**Project:** Socsargen Hospital System
**Status:** Planning Phase

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Compliance Requirements](#compliance-requirements)
3. [Features](#features)
4. [User Roles](#user-roles)
5. [Tech Stack](#tech-stack)
6. [System Architecture](#system-architecture)
7. [User Flow Diagrams](#user-flow-diagrams)
8. [Database Schema](#database-schema)
9. [Pages Structure](#pages-structure)
10. [Pricing Options](#pricing-options)

---

## Project Overview

A hospital website and appointment booking system for Socsargen region with the following core features:
- Public hospital information website
- Patient registration and appointment booking
- User dashboards (Patient, Doctor, Super Admin)
- Hybrid chatbox (AI + Live Staff)
- Full compliance with Philippine regulations

---

## Compliance Requirements

### A. Data Privacy Office (DPO)
- Privacy Policy - visible and written in plain language
- Consent forms - for contacts, appointment booking, newsletter signup
- Secure data handling (encrypted storage, limited access, HTTPS)

### B. Department of Health (DOH) and Professional Regulation
- Verified health information
- DOH-approved advisories and verified statistics
- Follow Ethical Guidelines on Advertising by Healthcare Institutions

### C. Accessibility and Inclusion (RA 7277)
- User-friendly for persons with disabilities
- Large readable fonts, contrast-friendly colors
- Image alt text
- Screen-reader compatibility

### D. Technical Security
- SSL certificate (HTTPS)
- Regular data backups
- Malware protection
- Domain: .org.ph or .com.ph

---

## Features

### Public Website
- Home page with hospital info
- Services page
- Doctors directory
- News/Announcements
- Contact information
- Privacy Policy page
- Chatbox widget

### Patient Features
- Registration/Login
- Book appointments
- View appointment history
- Chat with support

### Doctor Features
- Login to dashboard
- View own appointment schedule
- See patient details for appointments

### Super Admin Features
- Manage doctors (add/edit/remove)
- Manage appointments (approve/reject/reschedule)
- Manage news/announcements
- Manage website content
- Respond to escalated chats
- View registered patients

---

## User Roles

| Role | Access Level | Capabilities |
|------|--------------|--------------|
| **Visitor** | Public | View website, use chatbox |
| **Patient** | Registered User | Book appointments, view history, chat |
| **Doctor** | Limited Admin | View own appointments only |
| **Super Admin** | Full Admin | Manage everything |

---

## Tech Stack

| Layer | Technology | Reason |
|-------|------------|--------|
| **Frontend** | React.js + Tailwind CSS | Modern, accessible, responsive |
| **Backend** | Node.js + Express.js | Great for real-time chat, JavaScript full-stack |
| **Database** | PostgreSQL | Data integrity for healthcare (DPO compliance) |
| **Real-time** | Socket.io | Built-in with Node.js, free |
| **AI Chatbot** | Tawk.to + OpenAI API | Free live chat + affordable AI |
| **Authentication** | JWT + bcrypt | Secure, industry standard |
| **Hosting** | VPS (DigitalOcean/Hostinger) | Reliable, scalable |
| **Domain** | .com.ph or .org.ph | Professional, trustworthy |

### Why PostgreSQL over MongoDB?
- Healthcare data needs strict integrity (patient info, appointments)
- Better for DPO compliance (data relationships, audit trails)
- ACID compliant for sensitive data

### Why Tawk.to + OpenAI?
- Tawk.to = FREE live chat (staff can respond)
- OpenAI API = Affordable AI (pay per use)
- Best hybrid solution for tight budget

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SOCSARGEN HOSPITAL SYSTEM                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   PATIENT   │  │   DOCTOR    │  │ SUPER ADMIN │  │   VISITOR   │         │
│  │  (Login)    │  │  (Login)    │  │  (Login)    │  │  (Public)   │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                │                 │
│         └────────────────┴────────────────┴────────────────┘                 │
│                                   │                                          │
│                                   ▼                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        FRONTEND (React.js + Tailwind)                  │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │  │
│  │  │  Home    │ │ Services │ │ Doctors  │ │ Booking  │ │ Chatbox  │     │  │
│  │  │  Page    │ │  Page    │ │Directory │ │  Form    │ │ Widget   │     │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │  │
│  │  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐       │  │
│  │  │ Patient Dashboard│ │ Doctor Dashboard │ │ Admin Dashboard  │       │  │
│  │  └──────────────────┘ └──────────────────┘ └──────────────────┘       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                   │                                          │
│                                   ▼                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     BACKEND (Node.js + Express.js)                     │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │  │
│  │  │  Auth   │ │Appointment│ │ Doctor │ │  News   │ │  Chat   │          │  │
│  │  │  API    │ │   API    │ │  API   │ │  API    │ │  API    │          │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘          │  │
│  │                              │                                         │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │  │
│  │  │   Socket.io     │  │   JWT Auth      │  │  OpenAI API     │        │  │
│  │  │  (Real-time)    │  │  (Security)     │  │  (AI Chat)      │        │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                   │                                          │
│                                   ▼                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        DATABASE (PostgreSQL)                           │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │  │
│  │  │  Users  │ │Appointments│ │ Doctors │ │  News   │ │  Chats  │        │  │
│  │  │  Table  │ │  Table   │ │  Table  │ │  Table  │ │  Table  │          │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌────────────────────────────────┐  ┌────────────────────────────────┐     │
│  │      EXTERNAL SERVICES         │  │         COMPLIANCE             │     │
│  │  • Tawk.to (Live Chat)         │  │  • SSL/HTTPS                   │     │
│  │  • OpenAI API (AI Bot)         │  │  • Data Encryption             │     │
│  │  • Email Service (SMTP)        │  │  • Privacy Policy              │     │
│  │  • SMS Gateway (optional)      │  │  • Consent Forms               │     │
│  └────────────────────────────────┘  │  • Accessibility (RA 7277)     │     │
│                                       └────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## User Flow Diagrams

### Patient Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                         PATIENT FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Visit Website → Register/Login → View Doctors → Book Appointment│
│       │                                              │           │
│       ▼                                              ▼           │
│  Browse Info                              View Dashboard         │
│  Use Chatbox                              See Appointment Status │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Doctor Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                         DOCTOR FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Login → View Dashboard → See Today's Appointments → Manage      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Super Admin Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                       SUPER ADMIN FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Login → Dashboard → Manage:                                     │
│                       • Doctors (add/edit/remove)                │
│                       • Appointments (approve/reject)            │
│                       • News/Announcements                       │
│                       • Chat (respond to escalated)              │
│                       • Users (view patients)                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Chatbox Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                         CHATBOX FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User Opens Chat                                                 │
│       │                                                          │
│       ▼                                                          │
│  AI Bot Responds (FAQ, basic questions)                          │
│       │                                                          │
│       ├── Question Answered → End                                │
│       │                                                          │
│       └── Complex Question → Escalate to Live Staff              │
│                                   │                              │
│                                   ▼                              │
│                          Staff Responds via Tawk.to              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('patient', 'doctor', 'admin') DEFAULT 'patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Doctors Table
```sql
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    schedule JSONB,
    bio TEXT,
    photo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES users(id),
    doctor_id INTEGER REFERENCES doctors(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### News Table
```sql
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    author_id INTEGER REFERENCES users(id),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Consent Logs Table (DPO Compliance)
```sql
CREATE TABLE consent_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    consent_type VARCHAR(50) NOT NULL,
    consented BOOLEAN NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Pages Structure

### Public Pages
| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero, services overview, news |
| About | `/about` | Hospital info, mission, vision |
| Services | `/services` | List of medical services |
| Doctors | `/doctors` | Doctors directory with specializations |
| News | `/news` | Health articles, announcements |
| Contact | `/contact` | Contact form, map, details |
| Privacy Policy | `/privacy` | DPO-compliant privacy policy |

### Auth Pages
| Page | URL | Description |
|------|-----|-------------|
| Login | `/login` | User login |
| Register | `/register` | Patient registration with consent |
| Forgot Password | `/forgot-password` | Password recovery |

### Patient Dashboard
| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/patient/dashboard` | Overview, upcoming appointments |
| Book Appointment | `/patient/book` | Select doctor, date, time |
| My Appointments | `/patient/appointments` | View/cancel appointments |
| Profile | `/patient/profile` | Edit personal info |

### Doctor Dashboard
| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/doctor/dashboard` | Today's appointments |
| Schedule | `/doctor/schedule` | View all appointments |
| Profile | `/doctor/profile` | Edit profile |

### Admin Dashboard
| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/admin/dashboard` | Overview, stats |
| Appointments | `/admin/appointments` | Manage all appointments |
| Doctors | `/admin/doctors` | Manage doctors |
| Patients | `/admin/patients` | View patients |
| News | `/admin/news` | Manage news/announcements |
| Settings | `/admin/settings` | Hospital info, system settings |

---

## Pricing Options

### Development Cost Only
*(Hosting & Domain to be purchased separately)*

---

### Option A: Budget Package - ₱65,000

**Includes:**
- All public pages (Home, About, Services, Doctors, News, Contact, Privacy)
- Patient registration & login
- Basic appointment booking
- Patient dashboard (view appointments)
- Doctor dashboard (view own appointments)
- Admin dashboard (basic management)
- Tawk.to integration (live chat only, no AI)
- Mobile responsive design
- Basic accessibility features
- SSL setup assistance

**Does NOT include:**
- AI chatbot integration
- Email notifications
- SMS notifications
- Advanced analytics

**Best for:** Minimum viable product, testing the concept

---

### Option B: Standard Package - ₱95,000 ⭐ RECOMMENDED

**Includes everything in Budget, PLUS:**
- OpenAI chatbot integration (hybrid AI + live chat)
- Email notifications (appointment confirmations, reminders)
- Advanced admin dashboard with analytics
- Full accessibility compliance (RA 7277)
- Data encryption for patient records
- Consent management system (DPO compliance)
- 30 days post-launch support

**Best for:** Production-ready system with all compliance requirements

---

### Option C: Premium Package - ₱150,000

**Includes everything in Standard, PLUS:**
- SMS notifications (Semaphore/Globe Labs integration)
- Advanced reporting and analytics dashboard
- Multi-language support (English + Filipino)
- Custom email templates
- Priority support (60 days)
- Training documentation for staff
- Video training for admin users

**Best for:** Full-featured system with premium support

---

### Monthly Recurring Costs (Separate from Development)

| Item | Monthly Cost | Notes |
|------|--------------|-------|
| Domain (.com.ph) | ~₱100/month | (~₱1,200/year) |
| VPS Hosting | ₱500 - ₱1,500/month | DigitalOcean/Hostinger |
| SSL Certificate | FREE | Let's Encrypt |
| Tawk.to | FREE | Live chat |
| OpenAI API | ₱500 - ₱2,000/month | Depends on chat volume |
| Email Service | FREE - ₱500/month | Mailgun free tier available |
| SMS Service | ₱0.50/SMS | Pay per use |

**Estimated Monthly Total: ₱1,100 - ₱4,000/month**

---

### Payment Terms

| Milestone | Percentage | Amount (Standard) |
|-----------|------------|-------------------|
| Project Start | 40% | ₱38,000 |
| Frontend Complete | 30% | ₱28,500 |
| Final Delivery | 30% | ₱28,500 |
| **Total** | **100%** | **₱95,000** |

---

## Recommended Hosting Providers (Philippines-friendly)

| Provider | Monthly Cost | Pros |
|----------|--------------|------|
| DigitalOcean | $6-12 (~₱350-700) | Reliable, good docs |
| Hostinger VPS | ₱249-599 | Cheap, decent support |
| Linode | $5-10 (~₱290-580) | Good performance |
| AWS Lightsail | $5-10 (~₱290-580) | Scalable |

---

## Project Timeline Breakdown

| Phase | Tasks |
|-------|-------|
| **Phase 1: Setup** | Project setup, database design, authentication |
| **Phase 2: Public Pages** | Home, About, Services, Doctors, News, Contact |
| **Phase 3: Patient Features** | Registration, booking, dashboard |
| **Phase 4: Admin Features** | Doctor dashboard, Admin dashboard |
| **Phase 5: Chat Integration** | Tawk.to + OpenAI integration |
| **Phase 6: Compliance** | Privacy policy, consent forms, accessibility |
| **Phase 7: Testing & Deploy** | Testing, bug fixes, deployment |

---

## Next Steps

1. Choose pricing package (Budget/Standard/Premium)
2. Finalize requirements
3. Sign contract and initial payment
4. Begin development

---

*Document prepared for Socsargen Hospital System Project*
