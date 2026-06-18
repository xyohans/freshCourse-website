const express = require('express');
const router = express.Router();
const db = require('../db_connect');

// GET /api/courses?userId=1
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    const [rows] = await db.query(`
      SELECT 
        c.id, c.title, c.stream, c.route_path, c.route_key, c.total_chapters,
        ucp.completed_subtopics,
        ucp.total_subtopics,
        ROUND(ucp.completed_subtopics / ucp.total_subtopics * 100) AS progress
      FROM courses c
      LEFT JOIN user_course_progress ucp 
        ON ucp.course_id = c.id AND ucp.user_id = ?
    `, [userId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/courses/:courseKey
// used by CourseReader for full nested course data
router.get('/:courseKey', async (req, res) => {
  try {
    const { courseKey } = req.params;

    const [rows] = await db.query(`
      SELECT 
        c.id,
        c.title,
        c.pdf_url,
        ch.id AS chapter_id,
        ch.chapter_number,
        ch.title AS chapter_title, 
        s.id AS subtopic_id,
        s.title AS subtopic_title,
        s.content_url,
        s.order_index
      FROM courses c
      JOIN chapters ch ON ch.course_id = c.id
      JOIN subtopics s ON s.chapter_id = ch.id
      WHERE c.route_key = ?
      ORDER BY ch.chapter_number, s.order_index
    `, [courseKey]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = {
      id: rows[0].id,
      title: rows[0].title,
      pdf_url: rows[0].pdf_url,
      chapters: []
    };

    const chapterMap = {};

    rows.forEach(row => {
      if (!chapterMap[row.chapter_id]) {
        chapterMap[row.chapter_id] = {
          id: row.chapter_id,
          chapter_number: row.chapter_number,
          title: row.chapter_title,
          subtopics: []
        };
        course.chapters.push(chapterMap[row.chapter_id]);
      }
      chapterMap[row.chapter_id].subtopics.push({
        id: row.subtopic_id,
        title: row.subtopic_title,
        content_url: row.content_url,
        order_index: row.order_index
      });
    });

    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});
module.exports = router;