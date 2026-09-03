# AntiHack - Enterprise Cyber Fraud Prevention & Threat Detection Platform

![AntiHack Shield](https://img.shields.io/badge/Security-Enterprise%20Grade-blue)
![Python](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11+-009688)
![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TypeScript-61DAFB)
![TailwindCSS](https://img.shields.io/badge/Style-Tailwind%20CSS%20v3.4-38B2AC)

**AntiHack** is an AI-powered cybersecurity platform designed to protect individuals and organizations from cyber fraud, detect phishing attempts across multi-channel messages (SMS, WhatsApp, Telegram, Email, URLs), verify file payloads, streamline cybercrime reporting, and enhance digital safety awareness.

---

## 🚀 Key Features (Full Platform Roadmap)

1. **AI Scam Detector**: Multi-channel payload analysis (SMS, Email, WhatsApp, Telegram, URL) powered by NLP & threat heuristics.
2. **Multi-Engine URL Scanner**: Real-time URL threat detection incorporating Google Safe Browsing, VirusTotal API, SSL validation, and domain age checks.
3. **Deep File Scanner**: SHA-256 fingerprinting & malware analysis for PDFs, APKs, images, and executables via VirusTotal.
4. **Cybercrime Reporting Module**: Streamlined complaint filing with evidence upload, bank & transaction ID tracking, and real-time status timelines.
5. **AI Cybersecurity Assistant**: 24/7 interactive assistant for threat mitigation, scam explanation, and step-by-step incident recovery.
6. **Cyber Awareness Hub**: Real-time cybersecurity news feeds, government advisories, trending scam alerts, and educational modules.
7. **Emergency Cyber SOS**: Instant access to country-specific cybercrime helplines, bank block numbers, and emergency panic protocols.
8. **Admin Command Center**: Complete user, complaint, scam report, and content management dashboard with analytical visualizations.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS, Glassmorphism design system, Dark/Light modes
- **State & Data Fetching**: React Query (TanStack Query), Axios
- **Form Validation**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons & Charts**: Heroicons, Lucide-React, Recharts

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL (SQLAlchemy ORM + Alembic migrations)
- **Security**: JWT Authentication, Passlib (bcrypt), Rate Limiting (SlowAPI), Helmet-equivalent security headers, CORS protection
- **Validation**: Pydantic V2
- **Server**: Uvicorn

---

## 📁 Directory Structure

```
AntiHack/
├── backend/            # FastAPI Python Clean Architecture Backend
│   ├── app/
│   │   ├── config/     # Settings & Environment variables
│   │   ├── database/   # SQLAlchemy session & Base model
│   │   ├── models/     # Database ORM entities
│   │   ├── schemas/    # Pydantic validation schemas
│   │   ├── routers/    # API endpoint controllers
│   │   ├── services/   # Business logic layer
│   │   ├── repositories/# Data access abstraction layer
│   │   ├── utils/      # Security, JWT, Password hashing, Logger
│   │   └── middleware/ # CORS, Security Headers, Exception Handlers
│   ├── alembic/        # Database migration scripts
│   └── requirements.txt
├── frontend/           # Vite + React + TypeScript + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components (Buttons, Inputs, Cards)
│   │   ├── context/    # Auth & Theme context providers
│   │   ├── pages/      # Route view pages (Login, Register, Dashboard)
│   │   ├── services/   # Axios API client modules
│   │   └── types/      # TypeScript interfaces & types
├── docs/               # Architecture diagrams & API documentation
├── database/           # SQL seeds & schema dumps
├── uploads/            # Secure file upload directory
└── scripts/            # Setup and deployment helper scripts
```

---

## ⚡ Quick Start (Phase 1)

### Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation: Navigate to `http://localhost:8000/docs` (Swagger UI) or `http://localhost:8000/redoc`.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔐 Security Standards
- Password Hashing with Salt using Bcrypt.
- OAuth2 Bearer Tokens (JWT) with configurable expiration & claims.
- Role-based Access Control (RBAC: `user`, `admin`).
- Security Headers (X-Frame-Options, X-Content-Type-Options, CSP, HSTS).
- SQL Injection protection via SQLAlchemy parameterization.
