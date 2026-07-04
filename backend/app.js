require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const courses = require('./courses/fetch_courses');
const exams = require('./exams/fetch_exams');
const progress = require('./progress/progress');
const dashboard = require('./progress/dashboard');

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: allowedOrigins
}));
app.use(express.json());

app.use('/courses', courses);
app.use('/exams', exams);
app.use('/progress', progress);
app.use('/dashboard', dashboard);

// Centralized fallback error handler (in case a route forgets its own try/catch)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is live on port ${PORT}`);
});