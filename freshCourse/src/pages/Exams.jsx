import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/exams.module.css';

function Exams() {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState({ natural: false, social: false });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  function handleFilters(e) {
    const { name, checked } = e.target;
    setFilter(prev => ({ ...prev, [name]: checked }));
  }

  const filteredCourses = courses.filter(course => {
    if (!filter.natural && !filter.social) return true;
    if (course.stream === 'both') return true;
    return filter[course.stream];
  });

  if (loading) return <div className={styles.loadingState}>Loading exams...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.pageTitle}>Exams</p>
        <p className={styles.pageSub}>Choose a course to see past exams from 40+ universities</p>
      </div>

      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>Stream:</span>
        <label className={`${styles.filterChip} ${filter.social ? styles.filterChipActive : ''}`}>
          <input type="checkbox" name="social" checked={filter.social} onChange={handleFilters} />
          Social
        </label>
        <label className={`${styles.filterChip} ${filter.natural ? styles.filterChipActive : ''}`}>
          <input type="checkbox" name="natural" checked={filter.natural} onChange={handleFilters} />
          Natural
        </label>
      </div>

      <div className={styles.grid}>
        {filteredCourses.map(course => {
          const tagClass =
            course.stream === 'natural' ? styles.tagNatural :
            course.stream === 'social' ? styles.tagSocial :
            styles.tagBoth;
          const tagLabel =
            course.stream === 'both' ? 'Natural & Social' :
            course.stream === 'natural' ? 'Natural' : 'Social';

          return (
            <div key={course.route_key} className={styles.card}>
              <span className={`${styles.streamTag} ${tagClass}`}>{tagLabel}</span>
              <p className={styles.courseTitle}>{course.title}</p>
              <button className={styles.viewBtn} onClick={() => navigate(`/exams/${course.route_key}`)}>
                View exams
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Exams;