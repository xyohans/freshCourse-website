const express = require('express');
const router = express.Router();
const supabase = require('../db_connect'); // Your configured Supabase client

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId)
      return res.status(400).json({ error: 'userId is required' });

    // Execute all 4 queries concurrently using Promise.all to decrease response times
    const [
      courseStatsResult,
      examStatsResult,
      coursesResult,
      examResultsRawResult
    ] = await Promise.all([
      
      // 1. courses started and completed
      supabase
        .from('user_course_progress')
        .select('status')
        .eq('user_id', userId),

      // 2. exams taken and score calculations
      supabase
        .from('exam_attempts')
        .select(`
          score,
          exam_papers ( total_questions )
        `)
        .eq('user_id', userId)
        .not('submitted_at', 'is', null),

      // 3. courses in progress for "Continue learning"
      supabase
        .from('user_course_progress')
        .select(`
          completed_subtopics,
          total_subtopics,
          courses ( id, title, route_path )
        `)
        .eq('user_id', userId)
        .order('last_accessed', { ascending: false })
        .limit(5),

      // 4. recent exam results
      supabase
        .from('exam_attempts')
        .select(`
          id, score, submitted_at,
          exam_papers (
            total_questions, year,
            university_courses (
              universities ( abbreviation ),
              courses ( title )
            )
          )
        `)
        .eq('user_id', userId)
        .not('submitted_at', 'is', null)
        .order('submitted_at', { ascending: false })
        .limit(5)
    ]);

    // Check for errors in any of the executions
    if (courseStatsResult.error) throw courseStatsResult.error;
    if (examStatsResult.error) throw examStatsResult.error;
    if (coursesResult.error) throw coursesResult.error;
    if (examResultsRawResult.error) throw examResultsRawResult.error;

    // --- PROCESS 1: Course Statistics ---
    const rawProgress = courseStatsResult.data;
    const coursesStarted = rawProgress.length;
    const coursesCompleted = rawProgress.filter(c => c.status === 'completed').length;

    // --- PROCESS 2: Exam Statistics ---
    const rawExams = examStatsResult.data;
    const examsTaken = rawExams.length;
    
    let totalScorePercentage = 0;
    rawExams.forEach(ea => {
      const totalQ = ea.exam_papers?.total_questions || 0;
      if (totalQ > 0) {
        totalScorePercentage += (ea.score / totalQ) * 100;
      }
    });
    const averageScore = examsTaken > 0 ? Math.round(totalScorePercentage / examsTaken) : 0;

    // --- PROCESS 3: Format Continue Learning Courses ---
    const courses = coursesResult.data.map(ucp => {
      const completed = ucp.completed_subtopics || 0;
      const total = ucp.total_subtopics || 0;
      return {
        id: ucp.courses?.id,
        title: ucp.courses?.title,
        route_path: ucp.courses?.route_path,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    });

    // --- PROCESS 4: Format Recent Exam Results ---
    const examResults = examResultsRawResult.data.map(r => {
      const totalQuestions = r.exam_papers?.total_questions || 0;
      return {
        attemptId: r.id,
        courseTitle: r.exam_papers?.university_courses?.courses?.title,
        universityAbbr: r.exam_papers?.university_courses?.universities?.abbreviation,
        year: r.exam_papers?.year,
        percent: totalQuestions > 0 ? Math.round((r.score / totalQuestions) * 100) : 0,
        timeAgo: timeAgoFormat(r.submitted_at)
      };
    });

    // --- Final Combined Output Response ---
    res.json({
      stats: {
        coursesStarted,
        coursesCompleted,
        examsTaken,
        averageScore
      },
      courses,
      examResults
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

function timeAgoFormat(date) {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const days = Math.floor(seconds / 86400);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week ago';
  return `${weeks} weeks ago`;
}

module.exports = router;