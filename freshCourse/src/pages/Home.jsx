import { useNavigate } from "react-router-dom";
import styles from "../styles/home.module.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Learn smarter. Pass your exams.</h1>
        <p className={styles.heroSubtitle}>
          EthioLearn brings all 15 freshman courses and past exams from 40+ Ethiopian universities into one place.
        </p>
        <div className={styles.ctaGroup}>
          <button 
            className={`${styles.button} ${styles.primaryButton}`} 
            onClick={() => navigate("/register")}
          >
            Get started
          </button>
          <button 
            className={`${styles.button} ${styles.secondaryButton}`} 
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className={styles.features}>
        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Full course library</h3>
          <p className={styles.featureDesc}>
            All 15 freshman courses with chapters, subtopics, and official module PDFs.
          </p>
        </div>
        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Real past exams</h3>
          <p className={styles.featureDesc}>
            Practice with actual exam papers from 40+ universities across multiple years.
          </p>
        </div>
        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Track your progress</h3>
          <p className={styles.featureDesc}>
            See exactly how much of each course you've completed and your exam scores.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>15</div>
          <div className={styles.statLabel}>Courses</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>40+</div>
          <div className={styles.statLabel}>Universities</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>200+</div>
          <div className={styles.statLabel}>Past exams</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>Free</div>
          <div className={styles.statLabel}>To use</div>
        </div>
      </div>
    </div>
  );
}

export default Home;