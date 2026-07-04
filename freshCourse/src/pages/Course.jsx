import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/courses.module.css";
import { useUser } from "../context/AuthContext";
import { apiFetch } from "../lib/apiFetch";

function Course() {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState({ natural: false, social: false });
  const [loading, setLoading] = useState(true);
  const { user, userLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (userLoading) return;

    apiFetch("/courses")
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userLoading, user]);

  function handleFilters(e) {
    const { name, checked } = e.target;
    setFilter(prev => ({ ...prev, [name]: checked }));
  }

  function handleStart(course) {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate(course.route_path);
  }

  const filteredCourses = courses.filter(course => {
    if (!filter.natural && !filter.social) return true;
    if (course.stream === "both") return true;
    return filter[course.stream];
  });

  if (userLoading || loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.skeletonLine} style={{ width: "140px", height: 22 }} />
          <div className={styles.skeletonLine} style={{ width: "260px", marginTop: 6 }} />
        </div>
        <div className={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.skeletonLine} style={{ width: "60px", height: 18, borderRadius: 10 }} />
              <div className={styles.skeletonLine} style={{ width: "90%", height: 15, marginTop: 12 }} />
              <div className={styles.skeletonLine} style={{ width: "50%" }} />
              <div className={styles.skeletonLine} style={{ width: "100%", height: 34, marginTop: 14, borderRadius: 8 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.pageTitle}>Courses</p>
        <p className={styles.pageSub}>All freshman courses for Ethiopian university students</p>
      </div>

      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>Stream:</span>

        <label className={`${styles.filterChip} ${filter.social ? styles.filterChipActive : ""}`}>
          <input type="checkbox" name="social" checked={filter.social} onChange={handleFilters} />
          Social
        </label>

        <label className={`${styles.filterChip} ${filter.natural ? styles.filterChipActive : ""}`}>
          <input type="checkbox" name="natural" checked={filter.natural} onChange={handleFilters} />
          Natural
        </label>
      </div>

      <div className={styles.grid}>
        {filteredCourses.map(course => {
          const percent = course.progress || 0;
          const started = percent > 0;
          const tagClass =
            course.stream === "natural" ? styles.tagNatural :
              course.stream === "social" ? styles.tagSocial :
                styles.tagBoth;
          const tagLabel =
            course.stream === "both" ? "Natural & Social" :
              course.stream === "natural" ? "Natural" : "Social";

          return (
            <div key={course.route_key} className={styles.card}>
              <span className={`${styles.streamTag} ${tagClass}`}>{tagLabel}</span>
              <p className={styles.courseTitle}>{course.title}</p>
              <p className={styles.courseMeta}>{course.total_chapters} chapters</p>

              {started && (
                <>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{ width: `${percent}%` }} />
                  </div>
                  <p className={styles.progressLabel}>{percent}% complete</p>
                </>
              )}

              <button
                className={started ? styles.continueBtn : styles.startBtn}
                onClick={() => handleStart(course)}
              >
                {started ? "Continue" : "Start"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Course;