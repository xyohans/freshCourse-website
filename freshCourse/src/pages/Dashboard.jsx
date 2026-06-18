import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/dashboard.module.css";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = 1; // replace with real user from auth context later

  useEffect(() => {
    fetch(`/api/dashboard?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setCourses(data.courses);
        setExamResults(data.examResults);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  function scoreClass(percent) {
    if (percent >= 70) return styles.scoreGood;
    if (percent >= 50) return styles.scoreMid;
    return styles.scoreLow;
  }

  if (loading) return <div className={styles.loadingState}>Loading dashboard...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Courses started</p>
          <p className={styles.statValue}>{stats.coursesStarted}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Courses completed</p>
          <p className={styles.statValue}>{stats.coursesCompleted}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Exams taken</p>
          <p className={styles.statValue}>{stats.examsTaken}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Average score</p>
          <p className={styles.statValue}>{stats.averageScore}%</p>
        </div>
      </div>

      <p className={styles.sectionTitle}>Continue learning</p>
      {courses.length === 0 && (
        <p className={styles.emptyState}>You haven't started any courses yet.</p>
      )}
      {courses.map(course => (
        <div key={course.id} className={styles.courseRow}>
          <p className={styles.courseTitle}>{course.title}</p>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${course.progress}%` }} />
          </div>
          <p className={styles.progressPercent}>{course.progress}%</p>
          <button className={styles.continueBtn} onClick={() => navigate(course.route_path)}>
            {course.progress === 100 ? "Review" : "Continue"}
          </button>
        </div>
      ))}

      <p className={styles.sectionTitleSpaced}>Recent exam scores</p>
      {examResults.length === 0 && (
        <p className={styles.emptyState}>You haven't taken any exams yet.</p>
      )}
      {examResults.map(result => (
        <div key={result.attemptId} className={styles.examRow}>
          <div>
            <p className={styles.examTitle}>
              {result.courseTitle} · {result.universityAbbr} · {result.year}
            </p>
            <p className={styles.examMeta}>{result.timeAgo}</p>
          </div>
          <div className={`${styles.scoreBadge} ${scoreClass(result.percent)}`}>
            {result.percent}%
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;