const express = require('express');
const router = express.Router();
const db = require('../db_connect');

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId)
      return res.status(400).json({ error: 'userId is required' });

    // 1. courses started and completed
    const [[courseStats]] = await db.query(`
      SELECT
        COUNT(*) AS coursesStarted,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS coursesCompleted
      FROM user_course_progress
      WHERE user_id = ?
    `, [userId]);

    // 2. exams taken and average score
    const [[examStats]] = await db.query(`
      SELECT
        COUNT(*) AS examsTaken,
        ROUND(AVG(ea.score / ep.total_questions * 100)) AS averageScore
      FROM exam_attempts ea
      JOIN exam_papers ep ON ea.exam_paper_id = ep.id
      WHERE ea.user_id = ? AND ea.submitted_at IS NOT NULL
    `, [userId]);

    // 3. courses in progress for "Continue learning"
    const [courses] = await db.query(`
      SELECT
        c.id, c.title, c.route_path,
        ROUND(ucp.completed_subtopics / ucp.total_subtopics * 100) AS progress
      FROM user_course_progress ucp
      JOIN courses c ON ucp.course_id = c.id
      WHERE ucp.user_id = ?
      ORDER BY ucp.last_accessed DESC
      LIMIT 5
    `, [userId]);

    // 4. recent exam results
    const [examResultsRaw] = await db.query(`
      SELECT
        ea.id AS attemptId,
        ea.score,
        ea.submitted_at,
        ep.total_questions,
        ep.year,
        c.title AS courseTitle,
        u.abbreviation AS universityAbbr
      FROM exam_attempts ea
      JOIN exam_papers ep        ON ea.exam_paper_id = ep.id
      JOIN university_courses uc ON ep.university_course_id = uc.id
      JOIN universities u        ON uc.university_id = u.id
      JOIN courses c             ON uc.course_id = c.id
      WHERE ea.user_id = ? AND ea.submitted_at IS NOT NULL
      ORDER BY ea.submitted_at DESC
      LIMIT 5
    `, [userId]);

    const examResults = examResultsRaw.map(r => ({
      attemptId: r.attemptId,
      courseTitle: r.courseTitle,
      universityAbbr: r.universityAbbr,
      year: r.year,
      percent: Math.round((r.score / r.total_questions) * 100),
      timeAgo: timeAgoFormat(r.submitted_at)
    }));

    res.json({
      stats: {
        coursesStarted: courseStats.coursesStarted || 0,
        coursesCompleted: courseStats.coursesCompleted || 0,
        examsTaken: examStats.examsTaken || 0,
        averageScore: examStats.averageScore || 0
      },
      courses,
      examResults
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

function timeAgoFormat(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const days = Math.floor(seconds / 86400);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week ago';
  return `${weeks} weeks ago`;
}

module.exports = router;