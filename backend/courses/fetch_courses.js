const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const requireAuth = require('../auth/auth');

// GET /courses  — public, but personalizes progress if a valid token is sent
router.get('/', async (req, res) => {
  try {
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    let query = supabase
      .from('courses')
      .select(`
        id, title, stream, route_path, route_key, total_chapters,
        user_course_progress!left (
          completed_subtopics,
          total_subtopics
        )
      `);

    if (userId) {
      query = query.eq('user_course_progress.user_id', userId);
    }

    const { data: courses, error } = await query;
    if (error) throw error;

    const formattedCourses = courses.map(course => {
      const ucp = course.user_course_progress?.[0] || null;
      let completed_subtopics = ucp ? ucp.completed_subtopics : null;
      let total_subtopics = ucp ? ucp.total_subtopics : null;
      let progress = null;

      if (completed_subtopics !== null && total_subtopics > 0) {
        progress = Math.round((completed_subtopics / total_subtopics) * 100);
      }

      return {
        id: course.id,
        title: course.title,
        stream: course.stream,
        route_path: course.route_path,
        route_key: course.route_key,
        total_chapters: course.total_chapters,
        completed_subtopics,
        total_subtopics,
        progress
      };
    });

    res.json(formattedCourses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /courses/:courseKey — public course content
router.get('/:courseKey', async (req, res) => {
  try {
    const { courseKey } = req.params;

    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        pdf_url,
        chapters (
          id,
          chapter_number,
          title,
          subtopics (
            id,
            title,
            content_url,
            order_index
          )
        )
      `)
      .eq('route_key', courseKey)
      .order('chapter_number', { referencedTable: 'chapters', ascending: true })
      .order('order_index', { referencedTable: 'chapters.subtopics', ascending: true });

    if (error) throw error;

    if (!courses || courses.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(courses[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

module.exports = router;