const express = require('express');
const router = express.Router();
// Import the Supabase client you configured earlier
const supabase = require('../db_connect'); 

// GET /api/courses?userId=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    // Use Supabase client to fetch courses and join user_course_progress
    // The inner syntax filter: user_course_progress(user_id) mimics your MySQL left join condition
    let query = supabase
      .from('courses')
      .select(`
        id, title, stream, route_path, route_key, total_chapters,
        user_course_progress!left (
          completed_subtopics,
          total_subtopics
        )
      `);

    // If a userId is passed, filter the joined table by that specific user
    if (userId) {
      query = query.eq('user_course_progress.user_id', userId);
    }

    const { data: courses, error } = await query;

    if (error) throw error;

    // Map through the rows to calculate the progress percentage (mimicking ROUND(...) AS progress)
    const formattedCourses = courses.map(course => {
      const ucp = course.user_course_progress?.[0] || null; // Left join might return an array or null
      
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

// GET /api/courses/:courseKey
// used by CourseReader for full nested course data
router.get('/:courseKey', async (req, res) => {
  try {
    const { courseKey } = req.params;

    // Supabase allows deeply nested relationship selection natively.
    // This entirely replaces the manual nested loops you had to do for MySQL!
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
      // Sort chapters and subtopics order indexes natively
      .order('chapter_number', { referencedTable: 'chapters', ascending: true })
      .order('order_index', { referencedTable: 'chapters.subtopics', ascending: true });

    if (error) throw error;

    // Since .eq() returns an array, check if we found the course
    if (!courses || courses.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Supabase returns the structure already cleanly nested, so we can just send it!
    res.json(courses[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

module.exports = router;