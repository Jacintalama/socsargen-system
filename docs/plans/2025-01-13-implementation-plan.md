# Socsargen Hospital System - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a hospital website with appointment booking, user dashboards, and hybrid AI chatbox for Socsargen region.

**Architecture:** Monorepo with separate `/backend` (Node.js + Express + PostgreSQL) and `/frontend` (React + Tailwind). REST API for data, Socket.io for real-time chat. JWT authentication with role-based access (patient, doctor, admin).

**Tech Stack:** Node.js, Express.js, PostgreSQL, React.js, Tailwind CSS, Socket.io, JWT, bcrypt, Tawk.to, OpenAI API

---

## Phase 1: Project Setup

### Task 1.1: Initialize Project Structure

**Files:**
- Create: `package.json` (root)
- Create: `backend/package.json`
- Create: `frontend/package.json`
- Create: `.gitignore`
- Create: `.env.example`

**Step 1: Create root package.json**

```json
{
  "name": "socsargen-hospital-system",
  "version": "1.0.0",
  "description": "Hospital website with appointment booking and hybrid chatbox",
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

**Step 2: Create .gitignore**

```
node_modules/
.env
.env.local
dist/
build/
*.log
.DS_Store
coverage/
```

**Step 3: Create .env.example**

```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/socsargen_hospital

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Server
PORT=5000
NODE_ENV=development
```

**Step 4: Run npm init**

Run: `npm init -y`

**Step 5: Install root dependencies**

Run: `npm install concurrently --save-dev`

**Step 6: Commit**

```bash
git init
git add .
git commit -m "chore: initialize project structure"
```

---

### Task 1.2: Initialize Backend

**Files:**
- Create: `backend/package.json`
- Create: `backend/src/index.js`
- Create: `backend/src/config/database.js`
- Create: `backend/.env`

**Step 1: Create backend directory and package.json**

```bash
mkdir -p backend/src/config backend/src/routes backend/src/controllers backend/src/models backend/src/middleware backend/src/utils
```

**Step 2: Initialize backend package.json**

```json
{
  "name": "socsargen-backend",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "pg": "^8.11.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.0.1",
    "socket.io": "^4.7.2",
    "openai": "^4.20.1",
    "nodemailer": "^6.9.7",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0"
  }
}
```

**Step 3: Create backend/src/index.js**

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Socsargen Hospital API is running' });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };
```

**Step 4: Create backend/src/config/database.js**

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

module.exports = pool;
```

**Step 5: Create backend/.env (copy from .env.example)**

**Step 6: Install backend dependencies**

Run: `cd backend && npm install`

**Step 7: Test backend runs**

Run: `cd backend && npm run dev`
Expected: "Server running on port 5000"

**Step 8: Commit**

```bash
git add .
git commit -m "feat: initialize backend with Express and Socket.io"
```

---

### Task 1.3: Initialize Frontend

**Files:**
- Create: `frontend/` (via Vite)
- Modify: `frontend/src/App.jsx`
- Create: `frontend/tailwind.config.js`

**Step 1: Create React app with Vite**

Run: `npm create vite@latest frontend -- --template react`

**Step 2: Install frontend dependencies**

```bash
cd frontend
npm install
npm install axios react-router-dom @tanstack/react-query socket.io-client react-hot-toast react-icons
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Step 3: Configure tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        hospital: {
          green: '#10b981',
          blue: '#0ea5e9',
          red: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

**Step 4: Update frontend/src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Accessibility: Focus states */
*:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Large readable fonts base */
html {
  font-size: 16px;
}

@media (min-width: 768px) {
  html {
    font-size: 18px;
  }
}

/* High contrast for accessibility */
body {
  @apply text-gray-900 bg-white;
}
```

**Step 5: Update frontend/src/App.jsx**

```jsx
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-600 text-white p-4">
        <h1 className="text-2xl font-bold">Socsargen Hospital</h1>
      </header>
      <main className="container mx-auto p-4">
        <p className="text-lg">Welcome to Socsargen Hospital System</p>
      </main>
    </div>
  )
}

export default App
```

**Step 6: Test frontend runs**

Run: `cd frontend && npm run dev`
Expected: Opens at http://localhost:5173

**Step 7: Commit**

```bash
git add .
git commit -m "feat: initialize frontend with React and Tailwind"
```

---

### Task 1.4: Setup PostgreSQL Database Schema

**Files:**
- Create: `backend/src/database/schema.sql`
- Create: `backend/src/database/seed.sql`

**Step 1: Create schema.sql**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin')),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors table (extends users)
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    bio TEXT,
    photo_url VARCHAR(500),
    consultation_fee DECIMAL(10, 2),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctor schedules
CREATE TABLE doctor_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_patients INTEGER DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News/Announcements table
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url VARCHAR(500),
    author_id UUID REFERENCES users(id),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consent logs (DPO Compliance)
CREATE TABLE consent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL,
    consented BOOLEAN NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages (for history)
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    sender VARCHAR(20) CHECK (sender IN ('user', 'bot', 'staff')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_news_published ON news(is_published, published_at);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Step 2: Create seed.sql**

```sql
-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@socsargen-hospital.com', '$2a$10$rIC/e2jPmLmvNPIgTqT7/.Hs3Ey9p3LnSYnPxPfXv5TgHKdKq5Vy2', 'Super', 'Admin', 'admin');

-- Insert sample services
INSERT INTO services (name, description, icon, display_order) VALUES
('Emergency Care', '24/7 emergency medical services', 'emergency', 1),
('Outpatient Services', 'Consultation and treatment without admission', 'outpatient', 2),
('Laboratory', 'Complete diagnostic laboratory services', 'lab', 3),
('Radiology', 'X-ray, CT scan, and imaging services', 'radiology', 4),
('Pharmacy', 'In-house pharmacy with complete medicines', 'pharmacy', 5),
('Surgery', 'Minor and major surgical procedures', 'surgery', 6);
```

**Step 3: Create database setup script backend/src/database/setup.js**

```javascript
require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Read and execute schema
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('Schema created successfully');

    // Read and execute seed
    const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    await pool.query(seed);
    console.log('Seed data inserted successfully');

    console.log('Database setup complete!');
  } catch (error) {
    console.error('Database setup failed:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase();
```

**Step 4: Add setup script to backend/package.json**

Add to scripts: `"db:setup": "node src/database/setup.js"`

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add PostgreSQL database schema and seed data"
```

---

## Phase 2: Authentication System

### Task 2.1: Create Auth Routes and Controllers

**Files:**
- Create: `backend/src/routes/auth.routes.js`
- Create: `backend/src/controllers/auth.controller.js`
- Create: `backend/src/middleware/auth.middleware.js`
- Create: `backend/src/utils/jwt.utils.js`

**Step 1: Create jwt.utils.js**

```javascript
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
```

**Step 2: Create auth.middleware.js**

```javascript
const { verifyToken } = require('../utils/jwt.utils');
const pool = require('../config/database');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1 AND is_active = true',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
```

**Step 3: Create auth.controller.js**

```javascript
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { generateToken } = require('../utils/jwt.utils');

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, consentPrivacy, consentMarketing } = req.body;

    // Check if user exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, 'patient')
       RETURNING id, email, first_name, last_name, role`,
      [email, hashedPassword, firstName, lastName, phone]
    );

    const user = result.rows[0];

    // Log consent (DPO Compliance)
    await pool.query(
      `INSERT INTO consent_logs (user_id, consent_type, consented, ip_address, user_agent) VALUES
       ($1, 'privacy_policy', $2, $3, $4),
       ($1, 'marketing', $5, $3, $4)`,
      [user.id, consentPrivacy, req.ip, req.headers['user-agent'], consentMarketing || false]
    );

    const token = generateToken(user);

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, phone, role, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

module.exports = { register, login, getProfile };
```

**Step 4: Create auth.routes.js**

```javascript
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Validation middleware
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('consentPrivacy').isBoolean().equals('true').withMessage('You must accept the privacy policy')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authenticate, getProfile);

module.exports = router;
```

**Step 5: Update backend/src/index.js to include auth routes**

Add after middleware setup:
```javascript
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);
```

**Step 6: Test auth endpoints**

Run: `cd backend && npm run dev`
Test with: `curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"password123","firstName":"Test","lastName":"User","consentPrivacy":true}'`

**Step 7: Commit**

```bash
git add .
git commit -m "feat: add authentication system with JWT"
```

---

## Phase 3: Core API Endpoints

### Task 3.1: Doctors API

**Files:**
- Create: `backend/src/routes/doctors.routes.js`
- Create: `backend/src/controllers/doctors.controller.js`

**Step 1: Create doctors.controller.js**

```javascript
const pool = require('../config/database');

const getAllDoctors = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.id, d.specialization, d.bio, d.photo_url, d.consultation_fee, d.is_available,
             u.first_name, u.last_name, u.email
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.is_available = true AND u.is_active = true
      ORDER BY u.last_name, u.first_name
    `);

    res.json(result.rows.map(doc => ({
      id: doc.id,
      firstName: doc.first_name,
      lastName: doc.last_name,
      specialization: doc.specialization,
      bio: doc.bio,
      photoUrl: doc.photo_url,
      consultationFee: doc.consultation_fee,
      isAvailable: doc.is_available
    })));
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

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
      return res.status(404).json({ error: 'Doctor not found' });
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
      specialization: doc.specialization,
      bio: doc.bio,
      photoUrl: doc.photo_url,
      consultationFee: doc.consultation_fee,
      isAvailable: doc.is_available,
      schedules: schedules.rows
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
};

const getDoctorSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    // Get doctor's schedule for the day of week
    const dayOfWeek = new Date(date).getDay();

    const scheduleResult = await pool.query(
      'SELECT * FROM doctor_schedules WHERE doctor_id = $1 AND day_of_week = $2',
      [id, dayOfWeek]
    );

    if (scheduleResult.rows.length === 0) {
      return res.json({ available: false, slots: [] });
    }

    // Get existing appointments for that date
    const appointmentsResult = await pool.query(
      `SELECT appointment_time FROM appointments
       WHERE doctor_id = $1 AND appointment_date = $2 AND status NOT IN ('cancelled', 'rejected')`,
      [id, date]
    );

    const bookedTimes = appointmentsResult.rows.map(a => a.appointment_time);
    const schedule = scheduleResult.rows[0];

    // Generate available slots (30 min intervals)
    const slots = [];
    let current = new Date(`2000-01-01T${schedule.start_time}`);
    const end = new Date(`2000-01-01T${schedule.end_time}`);

    while (current < end) {
      const timeStr = current.toTimeString().slice(0, 5);
      slots.push({
        time: timeStr,
        available: !bookedTimes.includes(timeStr + ':00')
      });
      current.setMinutes(current.getMinutes() + 30);
    }

    res.json({ available: true, slots });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
};

module.exports = { getAllDoctors, getDoctorById, getDoctorSchedule };
```

**Step 2: Create doctors.routes.js**

```javascript
const express = require('express');
const router = express.Router();
const { getAllDoctors, getDoctorById, getDoctorSchedule } = require('../controllers/doctors.controller');

router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/schedule', getDoctorSchedule);

module.exports = router;
```

**Step 3: Add route to index.js**

```javascript
const doctorsRoutes = require('./routes/doctors.routes');
app.use('/api/doctors', doctorsRoutes);
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add doctors API endpoints"
```

---

### Task 3.2: Appointments API

**Files:**
- Create: `backend/src/routes/appointments.routes.js`
- Create: `backend/src/controllers/appointments.controller.js`

**Step 1: Create appointments.controller.js**

```javascript
const pool = require('../config/database');

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
      return res.status(400).json({ error: 'This time slot is already booked' });
    }

    const result = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [patientId, doctorId, appointmentDate, appointmentTime, reason]
    );

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: result.rows[0]
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query;
    let params;

    if (userRole === 'patient') {
      query = `
        SELECT a.*, d.specialization, u.first_name as doctor_first_name, u.last_name as doctor_last_name
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users u ON d.user_id = u.id
        WHERE a.patient_id = $1
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
      `;
      params = [userId];
    } else if (userRole === 'doctor') {
      // Get doctor id first
      const doctorResult = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [userId]);
      if (doctorResult.rows.length === 0) {
        return res.status(404).json({ error: 'Doctor profile not found' });
      }

      query = `
        SELECT a.*, u.first_name as patient_first_name, u.last_name as patient_last_name, u.phone as patient_phone
        FROM appointments a
        JOIN users u ON a.patient_id = u.id
        WHERE a.doctor_id = $1
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
      `;
      params = [doctorResult.rows[0].id];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const result = await pool.query(
      `UPDATE appointments SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING *`,
      [status, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({
      message: 'Appointment updated',
      appointment: result.rows[0]
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE appointments SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND patient_id = $2 AND status = 'pending'
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Cannot cancel this appointment' });
    }

    res.json({ message: 'Appointment cancelled', appointment: result.rows[0] });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
};

// Admin: Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;

    let query = `
      SELECT a.*,
             p.first_name as patient_first_name, p.last_name as patient_last_name,
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

    query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAllAppointments
};
```

**Step 2: Create appointments.routes.js**

```javascript
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAllAppointments
} = require('../controllers/appointments.controller');

router.use(authenticate); // All routes require authentication

router.post('/', createAppointment);
router.get('/my', getMyAppointments);
router.patch('/:id/cancel', cancelAppointment);

// Admin/Doctor routes
router.get('/all', authorize('admin'), getAllAppointments);
router.patch('/:id/status', authorize('admin', 'doctor'), updateAppointmentStatus);

module.exports = router;
```

**Step 3: Add route to index.js**

```javascript
const appointmentsRoutes = require('./routes/appointments.routes');
app.use('/api/appointments', appointmentsRoutes);
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add appointments API endpoints"
```

---

### Task 3.3: News/Announcements API

**Files:**
- Create: `backend/src/routes/news.routes.js`
- Create: `backend/src/controllers/news.controller.js`

**Step 1: Create news.controller.js**

```javascript
const pool = require('../config/database');

const getPublishedNews = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const result = await pool.query(`
      SELECT n.id, n.title, n.slug, n.excerpt, n.image_url, n.published_at,
             u.first_name as author_first_name, u.last_name as author_last_name
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      WHERE n.is_published = true
      ORDER BY n.published_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

const getNewsById = async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(`
      SELECT n.*, u.first_name as author_first_name, u.last_name as author_last_name
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      WHERE n.slug = $1 AND n.is_published = true
    `, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get news by slug error:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
};

// Admin functions
const createNews = async (req, res) => {
  try {
    const { title, content, excerpt, imageUrl, isPublished } = req.body;
    const authorId = req.user.id;

    // Generate slug
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();

    const result = await pool.query(`
      INSERT INTO news (title, slug, content, excerpt, image_url, author_id, is_published, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [title, slug, content, excerpt, imageUrl, authorId, isPublished, isPublished ? new Date() : null]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
};

const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, imageUrl, isPublished } = req.body;

    const result = await pool.query(`
      UPDATE news SET
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        excerpt = COALESCE($3, excerpt),
        image_url = COALESCE($4, image_url),
        is_published = COALESCE($5, is_published),
        published_at = CASE WHEN $5 = true AND published_at IS NULL THEN CURRENT_TIMESTAMP ELSE published_at END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `, [title, content, excerpt, imageUrl, isPublished, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
};

const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM news WHERE id = $1', [id]);
    res.json({ message: 'Article deleted' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
};

const getAllNews = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT n.*, u.first_name as author_first_name, u.last_name as author_last_name
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      ORDER BY n.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get all news error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

module.exports = { getPublishedNews, getNewsById, createNews, updateNews, deleteNews, getAllNews };
```

**Step 2: Create news.routes.js**

```javascript
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  getPublishedNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getAllNews
} = require('../controllers/news.controller');

// Public routes
router.get('/', getPublishedNews);
router.get('/:slug', getNewsById);

// Admin routes
router.get('/admin/all', authenticate, authorize('admin'), getAllNews);
router.post('/', authenticate, authorize('admin'), createNews);
router.put('/:id', authenticate, authorize('admin'), updateNews);
router.delete('/:id', authenticate, authorize('admin'), deleteNews);

module.exports = router;
```

**Step 3: Add route to index.js**

```javascript
const newsRoutes = require('./routes/news.routes');
app.use('/api/news', newsRoutes);
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add news/announcements API endpoints"
```

---

### Task 3.4: Services API

**Files:**
- Create: `backend/src/routes/services.routes.js`
- Create: `backend/src/controllers/services.controller.js`

**Step 1: Create services.controller.js**

```javascript
const pool = require('../config/database');

const getAllServices = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM services WHERE is_active = true ORDER BY display_order'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

const createService = async (req, res) => {
  try {
    const { name, description, icon, displayOrder } = req.body;

    const result = await pool.query(
      'INSERT INTO services (name, description, icon, display_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, icon, displayOrder || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, displayOrder, isActive } = req.body;

    const result = await pool.query(`
      UPDATE services SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        icon = COALESCE($3, icon),
        display_order = COALESCE($4, display_order),
        is_active = COALESCE($5, is_active)
      WHERE id = $6
      RETURNING *
    `, [name, description, icon, displayOrder, isActive, id]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM services WHERE id = $1', [id]);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
};

module.exports = { getAllServices, createService, updateService, deleteService };
```

**Step 2: Create services.routes.js**

```javascript
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { getAllServices, createService, updateService, deleteService } = require('../controllers/services.controller');

router.get('/', getAllServices);
router.post('/', authenticate, authorize('admin'), createService);
router.put('/:id', authenticate, authorize('admin'), updateService);
router.delete('/:id', authenticate, authorize('admin'), deleteService);

module.exports = router;
```

**Step 3: Add route to index.js**

```javascript
const servicesRoutes = require('./routes/services.routes');
app.use('/api/services', servicesRoutes);
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add services API endpoints"
```

---

## Phase 4: Chat System

### Task 4.1: Hybrid Chat with Socket.io and OpenAI

**Files:**
- Create: `backend/src/services/chat.service.js`
- Create: `backend/src/services/openai.service.js`
- Modify: `backend/src/index.js`

**Step 1: Create openai.service.js**

```javascript
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `You are a helpful assistant for Socsargen Hospital. You can help with:
- General hospital information and services
- Appointment booking guidance
- Working hours and location
- Basic health FAQs

If the question is about:
- Specific medical conditions or diagnosis
- Urgent medical concerns
- Complaints or complex issues
- Billing or insurance

Reply with: "I'll connect you with our staff for better assistance." and set escalate to true.

Keep responses concise and friendly. If unsure, offer to connect to staff.`;

const getAIResponse = async (message, conversationHistory = []) => {
  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 300,
      temperature: 0.7
    });

    const aiMessage = response.choices[0].message.content;
    const shouldEscalate = aiMessage.toLowerCase().includes("connect you with our staff");

    return {
      message: aiMessage,
      escalate: shouldEscalate
    };
  } catch (error) {
    console.error('OpenAI error:', error);
    return {
      message: "I'm having trouble right now. Let me connect you with our staff.",
      escalate: true
    };
  }
};

module.exports = { getAIResponse };
```

**Step 2: Create chat.service.js**

```javascript
const pool = require('../config/database');
const { getAIResponse } = require('./openai.service');

const saveMessage = async (sessionId, userId, message, sender) => {
  try {
    await pool.query(
      'INSERT INTO chat_messages (session_id, user_id, message, sender) VALUES ($1, $2, $3, $4)',
      [sessionId, userId, message, sender]
    );
  } catch (error) {
    console.error('Save message error:', error);
  }
};

const getConversationHistory = async (sessionId) => {
  try {
    const result = await pool.query(
      'SELECT message, sender FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC LIMIT 20',
      [sessionId]
    );

    return result.rows.map(row => ({
      role: row.sender === 'user' ? 'user' : 'assistant',
      content: row.message
    }));
  } catch (error) {
    console.error('Get history error:', error);
    return [];
  }
};

const handleChatMessage = async (sessionId, userId, message) => {
  // Save user message
  await saveMessage(sessionId, userId, message, 'user');

  // Get conversation history
  const history = await getConversationHistory(sessionId);

  // Get AI response
  const aiResult = await getAIResponse(message, history);

  // Save AI response
  await saveMessage(sessionId, userId, aiResult.message, 'bot');

  return aiResult;
};

module.exports = { handleChatMessage, saveMessage, getConversationHistory };
```

**Step 3: Update backend/src/index.js with chat handlers**

Add to Socket.io section:
```javascript
const { handleChatMessage, saveMessage } = require('./services/chat.service');

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  let sessionId = socket.id;
  let userId = null;
  let isEscalated = false;

  socket.on('authenticate', (data) => {
    userId = data.userId;
    sessionId = data.sessionId || socket.id;
  });

  socket.on('chat_message', async (data) => {
    const { message } = data;

    if (isEscalated) {
      // Message goes to staff queue
      await saveMessage(sessionId, userId, message, 'user');
      io.to('staff').emit('escalated_message', {
        sessionId,
        userId,
        message,
        socketId: socket.id
      });
    } else {
      // AI handles it
      const result = await handleChatMessage(sessionId, userId, message);

      socket.emit('chat_response', {
        message: result.message,
        sender: 'bot',
        escalated: result.escalate
      });

      if (result.escalate) {
        isEscalated = true;
        socket.join('escalated_' + sessionId);
        io.to('staff').emit('new_escalation', { sessionId, userId, socketId: socket.id });
      }
    }
  });

  // Staff joins their room
  socket.on('join_staff', () => {
    socket.join('staff');
  });

  // Staff responds to escalated chat
  socket.on('staff_response', (data) => {
    const { targetSessionId, message } = data;
    saveMessage(targetSessionId, null, message, 'staff');
    io.to('escalated_' + targetSessionId).emit('chat_response', {
      message,
      sender: 'staff'
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add hybrid chat system with OpenAI and Socket.io"
```

---

## Phase 5: Frontend Implementation

### Task 5.1: Setup React Router and Layout

**Files:**
- Create: `frontend/src/components/Layout/`
- Create: `frontend/src/pages/`
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/main.jsx`

**Step 1: Create frontend/src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
```

**Step 2: Create frontend/src/components/Layout/Navbar.jsx**

```jsx
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'News', path: '/news' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            Socsargen Hospital
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="hover:text-primary-200 transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={`/${user.role}/dashboard`}
                  className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-primary-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="hover:text-primary-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block py-2 hover:text-primary-200"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to={`/${user.role}/dashboard`}
                  className="block py-2 hover:text-primary-200"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block py-2 hover:text-primary-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 hover:text-primary-200"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 hover:text-primary-200"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
```

**Step 3: Create frontend/src/components/Layout/Footer.jsx**

```jsx
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Socsargen Hospital</h3>
            <p className="text-gray-400">
              Providing quality healthcare services to the Socsargen region.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/services" className="hover:text-white">Services</Link></li>
              <li><Link to="/doctors" className="hover:text-white">Doctors</Link></li>
              <li><Link to="/news" className="hover:text-white">News</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>General Santos City</li>
              <li>Phone: (083) 123-4567</li>
              <li>Email: info@socsargen-hospital.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Socsargen Hospital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
```

**Step 4: Create frontend/src/components/Layout/MainLayout.jsx**

```jsx
import Navbar from './Navbar'
import Footer from './Footer'
import ChatWidget from '../Chat/ChatWidget'

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary-600 text-white p-2"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default MainLayout
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add frontend layout components"
```

---

### Task 5.2: Create Public Pages

**Files:**
- Create: `frontend/src/pages/Home.jsx`
- Create: `frontend/src/pages/Services.jsx`
- Create: `frontend/src/pages/Doctors.jsx`
- Create: `frontend/src/pages/Contact.jsx`
- Create: `frontend/src/pages/Privacy.jsx`

*(Due to length, showing Home.jsx as example - similar pattern for others)*

**Step 1: Create frontend/src/pages/Home.jsx**

```jsx
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'

const Home = () => {
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then(res => res.data)
  })

  const { data: news } = useQuery({
    queryKey: ['news'],
    queryFn: () => api.get('/news?limit=3').then(res => res.data)
  })

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to Socsargen Hospital
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Providing quality healthcare services to the Socsargen region with compassion and excellence.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
            >
              Book Appointment
            </Link>
            <Link
              to="/services"
              className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition"
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services?.slice(0, 6).map((service) => (
              <div key={service.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/services" className="text-primary-600 font-semibold hover:underline">
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Latest News</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {news?.map((article) => (
              <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {article.image_url && (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <Link
                    to={`/news/${article.slug}`}
                    className="text-primary-600 font-semibold hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
```

**Step 2: Create frontend/src/utils/api.js**

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add public pages and API utility"
```

---

### Task 5.3: Create Auth Pages (Login/Register)

**Files:**
- Create: `frontend/src/pages/Login.jsx`
- Create: `frontend/src/pages/Register.jsx`

*(Detailed implementation follows same pattern)*

**Step 1: Create frontend/src/pages/Login.jsx**

```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../utils/api'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/auth/login', formData)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      toast.success('Login successful!')
      navigate(`/${response.data.user.role}/dashboard`)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Login to Your Account</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add login and register pages"
```

---

### Task 5.4: Create Dashboard Pages

**Files:**
- Create: `frontend/src/pages/patient/Dashboard.jsx`
- Create: `frontend/src/pages/patient/BookAppointment.jsx`
- Create: `frontend/src/pages/doctor/Dashboard.jsx`
- Create: `frontend/src/pages/admin/Dashboard.jsx`

*(Due to length, showing patient dashboard structure)*

---

### Task 5.5: Create Chat Widget Component

**Files:**
- Create: `frontend/src/components/Chat/ChatWidget.jsx`
- Create: `frontend/src/hooks/useChat.js`

**Step 1: Create frontend/src/hooks/useChat.js**

```javascript
import { useState, useEffect, useCallback } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export const useChat = () => {
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [isEscalated, setIsEscalated] = useState(false)

  useEffect(() => {
    const newSocket = io(SOCKET_URL)
    setSocket(newSocket)

    newSocket.on('connect', () => {
      setIsConnected(true)
      const user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        newSocket.emit('authenticate', { userId: user.id })
      }
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
    })

    newSocket.on('chat_response', (data) => {
      setMessages(prev => [...prev, {
        text: data.message,
        sender: data.sender,
        timestamp: new Date()
      }])
      if (data.escalated) {
        setIsEscalated(true)
      }
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const sendMessage = useCallback((message) => {
    if (socket && message.trim()) {
      setMessages(prev => [...prev, {
        text: message,
        sender: 'user',
        timestamp: new Date()
      }])
      socket.emit('chat_message', { message })
    }
  }, [socket])

  return { messages, sendMessage, isConnected, isEscalated }
}
```

**Step 2: Create frontend/src/components/Chat/ChatWidget.jsx**

```jsx
import { useState } from 'react'
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi'
import { useChat } from '../../hooks/useChat'

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const { messages, sendMessage, isConnected, isEscalated } = useChat()

  const handleSend = (e) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage(input)
      setInput('')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-2xl w-80 md:w-96 flex flex-col" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Hospital Assistant</h3>
              <p className="text-sm opacity-80">
                {isEscalated ? 'Connected to staff' : 'AI-powered support'}
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat">
              <FiX size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500">
                <p>Hi! How can I help you today?</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : msg.sender === 'staff'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.sender === 'staff' && (
                    <span className="text-xs font-semibold block mb-1">Staff</span>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700"
                aria-label="Send message"
              >
                <FiSend size={20} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition"
          aria-label="Open chat"
        >
          <FiMessageCircle size={28} />
        </button>
      )}
    </div>
  )
}

export default ChatWidget
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add chat widget with Socket.io and AI support"
```

---

## Phase 6: Final Setup

### Task 6.1: Create App Routes

**Files:**
- Modify: `frontend/src/App.jsx`

**Step 1: Update App.jsx with all routes**

```jsx
import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'

// Public Pages
import Home from './pages/Home'
import Services from './pages/Services'
import Doctors from './pages/Doctors'
import DoctorDetail from './pages/DoctorDetail'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Login from './pages/Login'
import Register from './pages/Register'

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard'
import BookAppointment from './pages/patient/BookAppointment'
import MyAppointments from './pages/patient/MyAppointments'

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import ManageDoctors from './pages/admin/ManageDoctors'
import ManageAppointments from './pages/admin/ManageAppointments'
import ManageNews from './pages/admin/ManageNews'

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <MainLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={
          <ProtectedRoute roles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/patient/book" element={
          <ProtectedRoute roles={['patient']}>
            <BookAppointment />
          </ProtectedRoute>
        } />
        <Route path="/patient/appointments" element={
          <ProtectedRoute roles={['patient']}>
            <MyAppointments />
          </ProtectedRoute>
        } />

        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute roles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/doctors" element={
          <ProtectedRoute roles={['admin']}>
            <ManageDoctors />
          </ProtectedRoute>
        } />
        <Route path="/admin/appointments" element={
          <ProtectedRoute roles={['admin']}>
            <ManageAppointments />
          </ProtectedRoute>
        } />
        <Route path="/admin/news" element={
          <ProtectedRoute roles={['admin']}>
            <ManageNews />
          </ProtectedRoute>
        } />
      </Routes>
    </MainLayout>
  )
}

export default App
```

**Step 2: Create ProtectedRoute component**

```jsx
// frontend/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add all routes and protected route component"
```

---

### Task 6.2: Environment Setup and Deployment Prep

**Files:**
- Create: `frontend/.env.example`
- Update: `README.md`

**Step 1: Create frontend/.env.example**

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**Step 2: Create README.md**

```markdown
# Socsargen Hospital System

Hospital website with appointment booking and hybrid AI chatbox.

## Tech Stack
- Frontend: React.js + Tailwind CSS
- Backend: Node.js + Express.js
- Database: PostgreSQL
- Real-time: Socket.io
- AI: OpenAI API

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies: `npm run install:all`
3. Copy environment files:
   - `cp .env.example .env`
   - `cp frontend/.env.example frontend/.env`
4. Update `.env` with your database and API keys
5. Setup database: `cd backend && npm run db:setup`
6. Run development: `npm run dev`

### Default Admin Login
- Email: admin@socsargen-hospital.com
- Password: admin123

## License
Proprietary - Socsargen Hospital
```

**Step 3: Final commit**

```bash
git add .
git commit -m "docs: add README and environment setup"
```

---

## Checklist Summary

- [ ] Phase 1: Project Setup (Tasks 1.1-1.4)
- [ ] Phase 2: Authentication (Task 2.1)
- [ ] Phase 3: Core APIs (Tasks 3.1-3.4)
- [ ] Phase 4: Chat System (Task 4.1)
- [ ] Phase 5: Frontend (Tasks 5.1-5.5)
- [ ] Phase 6: Final Setup (Tasks 6.1-6.2)

---

*Implementation Plan for Socsargen Hospital System - Standard Package ₱95,000*
