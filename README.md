# FreshCourse

A full-stack educational platform built for Ethiopian university freshman students. FreshCourse brings together course content and real past exams from 40+ universities into one place, with progress tracking so students always know where they left off.

## Features

### Courses
- 15 freshman courses spanning both Natural and Social Science streams
- Each course organized into chapters and subtopics
- Markdown-based reading content fetched from Supabase Storage
- Official module PDFs available for download
- Per-subtopic progress tracking with automatic course completion percentage
- Resume exactly where you left off

### Exams
- Real past exam papers from 40+ Ethiopian universities
- Filter exams by university and by year (including custom year ranges)
- Multiple question types supported: multiple choice, true/false, fill in the blank, short answer, and calculation
- Two reveal modes — see answers immediately after each question, or all at once after submitting
- Full score breakdown and answer review after every attempt
- Unlimited retakes per exam paper

### Accounts
- Email and password registration with Supabase Auth
- Email verification handled automatically
- Secure session management via Supabase JWTs
- Password reset via email link

### Dashboard
- Overview of courses started and completed
- Exams taken and average score
- Quick-resume links to in-progress courses
- Recent exam score history

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- React Markdown
- Supabase JS Client

**Backend**
- Node.js / Express
- Supabase (PostgreSQL) via supabase-js
- JWT verification via Supabase Auth middleware

**Database & Infrastructure**
- Supabase (PostgreSQL) — core database
- Supabase Auth — user authentication and session management
- Supabase Storage — course content (Markdown files), question banks (JSON), and PDF modules

## Database Schema

| Table | Purpose |
|---|---|
| `courses` | Course metadata (title, stream, route info) |
| `chapters` | Chapters within a course |
| `subtopics` | Individual readable topics, linked to Markdown content in Supabase Storage |
| `user_course_progress` | Per-user course completion summary |
| `user_subtopic_progress` | Per-user, per-subtopic completion tracking |
| `universities` | List of participating universities |
| `university_courses` | Junction table linking universities to courses |
| `exam_papers` | One row per university + course + year, linked to a JSON question bank in Storage |
| `exam_attempts` | Each time a student starts an exam |
| `attempt_answers` | Individual question answers within an attempt |

User accounts and email verification are handled entirely by Supabase Auth — no separate `users` or `email_verifications` tables needed.

Course content (Markdown) and exam questions (JSON) are stored in Supabase Storage rather than the database, keeping the schema lightweight and content easy to update without redeployment.

## Project Structure

```
freshCourse/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state via useUser() hook
│   │   ├── lib/
│   │   │   ├── supabaseClient.js    # Supabase client instance
│   │   │   └── apiFetch.js          # Authenticated fetch utility
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx   # Route guard for logged-in pages
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── ForgotPassword.jsx
│   │       ├── ResetPassword.jsx
│   │       ├── Profile.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Courses.jsx
│   │       └── Exams.jsx
└── server/                  # Node.js / Express backend
    ├── middleware/
    │   └── auth.js          # Verifies Supabase JWT on protected routes
    └── routes/
        ├── courses.js
        ├── progress.js
        ├── exams.js
        └── dashboard.js
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- A Supabase project (database, auth, and storage)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/freshCourse.git
cd freshCourse
```

2. Install dependencies for both client and server
```bash
cd server && npm install
cd ../client && npm install
```

3. Set up environment variables

Create a `.env` file in `server/`:
```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=http://localhost:5173
PORT=5000
```

Create a `.env` file in `client/`:
```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:5000
```

4. Set up the database

Run the SQL schema (found in `/database/schema.sql`) against your Supabase project to create all required tables.

5. Configure Supabase Auth redirect URLs

In your Supabase dashboard → Authentication → URL Configuration, add:
```
http://localhost:5173/reset-password
```

6. Run the development servers

```bash
# in server/
npm run dev

# in client/ (separate terminal)
npm run dev
```

The client runs on `http://localhost:5173` and the Express server on `http://localhost:5000`.

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses` | List all courses with progress for the logged-in user |
| GET | `/api/courses/:courseKey` | Full course structure with chapters and subtopics |
| POST | `/api/progress/mark` | Mark a subtopic as completed |
| GET | `/api/progress/:courseKey` | Get completed subtopics for a course |
| GET | `/api/exams/:courseKey` | List all exam papers for a course |
| GET | `/api/exams/:courseKey/:paperId` | Get a specific exam paper's metadata |
| POST | `/api/exams/start` | Start a new exam attempt |
| POST | `/api/exams/submit` | Submit answers and save the score |
| GET | `/api/dashboard` | Aggregated stats for the dashboard page |

All endpoints except auth routes require a valid Supabase session token passed as `Authorization: Bearer <token>`.

## Roadmap

- [ ] Video lessons per subtopic
- [ ] Admin panel for content management
- [ ] AI-assisted grading for short answer questions
- [ ] Performance leaderboard per university
- [ ] Mobile-responsive overhaul

## License

MIT License

Copyright (c) 2025 Yohannis Abrham

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Author

Built by Yohannis Abrham, a software engineering student at Debre Markos University.
