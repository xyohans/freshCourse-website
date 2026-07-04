const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const requireAuth = require('../auth/auth');

router.use(requireAuth);

// POST /progress/mark
router.post('/mark', async (req, res) => {
  try {
    const userId = req.user.id;
    const { subtopicId, courseId } = req.body;

    if (!subtopicId || !courseId)
      return res.status(400).json({ error: 'subtopicId and courseId are required' });

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

    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('id')
      .eq('course_id', courseId);

    if (chaptersError) throw chaptersError;

    const chapterIds = chapters.map(c => c.id);

    const { data: subtopics, error: subtopicsError } = await supabase
      .from('subtopics')
      .select('id')
      .in('chapter_id', chapterIds);

    if (subtopicsError) throw subtopicsError;

    const subtopicIds = subtopics.map(s => s.id);
    const total = subtopicIds.length;

    const { count: completed, error: completedError } = await supabase
      .from('user_subtopic_progress')
      .select('subtopic_id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true)
      .in('subtopic_id', subtopicIds);

    if (completedError) throw completedError;

    const status = completed === total ? 'completed' : 'in_progress';

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

// GET /progress/:courseKey
router.get('/:courseKey', async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseKey } = req.params;

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('route_key', courseKey)
      .single();

    if (courseError) throw courseError;

    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('id')
      .eq('course_id', course.id);

    if (chaptersError) throw chaptersError;

    const chapterIds = chapters.map(c => c.id);

    const { data: subtopics, error: subtopicsError } = await supabase
      .from('subtopics')
      .select('id')
      .in('chapter_id', chapterIds);

    if (subtopicsError) throw subtopicsError;

    const subtopicIds = subtopics.map(s => s.id);

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