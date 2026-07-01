import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/exams.module.css";

function ExamViewer() {
  const { courseKey } = useParams();
  const navigate = useNavigate();

  const [papers, setPapers] = useState([]);
  const [selectedUni, setSelectedUni] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/exams/${courseKey}`)
      .then(res => res.json())
      .then(data => {
        setPapers(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [courseKey]);

  const universities = [...new Map(
    papers.map(p => [p.university_id, { id: p.university_id, name: p.university_name, abbr: p.university_abbr }])
  ).values()];

  const years = [...new Set(papers.map(p => p.year))].sort((a, b) => b - a);

  const filtered = papers.filter(p => {
    const uniMatch = selectedUni === 'all' || p.university_id === selectedUni;
    const yearMatch = selectedYear === 'all' || p.year === selectedYear;
    return uniMatch && yearMatch;
  });

 if (loading) {
  return (
    <div className={styles.viewerContainer}>
      <div className={styles.viewerSidebar}>
        <div className={styles.skeletonLine} style={{ width: "70px", height: 16 }} />
        <div className={styles.skeletonLine} style={{ width: "90px", height: 14, marginTop: 20 }} />
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.skeletonLine} style={{ width: "100%", height: 30, borderRadius: 8, marginTop: 8 }} />
        ))}
      </div>
      <div className={styles.viewerMain}>
        <div className={styles.skeletonLine} style={{ width: "120px" }} />
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.examCard}>
            <div>
              <div className={styles.skeletonLine} style={{ width: "220px", height: 15 }} />
              <div className={styles.skeletonLine} style={{ width: "140px" }} />
            </div>
            <div className={styles.skeletonLine} style={{ width: "90px", height: 32, borderRadius: 8 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

  return (
    <div className={styles.viewerContainer}>
      <div className={styles.viewerSidebar}>
        <button className={styles.backBtn} onClick={() => navigate('/exams')}>
          ← Back
        </button>

        <div className={styles.filterSection}>
          <p className={styles.filterSectionLabel}>Universities</p>
          <button
            className={`${styles.filterPill} ${selectedUni === 'all' ? styles.filterPillActive : ''}`}
            onClick={() => setSelectedUni('all')}
          >
            All
          </button>
          {universities.map(u => (
            <button
              key={u.id}
              className={`${styles.filterPill} ${selectedUni === u.id ? styles.filterPillActive : ''}`}
              onClick={() => setSelectedUni(u.id)}
            >
              {u.abbr}
            </button>
          ))}
        </div>

        <div className={styles.filterSection}>
          <p className={styles.filterSectionLabel}>Years</p>
          <button
            className={`${styles.filterPill} ${selectedYear === 'all' ? styles.filterPillActive : ''}`}
            onClick={() => setSelectedYear('all')}
          >
            All
          </button>
          {years.map(y => (
            <button
              key={y}
              className={`${styles.filterPill} ${selectedYear === y ? styles.filterPillActive : ''}`}
              onClick={() => setSelectedYear(y)}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.viewerMain}>
        <p className={styles.resultsLabel}>{filtered.length} exams found</p>

        {filtered.map(paper => (
          <div key={paper.id} className={styles.examCard}>
            <div className={styles.examCardLeft}>
              <p className={styles.examUni}>{paper.university_name}</p>
              <p className={styles.examMeta}>{paper.year} · {paper.total_questions} questions</p>
            </div>
            <button className={styles.startExamBtn} onClick={() => navigate(`/exams/${courseKey}/${paper.id}`)}>
              Start exam
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className={styles.noResults}>No exams match your filter.</p>
        )}
      </div>
    </div>
  );
}

export default ExamViewer;