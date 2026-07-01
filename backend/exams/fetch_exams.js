const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// POST /api/exams/start
router.post('/start', async (req, res) => {
  try {
    const { userId, paperId, revealMode } = req.body;

    if (!userId || !paperId || !revealMode)
      return res.status(400).json({ error: 'userId, paperId and revealMode are required' });

    // Check for existing unfinished attempt
    const { data: existing, error: checkError } = await supabase
      .from('exam_attempts')
      .select('id')
      .eq('user_id', userId)
      .eq('exam_paper_id', paperId)
      .is('submitted_at', null);

    if (checkError) throw checkError;

    if (existing && existing.length > 0)
      return res.json({ attemptId: existing[0].id, resumed: true });

    const { data: newAttempt, error: insertError } = await supabase
      .from('exam_attempts')
      .insert([{ user_id: userId, exam_paper_id: paperId, reveal_mode: revealMode }])
      .select('id');

    if (insertError) throw insertError;

    res.json({ attemptId: newAttempt[0].id, resumed: false });
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

    const { data: attempt, error: attemptError } = await supabase
      .from('exam_attempts')
      .select('id, submitted_at')
      .eq('id', attemptId);

    if (attemptError) throw attemptError;

    if (!attempt || attempt.length === 0)
      return res.status(404).json({ error: 'Attempt not found' });

    if (attempt[0].submitted_at)
      return res.status(400).json({ error: 'Exam already submitted' });

    const formattedAnswers = answers.map(answer => ({
      attempt_id: attemptId,
      question_number: answer.question_number,
      selected_answer: answer.selected_answer,
      is_correct: answer.is_correct
    }));

    const { error: batchInsertError } = await supabase
      .from('attempt_answers')
      .insert(formattedAnswers);

    if (batchInsertError) throw batchInsertError;

    const { error: updateError } = await supabase
      .from('exam_attempts')
      .update({ score, submitted_at: new Date().toISOString() })
      .eq('id', attemptId);

    if (updateError) throw updateError;

    res.json({ success: true, score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit exam' });
  }
});

// GET /api/exams/attempts?userId=...
router.get('/attempts', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId)
      return res.status(400).json({ error: 'userId is required' });

    const { data, error } = await supabase
      .from('exam_attempts')
      .select(`
        id,
        exam_paper_id,
        score,
        reveal_mode,
        started_at,
        submitted_at,
        exam_papers ( total_questions )
      `)
      .eq('user_id', userId)
      .not('submitted_at', 'is', null)
      .order('started_at', { ascending: false });

    if (error) throw error;

    const formattedRows = data.map(row => ({
      id: row.id,
      exam_paper_id: row.exam_paper_id,
      score: row.score,
      reveal_mode: row.reveal_mode,
      started_at: row.started_at,
      submitted_at: row.submitted_at,
      total_questions: row.exam_papers?.total_questions || null
    }));

    res.json(formattedRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
});

// GET /api/exams/results/:attemptId
router.get('/results/:attemptId', async (req, res) => {
  try {
    const { attemptId } = req.params;

    const { data: attemptData, error: attemptError } = await supabase
      .from('exam_attempts')
      .select(`
        id, score, reveal_mode, started_at, submitted_at,
        exam_papers (
          total_questions, questions_url, year,
          university_courses (
            universities ( name ),
            courses ( title )
          )
        )
      `)
      .eq('id', attemptId);

    if (attemptError) throw attemptError;
    if (!attemptData || attemptData.length === 0)
      return res.status(404).json({ error: 'Attempt not found' });

    const { data: answers, error: answersError } = await supabase
      .from('attempt_answers')
      .select('question_number, selected_answer, is_correct')
      .eq('attempt_id', attemptId)
      .order('question_number', { ascending: true });

    if (answersError) throw answersError;

    const row = attemptData[0];

    res.json({
      id: row.id,
      score: row.score,
      reveal_mode: row.reveal_mode,
      started_at: row.started_at,
      submitted_at: row.submitted_at,
      total_questions: row.exam_papers?.total_questions,
      questions_url: row.exam_papers?.questions_url,
      year: row.exam_papers?.year,
      university_name: row.exam_papers?.university_courses?.universities?.name,
      course_title: row.exam_papers?.university_courses?.courses?.title,
      answers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// ─── DYNAMIC ROUTES LAST ────────────────────────────────────

// GET /api/exams/:courseKey
router.get('/:courseKey', async (req, res) => {
  try {
    const { courseKey } = req.params;

    // 1. Find the course id by route_key
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('route_key', courseKey)
      .single();

    if (courseError) throw courseError;

    // 2. Find university_courses rows for this course
    const { data: uniCourses, error: uniCoursesError } = await supabase
      .from('university_courses')
      .select('id, universities ( id, name, abbreviation )')
      .eq('course_id', course.id);

    if (uniCoursesError) throw uniCoursesError;

    const uniCourseIds = uniCourses.map(uc => uc.id);

    // 3. Get exam papers for those university_courses
    const { data, error } = await supabase
      .from('exam_papers')
      .select('id, year, total_questions, questions_url, university_course_id')
      .in('university_course_id', uniCourseIds)
      .order('year', { ascending: false });

    if (error) throw error;

    // 4. Map university info back onto each paper
    const uniCourseMap = {};
    uniCourses.forEach(uc => { uniCourseMap[uc.id] = uc.universities; });

    const formattedData = data.map(item => ({
      id: item.id,
      year: item.year,
      total_questions: item.total_questions,
      questions_url: item.questions_url,
      university_id: uniCourseMap[item.university_course_id]?.id,
      university_name: uniCourseMap[item.university_course_id]?.name,
      university_abbr: uniCourseMap[item.university_course_id]?.abbreviation
    }));

    res.json(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error occurred' });
  }
});

// GET /api/exams/:courseKey/:paperId
router.get('/:courseKey/:paperId', async (req, res) => {
  try {
    const { paperId, courseKey } = req.params;

    // 1. Get the exam paper
    const { data: paper, error: paperError } = await supabase
      .from('exam_papers')
      .select('id, year, total_questions, questions_url, university_course_id')
      .eq('id', paperId)
      .single();

    if (paperError) throw paperError;

    // 2. Get the university_courses row with university and course info
    const { data: uniCourse, error: uniCourseError } = await supabase
      .from('university_courses')
      .select(`
        id,
        universities ( name, abbreviation ),
        courses ( title, route_key )
      `)
      .eq('id', paper.university_course_id)
      .single();

    if (uniCourseError) throw uniCourseError;

    // 3. Verify the courseKey matches
    if (uniCourse.courses?.route_key !== courseKey)
      return res.status(404).json({ error: 'Exam paper not found' });

    res.json({
      id: paper.id,
      year: paper.year,
      total_questions: paper.total_questions,
      questions_url: paper.questions_url,
      university_name: uniCourse.universities?.name,
      university_abbr: uniCourse.universities?.abbreviation,
      course_title: uniCourse.courses?.title,
      course_key: uniCourse.courses?.route_key
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to fetch exam paper' });
  }
});

module.exports = router;