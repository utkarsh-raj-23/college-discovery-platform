# CollegeHub — College Discovery Platform

A full-stack production-grade college discovery and decision platform inspired by Careers360 and CollegeDunia. Built as part of a product execution internship assignment.

## 🚀 Live Deployment

| Service | URL |
|---------|-----|
| 🌐 Frontend (Vercel) | https://college-discovery-platform-amber.vercel.app |
| ⚙️ Backend API (Railway) | https://college-discovery-platform-production-32e8.up.railway.app/api/colleges |
| 🗄️ Database | PostgreSQL hosted on Neon.tech |

---

## 🔗 Important Links

- **Live App** → https://college-discovery-platform-amber.vercel.app
- **GitHub Repo** → https://github.com/utkarsh-raj-23/college-discovery-platform
- **Backend Health Check** → https://college-discovery-platform-production-32e8.up.railway.app/health
- **API Colleges Endpoint** → https://college-discovery-platform-production-32e8.up.railway.app/api/colleges

## 🚀 Features

### 1. 🔍 College Listing + Search
- Browse 40+ colleges including all IITs and NITs
- Search by college name
- Filter by state, course, minimum and maximum fees
- Pagination with 9 colleges per page
- College cards show name, location, fees, rating and NIRF rank

### 2. 🏫 College Detail Page
- Full detail page for every college
- Overview with fees, rating, type, placement stats
- Tabs for Courses, Placements, Reviews and Q&A
- Save college to your profile (login required)

### 3. ⚖️ Compare Colleges
- Select up to 3 colleges using the + button on any card
- Side-by-side comparison table showing:
  - Location, Type, Established year
  - Annual Fees, Rating, NIRF Rank
  - Average Package, Max Package, Placement %
  - Total Students, Courses Offered, Top Recruiters

### 4. 🧠 Rank Predictor
- Enter your entrance exam and rank
- Supports JEE Advanced, JEE Main, BITSAT, VITEEE, MHT-CET
- Shows list of colleges you can get into with admission chance (High / Medium / Low)
- Click any result to go to that college detail page

### 5. 💬 Q&A Forum
- Ask questions about any college
- Answer questions from other students
- Expandable question cards with all answers
- Login required to post questions or answers

### 6. 🔐 Auth + Saved Colleges
- Register and login with email and password
- JWT based authentication
- Save colleges to your personal list
- View all saved colleges in one place

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL (Neon.tech cloud) |
| ORM | Prisma 5 |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| State Management | Zustand |
| Data Fetching | TanStack React Query + Axios |
| Deployment Frontend | Vercel |
| Deployment Backend | Railway |

---

## 🗄️ Database Schema

- **College** — name, location, fees, rating, type, NIRF rank, image
- **Course** — name, duration, fees, seats, exam, rank range
- **Placement** — year, avg package, max package, placement %, recruiters
- **Review** — rating, title, body, author
- **User** — name, email, hashed password
- **SavedCollege** — links users to saved colleges
- **Question** — title, body, linked to user and college
- **Answer** — body, linked to user and question

---

## 🏃 How to Run Locally

### Prerequisites
- Node.js v18+
- PostgreSQL installed locally
- Git

### 1. Clone the repository

```bash
git clone https://github.com/utkarsh-raj-23/college-discovery-platform.git
cd college-discovery-platform
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/collegedb"
JWT_SECRET="mysecretkey123"
PORT=5000

Run database migration and seed data:

```bash
npx prisma migrate dev --name init
npx prisma generate
npm run seed
```

Start the backend server:

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend/` folder:
Start the frontend:

```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 🔐 How to Login

> There is no pre-made admin account. You create your own account.

1. Go to `http://localhost:3000/login`
2. Click **"Sign up"** at the bottom
3. Fill in your name, email and password
4. Click **"Create Account"**
5. You are now logged in automatically

Use the same email and password to login next time.

**What you can do after logging in:**
- Save colleges to your personal list
- Ask questions in the Q&A forum
- Answer other people's questions
- View all your saved colleges at `/saved`

---

## 📁 Project Structure
college-discovery-platform/
├── backend/
│   ├── src/
│   │   ├── index.ts              — Express server entry point
│   │   ├── seed.ts               — Database seeding script
│   │   ├── lib/
│   │   │   └── prisma.ts         — Prisma client instance
│   │   ├── middleware/
│   │   │   └── auth.ts           — JWT authentication middleware
│   │   └── routes/
│   │       ├── colleges.ts       — College listing, detail, compare
│   │       ├── auth.ts           — Register, login, me
│   │       ├── predict.ts        — Rank predictor
│   │       ├── qa.ts             — Questions and answers
│   │       └── saved.ts          — Save and unsave colleges
│   ├── prisma/
│   │   └── schema.prisma         — Database schema
│   ├── .env                      — Environment variables (not in git)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                  — Home page
│   │   │   ├── colleges/
│   │   │   │   ├── page.tsx              — College listing page
│   │   │   │   └── [id]/page.tsx         — College detail page
│   │   │   ├── compare/page.tsx          — Compare colleges
│   │   │   ├── predict/page.tsx          — Rank predictor
│   │   │   ├── qa/page.tsx               — Q&A forum
│   │   │   ├── login/page.tsx            — Login and register
│   │   │   └── saved/page.tsx            — Saved colleges
│   │   ├── components/
│   │   │   ├── Navbar.tsx                — Top navigation bar
│   │   │   ├── CollegeCard.tsx           — College card component
│   │   │   └── Providers.tsx             — React Query provider
│   │   ├── lib/
│   │   │   └── api.ts                    — All API calls
│   │   └── store/
│   │       ├── authStore.ts              — Auth state (Zustand)
│   │       └── compareStore.ts           — Compare state (Zustand)
│   ├── .env.local                — Environment variables (not in git)
│   └── package.json
│
└── README.md

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/colleges` | List colleges with search and filters |
| GET | `/api/colleges/:id` | Get single college detail |
| GET | `/api/colleges/compare/multi?ids=1,2,3` | Compare multiple colleges |
| POST | `/api/predict` | Predict colleges by exam and rank |
| GET | `/api/qa` | Get all questions |
| POST | `/api/qa` | Post a question (auth required) |
| POST | `/api/qa/:id/answers` | Post an answer (auth required) |
| GET | `/api/saved` | Get saved colleges (auth required) |
| POST | `/api/saved/:id` | Save a college (auth required) |
| DELETE | `/api/saved/:id` | Unsave a college (auth required) |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

---

## 🤖 AI Tools Used

- **Claude (Anthropic)** — architecture planning, code generation, debugging
- **Cursor** — AI assisted code editor

---

## 👨‍💻 Built By

**Utkarsh Raj**
Built for Track B — College Discovery Platform internship assignment.
Deadline: 30th April 2026