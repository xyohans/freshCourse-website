# FreshCourse

A full-stack educational platform built for Ethiopian university freshman students. EthioLearn brings together course content and real past exams from 40+ universities into one place, with progress tracking so students always know where they left off.

## Features

### Courses
- 15 freshman courses spanning both Natural and Social Science streams
- Each course organized into chapters and subtopics
- Markdown-based reading content fetched from cloud storage
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
- Email and password registration with OTP email verification
- Secure password hashing
- JWT-based authentication stored in httpOnly cookies

### Dashboard
- Overview of courses started and completed
- Exams taken and average score
- Quick-resume links to in-progress courses
- Recent exam score history

## Tech stack

**Frontend**
- React (Vite)
- React Router
- React Markdown

**Backend**
- Node.js / Express
- MySQL
- bcrypt for password hashing
- JSON Web Tokens for authentication
- Nodemailer for OTP email delivery

**Storage**
- Supabase Storage for course content (Markdown files), question banks (JSON), and PDF modules

## Project structure

## Database schema

The application uses MySQL with the following core tables:

| Table | Purpose |
|---|---|
| `users` | Registered students |
| `email_verifications` | OTP codes for email verification |
| `courses` | Course metadata (title, stream, route info) |
| `chapters` | Chapters within a course |
| `subtopics` | Individual readable topics, linked to Markdown content in cloud storage |
| `user_course_progress` | Per-user course completion summary |
| `user_subtopic_progress` | Per-user, per-subtopic completion tracking |
| `universities` | List of participating universities |
| `university_courses` | Junction table linking universities to courses |
| `exam_papers` | One row per university + course + year, linked to a JSON question bank |
| `exam_attempts` | Each time a student starts an exam |
| `attempt_answers` | Individual question answers within an attempt |

Course content (Markdown) and exam questions (JSON) are stored in Supabase Storage rather than the database, keeping the schema lightweight and content easy to update without redeployment.

## Getting started

### Prerequisites
- Node.js (v18+)
- MySQL
- A Supabase project (for file storage)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/freshCourse-website.git
cd freshCourse
```

2. Install dependencies for both client and server
```bash
cd server && npm install
cd ../client && npm install
```
3. Set up the database

Run the SQL schema (found in `/database/schema.sql`) against your MySQL instance to create all required tables.

4. Run the development servers

```bash
# in server/
npm run dev

# in client/ (separate terminal)
npm run dev
```

The client runs on `http://localhost:5173` and proxies API requests to the Express server on `http://localhost:5000`.

## API overview

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

## Roadmap

- [ ] Video lessons per subtopic
- [ ] Admin panel for content management
- [ ] AI-assisted grading for short answer questions
- [ ] Performance leaderboard per university
- [ ] Mobile-responsive overhaul

## License

This project is for educational purposes. License to be determined.

## Author

Built by Yohannis Tadesse, a software engineering student at Debre Markos University.
