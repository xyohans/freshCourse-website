const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// POST /api/progress/mark
router.post('/mark', async (req, res) => {
  try {
    const { userId, subtopicId, courseId } = req.body;

    if (!userId || !subtopicId || !courseId)
      return res.status(400).json({ error: 'userId, subtopicId and courseId are required' });

    // 1. Mark subtopic complete
    const { error: upsertSubtopicError } = await supabase
      .from('user_subtopic_progress')
      .upsert({
        user_id: userId,
        subtopic_id: subtopicId,
        completed: true,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,subtopic_id'
      });

    if (upsertSubtopicError) throw upsertSubtopicError;

    // 2. Get chapter IDs for this course
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('id')
      .eq('course_id', courseId);

    if (chaptersError) throw chaptersError;

    const chapterIds = chapters.map(c => c.id);

    // 3. Get all subtopic IDs in this course
    const { data: subtopics, error: subtopicsError } = await supabase
      .from('subtopics')
      .select('id')
      .in('chapter_id', chapterIds);

    if (subtopicsError) throw subtopicsError;

    const subtopicIds = subtopics.map(s => s.id);
    const total = subtopicIds.length;

    // 4. Count how many this user completed
    const { count: completed, error: completedError } = await supabase
      .from('user_subtopic_progress')
      .select('subtopic_id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true)
      .in('subtopic_id', subtopicIds);

    if (completedError) throw completedError;

    const status = completed === total ? 'completed' : 'in_progress';

    // 5. Upsert course progress summary
    const { error: upsertCourseError } = await supabase
      .from('user_course_progress')
      .upsert({
        user_id: userId,
        course_id: courseId,
        completed_subtopics: completed,
        total_subtopics: total,
        status,
        last_accessed: new Date().toISOString()
      }, {
        onConflict: 'user_id,course_id'
      });

    if (upsertCourseError) throw upsertCourseError;

    res.json({ success: true, completed, total, status });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// GET /api/progress/:courseKey?userId=...
router.get('/:courseKey', async (req, res) => {
  try {
    const { userId } = req.query;
    const { courseKey } = req.params;

    if (!userId)
      return res.status(400).json({ error: 'userId is required' });

    // 1. Find the course by route_key
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('route_key', courseKey)
      .single();

    if (courseError) throw courseError;

    // 2. Get chapter IDs for this course
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('id')
      .eq('course_id', course.id);

    if (chaptersError) throw chaptersError;

    const chapterIds = chapters.map(c => c.id);

    // 3. Get subtopic IDs in this course
    const { data: subtopics, error: subtopicsError } = await supabase
      .from('subtopics')
      .select('id')
      .in('chapter_id', chapterIds);

    if (subtopicsError) throw subtopicsError;

    const subtopicIds = subtopics.map(s => s.id);

    // 4. Get completed ones for this user
    const { data, error } = await supabase
      .from('user_subtopic_progress')
      .select('subtopic_id')
      .eq('user_id', userId)
      .eq('completed', true)
      .in('subtopic_id', subtopicIds);

    if (error) throw error;

    res.json(data.map(r => r.subtopic_id));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

module.exports = router;