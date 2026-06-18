const express = require('express');
const router = express.Router();
const db = require('../db_connect');

// POST /api/progress/mark
// called when student marks a subtopic complete
router.post('/mark', async (req, res) => {
  try {
    const { userId, subtopicId, courseId } = req.body;

    if (!userId || !subtopicId || !courseId)
      return res.status(400).json({ error: 'userId, subtopicId and courseId are required' });

    // 1. mark the subtopic complete
    await db.query(`
      INSERT INTO user_subtopic_progress (user_id, subtopic_id, completed, completed_at)
      VALUES (?, ?, true, NOW())
      ON DUPLICATE KEY UPDATE completed = true, completed_at = NOW()
    `, [userId, subtopicId]);

    // 2. get total subtopics for this course
    const [[{ total }]] = await db.query(`
      SELECT COUNT(*) AS total FROM subtopics s
      JOIN chapters c ON s.chapter_id = c.id
      WHERE c.course_id = ?
    `, [courseId]);

    // 3. get completed subtopics for this course
    const [[{ completed }]] = await db.query(`
      SELECT COUNT(*) AS completed FROM user_subtopic_progress usp
      JOIN subtopics s ON usp.subtopic_id = s.id
      JOIN chapters c ON s.chapter_id = c.id
      WHERE usp.user_id = ? AND c.course_id = ? AND usp.completed = true
    `, [userId, courseId]);

    const status = completed === total ? 'completed' : 'in_progress';

    // 4. update or insert the course progress summary
    await db.query(`
      INSERT INTO user_course_progress (user_id, course_id, completed_subtopics, total_subtopics, status)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        completed_subtopics = ?,
        total_subtopics = ?,
        status = ?
    `, [userId, courseId, completed, total, status, completed, total, status]);

    res.json({ success: true, completed, total, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// GET /api/progress/:courseKey?userId=1
// used by CourseReader to know which subtopics are already completed
router.get('/:courseKey', async (req, res) => {
  try {
    const { userId } = req.query;
    const { courseKey } = req.params;

    const [rows] = await db.query(`
      SELECT usp.subtopic_id
      FROM user_subtopic_progress usp
      JOIN subtopics s ON usp.subtopic_id = s.id
      JOIN chapters c ON s.chapter_id = c.id
      JOIN courses co ON c.course_id = co.id
      WHERE co.route_key = ? AND usp.user_id = ? AND usp.completed = true
    `, [courseKey, userId]);

    res.json(rows.map(r => r.subtopic_id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

module.exports = router;