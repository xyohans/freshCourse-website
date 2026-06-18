import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/exams.module.css";

function ExamRunner() {
  const { courseKey, paperId } = useParams();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const [revealMode, setRevealMode] = useState("on_submit");
  const [answers, setAnswers] = useState({});
  const [examStarted, setExamStarted] = useState(false);
  const [examDone, setExamDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/exams/${courseKey}/${paperId}`)
      .then(res => {
        if (!res.ok) throw new Error("Paper not found");
        return res.json();
      })
      .then(data => {
        setPaper(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load exam. Please try again.");
        setLoading(false);
      });
  }, [courseKey, paperId]);

  async function handleStart() {
    setStarting(true);
    setError(null);
    try {
      const res = await fetch('/api/exams/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, paperId: paper.id, revealMode })
      });

      if (!res.ok) throw new Error("Failed to start exam");
      const { attemptId } = await res.json();
      setAttemptId(attemptId);

      setContentLoading(true);
      const qRes = await fetch(paper.questions_url);
      if (!qRes.ok) throw new Error("Failed to fetch questions");
      const qs = await qRes.json();
      setQuestions(qs);
      setExamStarted(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setStarting(false);
      setContentLoading(false);
    }
  }

  function handleAnswer(questionNumber, selectedAnswer, correctAnswer) {
    if (revealMode === 'on_answer' && answers[questionNumber]) return;

    const isCorrect =
      selectedAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

    setAnswers(prev => ({
      ...prev,
      [questionNumber]: { selectedAnswer, isCorrect }
    }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const formattedAnswers = questions.map(q => ({
        question_number: q.number,
        selected_answer: answers[q.number]?.selectedAnswer || null,
        is_correct: answers[q.number]?.isCorrect || false
      }));

      const score = formattedAnswers.filter(a => a.is_correct).length;

      const res = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId, answers: formattedAnswers, score })
      });

      if (!res.ok) throw new Error("Failed to submit");
      setExamDone(true);
    } catch (err) {
      console.error(err);
      setError("Failed to submit exam. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleTryAgain() {
    setAnswers({});
    setAttemptId(null);
    setExamStarted(false);
    setExamDone(false);
    setError(null);
  }

  if (loading) return <div className={styles.loadingState}>Loading...</div>;
  if (error && !examStarted) return <p className={styles.errorText}>{error}</p>;

  if (!examStarted) {
    return (
      <div className={styles.runnerPage}>
        <button className={styles.backBtn} onClick={() => navigate(`/exams/${courseKey}`)}>
          ← Back
        </button>

        <p className={styles.runnerTitle}>{paper.course_title}</p>
        <p className={styles.runnerSub}>{paper.university_name} · {paper.year} · {paper.total_questions} questions</p>

        <p className={styles.revealLabel}>How do you want to see answers?</p>

        <div
          className={`${styles.revealOption} ${revealMode === 'on_answer' ? styles.revealOptionSelected : ''}`}
          onClick={() => setRevealMode('on_answer')}
        >
          <p className={styles.revealOptionTitle}>After each answer</p>
          <p className={styles.revealOptionSub}>See correct answer and explanation immediately after you answer</p>
        </div>

        <div
          className={`${styles.revealOption} ${revealMode === 'on_submit' ? styles.revealOptionSelected : ''}`}
          onClick={() => setRevealMode('on_submit')}
        >
          <p className={styles.revealOptionTitle}>After submitting</p>
          <p className={styles.revealOptionSub}>See all results at the end when you submit</p>
        </div>

        {error && <p className={styles.errorText}>{error}</p>}

        <button className={styles.primaryBtn} onClick={handleStart} disabled={starting}>
          {starting ? 'Starting...' : 'Start exam'}
        </button>
      </div>
    );
  }

  if (examDone) {
    const correct = questions.filter(q => answers[q.number]?.isCorrect).length;
    const pct = Math.round(correct / questions.length * 100);

    return (
      <div className={styles.runnerPage}>
        <p className={styles.resultScore}>{pct}%</p>
        <p className={styles.resultMeta}>{paper.university_name} · {paper.course_title} · {paper.year}</p>
        <p className={styles.resultSummary}>Correct: {correct} · Wrong: {questions.length - correct} · Total: {questions.length}</p>

        {questions.map(q => {
          const attempt = answers[q.number];
          const selected = attempt?.selectedAnswer;
          const isCorrect = attempt?.isCorrect;

          return (
            <div key={q.number} className={styles.questionBlock}>
              <p className={styles.questionText}><strong>{q.number}.</strong> {q.text}</p>

              {q.options.length > 0 && q.options.map((opt, i) => {
                const letter = ['A', 'B', 'C', 'D'][i];
                const isCorrectOpt = letter === q.answer;
                const isSelectedOpt = selected === letter;
                let cls = styles.optionReview;
                if (isCorrectOpt) cls += ` ${styles.optionCorrect}`;
                else if (isSelectedOpt) cls += ` ${styles.optionWrong}`;
                return (
                  <div key={letter} className={cls}>
                    {letter}. {opt}
                  </div>
                );
              })}

              {q.options.length === 0 && (
                <div className={styles.answerReview}>
                  <p className={styles.answerReviewLabel}>
                    Your answer: <span className={isCorrect ? styles.answerCorrectText : styles.answerWrongText}>{selected || 'No answer'}</span>
                  </p>
                  <p className={styles.answerReviewLabel}>
                    Correct answer: <span className={styles.answerCorrectText}>{q.answer}</span>
                  </p>
                </div>
              )}

              <div className={styles.feedbackBox}>
                <p className={styles.explanationText}><strong>Explanation:</strong> {q.explanation}</p>
              </div>
            </div>
          );
        })}

        <button className={styles.secondaryBtn} onClick={handleTryAgain}>Try again</button>
        <button className={styles.primaryBtn} onClick={() => navigate(`/exams/${courseKey}`)}>Back to exams</button>
      </div>
    );
  }

  if (contentLoading) return <div className={styles.loadingState}>Loading questions...</div>;

  const allAnswered = questions.every(q => answers[q.number] !== undefined);

  return (
    <div className={styles.runnerPage}>
      <p className={styles.runnerHeader}>{paper.university_name} · {paper.course_title} · {paper.year}</p>
      <p className={styles.answeredCount}>{Object.keys(answers).length} of {questions.length} answered</p>

      {questions.map(q => {
        const selected = answers[q.number]?.selectedAnswer;
        const isAnswered = selected !== undefined;
        const revealed = revealMode === 'on_answer' && isAnswered;

        return (
          <div key={q.number} className={styles.questionBlock}>
            <p className={styles.questionNumber}>Question {q.number} of {questions.length}</p>
            <p className={styles.questionText}>{q.text}</p>

            {q.options.length > 0 && q.options.map((opt, i) => {
              const letter = ['A', 'B', 'C', 'D'][i];
              const isCorrectOpt = letter === q.answer;
              const isSelectedOpt = selected === letter;

              let cls = styles.optionBtn;
              if (revealed) {
                if (isCorrectOpt) cls += ` ${styles.optionCorrect}`;
                else if (isSelectedOpt) cls += ` ${styles.optionWrong}`;
              } else if (isSelectedOpt) {
                cls += ` ${styles.optionSelected}`;
              }

              return (
                <button
                  key={letter}
                  className={cls}
                  disabled={revealed}
                  onClick={() => handleAnswer(q.number, letter, q.answer)}
                >
                  {letter}. {opt}
                </button>
              );
            })}

            {q.options.length === 0 && (
              <input
                type="text"
                className={styles.textInput}
                placeholder={
                  q.type === 'fill_blank' ? 'Fill in the blank' :
                  q.type === 'calculation' ? 'Enter your answer' :
                  'Write your answer'
                }
                value={answers[q.number]?.selectedAnswer || ''}
                onChange={e => handleAnswer(q.number, e.target.value, q.answer)}
                disabled={revealed}
              />
            )}

            {revealed && (
              <div className={styles.feedbackBox}>
                <p className={answers[q.number]?.isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}>
                  {answers[q.number]?.isCorrect ? 'Correct' : `Wrong — correct answer is ${q.answer}`}
                </p>
                <p className={styles.explanationText}><strong>Explanation:</strong> {q.explanation}</p>
              </div>
            )}
          </div>
        );
      })}

      {error && <p className={styles.errorText}>{error}</p>}

      <button className={styles.primaryBtn} onClick={handleSubmit} disabled={!allAnswered || submitting}>
        {submitting ? 'Submitting...' : 'Submit exam'}
      </button>
    </div>
  );
}

export default ExamRunner;