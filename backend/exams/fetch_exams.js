const express = require('express');
const router = express.Router();
const supabase = require('../db_connect'); // Your configured Supabase client

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

    // Insert new attempt and get back the generated ID
    const { data: newAttempt, error: insertError } = await supabase
      .from('exam_attempts')
      .insert([
        { user_id: userId, exam_paper_id: paperId, reveal_mode: revealMode }
      ])
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

    // Validate attempt status
    const { data: attempt, error: attemptError } = await supabase
      .from('exam_attempts')
      .select('id, submitted_at')
      .eq('id', attemptId);

    if (attemptError) throw attemptError;

    if (!attempt || attempt.length === 0)
      return res.status(404).json({ error: 'Attempt not found' });

    if (attempt[0].submitted_at)
      return res.status(400).json({ error: 'Exam already submitted' });

    // Format answers array for a highly optimized single batch insert
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

    // Update main exam attempt metadata with current timestamp
    const { error: updateError } = await supabase
      .from('exam_attempts')
      .update({ 
        score: score, 
        submitted_at: new Date().toISOString() // NOW() equivalent
      })
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
        exam_papers (
          total_questions
        )
      `)
      .eq('user_id', userId)
      .not('submitted_at', 'is', null)
      .order('started_at', { ascending: false });

    if (error) throw error;

    // Clean up structure to match original flat MySQL response array
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

    // Fetch the attempt info along with nested global relationships
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

    // Fetch attempt answers ordered cleanly
    const { data: answers, error: answersError } = await supabase
      .from('attempt_answers')
      .select('question_number, selected_answer, is_correct')
      .eq('attempt_id', attemptId)
      .order('question_number', { ascending: true });

    if (answersError) throw answersError;

    const row = attemptData[0];
    
    // Construct flat structure expected by frontend
    const result = {
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
    };

    res.json(result);
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
    const { data, error } = await supabase
      .from('exam_papers')
      .select(`
        id, year, total_questions, questions_url,
        university_courses!inner (
          universities ( id, name, abbreviation ),
          courses!inner ( route_key )
        )
      `)
      .eq('university_courses.courses.route_key', courseKey)
      .order('year', { ascending: false })
      .order('university_courses.universities.name', { ascending: true });

    if (error) throw error;

    // Flatten nested output mapping format
    const formattedData = data.map(item => ({
      id: item.id,
      year: item.year,
      total_questions: item.total_questions,
      questions_url: item.questions_url,
      university_id: item.university_courses?.universities?.id,
      university_name: item.university_courses?.universities?.name,
      university_abbr: item.university_courses?.universities?.abbreviation
    }));

    res.json(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error occurred" });
  }
});

// GET /api/exams/:courseKey/:paperId
router.get('/:courseKey/:paperId', async (req, res) => {
  try {
    const { paperId, courseKey } = req.params;

    const { data, error } = await supabase
      .from('exam_papers')
      .select(`
        id, year, total_questions, questions_url,
        university_courses!inner (
          universities ( name, abbreviation ),
          courses!inner ( title, route_key )
        )
      `)
      .eq('id', paperId)
      .eq('university_courses.courses.route_key', courseKey);

    if (error) throw error;
    if (!data || data.length === 0)
      return res.status(404).json({ error: 'Exam paper not found' });

    const item = data[0];
    
    res.json({
      id: item.id,
      year: item.year,
      total_questions: item.total_questions,
      questions_url: item.questions_url,
      university_name: item.university_courses?.universities?.name,
      university_abbr: item.university_courses?.universities?.abbreviation,
      course_title: item.university_courses?.courses?.title,
      course_key: item.university_courses?.courses?.route_key
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to fetch exam paper' });
  }
});

module.exports = router;