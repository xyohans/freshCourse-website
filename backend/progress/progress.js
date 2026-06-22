const express = require('express');
const router = express.Router();
const supabase = require('../db_connect'); // Your configured Supabase client

// POST /api/progress/mark
// called when student marks a subtopic complete
router.post('/mark', async (req, res) => {
  try {
    const { userId, subtopicId, courseId } = req.body;

    if (!userId || !subtopicId || !courseId)
      return res.status(400).json({ error: 'userId, subtopicId and courseId are required' });

    // 1. Mark the subtopic complete (Postgres Upsert using unique constraints)
    const { error: upsertSubtopicError } = await supabase
      .from('user_subtopic_progress')
      .upsert({
        user_id: userId,
        subtopic_id: subtopicId,
        completed: true,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,subtopic_id' // Requires unique constraint on these columns
      });

    if (upsertSubtopicError) throw upsertSubtopicError;

    // Execute counts concurrently to minimize execution blockages
    const [totalRes, completedRes] = await Promise.all([
      // 2. Get total subtopics for this course
      supabase
        .from('subtopics')
        .select(`
          id,
          chapters!inner ( course_id )
        `, { count: 'exact', head: true })
        .eq('chapters.course_id', courseId),

      // 3. Get completed subtopics for this course by this user
      supabase
        .from('user_subtopic_progress')
        .select(`
          subtopic_id,
          subtopics!inner (
            chapters!inner ( course_id )
          )
        `, { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('completed', true)
        .eq('subtopics.chapters.course_id', courseId)
    ]);

    if (totalRes.error) throw totalRes.error;
    if (completedRes.error) throw completedRes.error;

    const total = totalRes.count || 0;
    const completed = completedRes.count || 0;
    const status = completed === total ? 'completed' : 'in_progress';

    // 4. Update or insert the course progress summary (Upsert pattern)
    const { error: upsertCourseError } = await supabase
      .from('user_course_progress')
      .upsert({
        user_id: userId,
        course_id: courseId,
        completed_subtopics: completed,
        total_subtopics: total,
        status: status,
        last_accessed: new Date().toISOString()
      }, {
        onConflict: 'user_id,course_id' // Requires unique constraint on these columns
      });

    if (upsertCourseError) throw upsertCourseError;

    res.json({ success: true, completed, total, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// GET /api/progress/:courseKey?userId=...
// used by CourseReader to know which subtopics are already completed
router.get('/:courseKey', async (req, res) => {
  try {
    const { userId } = req.query;
    const { courseKey } = req.params;

    if (!userId)
      return res.status(400).json({ error: 'userId is required' });

    // Join paths downward using !inner filters to target our criteria
    const { data, error } = await supabase
      .from('user_subtopic_progress')
      .select(`
        subtopic_id,
        subtopics!inner (
          chapters!inner (
            courses!inner ( route_key )
          )
        )
      `)
      .eq('user_id', userId)
      .eq('completed', true)
      .eq('subtopics.chapters.courses.route_key', courseKey);

    if (error) throw error;

    // Map the object array back to a flat array of IDs matching your old output
    const subtopicIds = data.map(r => r.subtopic_id);

    res.json(subtopicIds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

module.exports = router;