const express = require('express');
const router = express.Router();
const db = require('../db_connect');


// POST /api/exams/start
router.post('/start', async (req, res) => {
  try {
    const { userId, paperId, revealMode } = req.body;

    if (!userId || !paperId || !revealMode)
      return res.status(400).json({ error: 'userId, paperId and revealMode are required' });

    // check for existing unfinished attempt
    const [existing] = await db.query(`
      SELECT id FROM exam_attempts
      WHERE user_id = ? AND exam_paper_id = ? AND submitted_at IS NULL
    `, [userId, paperId]);

    if (existing.length > 0)
      return res.json({ attemptId: existing[0].id, resumed: true });

    const [result] = await db.query(`
      INSERT INTO exam_attempts (user_id, exam_paper_id, reveal_mode)
      VALUES (?, ?, ?)
    `, [userId, paperId, revealMode]);

    res.json({ attemptId: result.insertId, resumed: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to start exam' });
  }
});

// POST /api/exams/submit
router.post('/submit', async (req, res) => {
  try {
    const { attemptId, answers, score } = req.body;

    if (!attemptId || !answers || score === undefined)
      return res.status(400).json({ error: 'attemptId, answers and score are required' });

    const [attempt] = await db.query(`
      SELECT id, submitted_at FROM exam_attempts WHERE id = ?
    `, [attemptId]);

    if (attempt.length === 0)
      return res.status(404).json({ error: 'Attempt not found' });

    if (attempt[0].submitted_at)
      return res.status(400).json({ error: 'Exam already submitted' });

    for (const answer of answers) {
      await db.query(`
        INSERT INTO attempt_answers
          (attempt_id, question_number, selected_answer, is_correct)
        VALUES (?, ?, ?, ?)
      `, [attemptId, answer.question_number, answer.selected_answer, answer.is_correct]);
    }

    await db.query(`
      UPDATE exam_attempts
      SET score = ?, submitted_at = NOW()
      WHERE id = ?
    `, [score, attemptId]);

    res.json({ success: true, score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit exam' });
  }
});

// GET /api/exams/attempts?userId=1
router.get('/attempts', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId)
      return res.status(400).json({ error: 'userId is required' });

    const [rows] = await db.query(`
      SELECT
        ea.id,
        ea.exam_paper_id,
        ea.score,
        ea.reveal_mode,
        ea.started_at,
        ea.submitted_at,
        ep.total_questions
      FROM exam_attempts ea
      JOIN exam_papers ep ON ea.exam_paper_id = ep.id
      WHERE ea.user_id = ? AND ea.submitted_at IS NOT NULL
      ORDER BY ea.started_at DESC
    `, [userId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
});

// GET /api/exams/results/:attemptId
router.get('/results/:attemptId', async (req, res) => {
  try {
    const [attempt] = await db.query(`
      SELECT
        ea.id,
        ea.score,
        ea.reveal_mode,
        ea.started_at,
        ea.submitted_at,
        ep.total_questions,
        ep.questions_url,
        u.name         AS university_name,
        c.title        AS course_title,
        ep.year
      FROM exam_attempts ea
      JOIN exam_papers ep        ON ea.exam_paper_id = ep.id
      JOIN university_courses uc ON ep.university_course_id = uc.id
      JOIN universities u        ON uc.university_id = u.id
      JOIN courses c             ON uc.course_id = c.id
      WHERE ea.id = ?
    `, [req.params.attemptId]);

    if (attempt.length === 0)
      return res.status(404).json({ error: 'Attempt not found' });

    const [answers] = await db.query(`
      SELECT question_number, selected_answer, is_correct
      FROM attempt_answers
      WHERE attempt_id = ?
      ORDER BY question_number ASC
    `, [req.params.attemptId]);

    res.json({ ...attempt[0], answers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// ─── DYNAMIC ROUTES LAST ────────────────────────────────────

// GET /api/exams/:courseKey
router.get('/:courseKey', async (req, res) => {
  const { courseKey } = req.params;
  try {
    const [data] = await db.query(`
      SELECT
        ep.id,
        ep.year,
        ep.total_questions,
        ep.questions_url,
        u.id           AS university_id,
        u.name         AS university_name,
        u.abbreviation AS university_abbr
      FROM exam_papers ep
      JOIN university_courses uc ON ep.university_course_id = uc.id
      JOIN universities u        ON uc.university_id = u.id
      JOIN courses c             ON uc.course_id = c.id
      WHERE c.route_key = ?
      ORDER BY ep.year DESC, u.name ASC
    `, [courseKey]);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error occurred" });
  }
});

// GET /api/exams/:courseKey/:paperId
router.get('/:courseKey/:paperId', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        ep.id,
        ep.year,
        ep.total_questions,
        ep.questions_url,
        u.name         AS university_name,
        u.abbreviation AS university_abbr,
        c.title        AS course_title,
        c.route_key    AS course_key
      FROM exam_papers ep
      JOIN university_courses uc ON ep.university_course_id = uc.id
      JOIN universities u        ON uc.university_id = u.id
      JOIN courses c             ON uc.course_id = c.id
      WHERE ep.id = ? AND c.route_key = ?
    `, [req.params.paperId, req.params.courseKey]);

    if (rows.length === 0)
      return res.status(404).json({ error: 'Exam paper not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch exam paper' });
  }
});

module.exports = router;