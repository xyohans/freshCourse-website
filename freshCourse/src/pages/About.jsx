import styles from '../styles/about.module.css'

function About() {
  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <p className={styles.heroTitle}>Fresh<span className={styles.accent}>Course</span></p>
        <p className={styles.heroSub}>Free learning for every student</p>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>What is FreshCourse?</p>
        <p className={styles.body}>
          FreshCourse is a free educational platform designed to help university students
          study smarter. It brings together course materials, chapter-by-chapter reading,
          and past exam papers from multiple universities — all in one place.
        </p>
        <p className={styles.body}>
          While FreshCourse was built with Ethiopian freshman students in mind, it is open
          to any student who wants to access quality learning materials and practice with
          real past exams.
        </p>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <p className={styles.sectionTitle}>What you get</p>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <p className={styles.featureIcon}>📖</p>
            <p className={styles.featureTitle}>Course materials</p>
            <p className={styles.featureDesc}>
              Structured reading materials for 16 courses, organized by chapter and topic.
            </p>
          </div>
          <div className={styles.featureCard}>
            <p className={styles.featureIcon}>📝</p>
            <p className={styles.featureTitle}>Past exams</p>
            <p className={styles.featureDesc}>
              Real past exam papers from 40+ Ethiopian universities, filterable by year and university.
            </p>
          </div>
          <div className={styles.featureCard}>
            <p className={styles.featureIcon}>📊</p>
            <p className={styles.featureTitle}>Progress tracking</p>
            <p className={styles.featureDesc}>
              Track which topics you have completed and monitor your exam scores over time.
            </p>
          </div>
          <div className={styles.featureCard}>
            <p className={styles.featureIcon}>🆓</p>
            <p className={styles.featureTitle}>Completely free</p>
            <p className={styles.featureDesc}>
              No subscriptions, no paywalls. Everything on FreshCourse is free to use.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Our mission</p>
        <p className={styles.body}>
          We believe every student deserves access to good study materials regardless of
          where they study or what resources their institution provides. FreshCourse exists
          to close that gap — one course at a time.
        </p>
      </div>

    </div>
  )
}

export default About
