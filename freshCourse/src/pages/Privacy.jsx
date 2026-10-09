import styles from '../styles/privacy.module.css'

function Privacy() {
  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <p className={styles.pageTitle}>Privacy Policy</p>
        <p className={styles.pageSub}>Last updated: July 2026</p>
      </div>

      <div className={styles.content}>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Overview</p>
          <p className={styles.body}>
            FreshCourse is committed to protecting your privacy. This policy explains what
            information we collect, how we use it, and how we keep it safe. By using
            FreshCourse you agree to the practices described here.
          </p>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Information we collect</p>
          <p className={styles.body}>When you create an account, we collect:</p>
          <ul className={styles.list}>
            <li><span className={styles.bullet} />Full name</li>
            <li><span className={styles.bullet} />Email address</li>
            <li><span className={styles.bullet} />Phone number</li>
            <li><span className={styles.bullet} />Password (stored as a secure hash — we never store your plain text password)</li>
            <li><span className={styles.bullet} />University (optional)</li>
          </ul>
          <p className={styles.body} style={{ marginTop: 12 }}>
            We also collect usage data such as which topics you have completed and your
            exam attempt scores. This data is used only to power your progress tracking
            features.
          </p>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>How we use your information</p>
          <ul className={styles.list}>
            <li><span className={styles.bullet} />To create and manage your account</li>
            <li><span className={styles.bullet} />To send you a verification email when you sign up</li>
            <li><span className={styles.bullet} />To track your course progress and exam scores</li>
            <li><span className={styles.bullet} />To respond to messages you send us through the contact page</li>
          </ul>
          <p className={styles.body} style={{ marginTop: 12 }}>
            We do not use your information for advertising. We do not sell your data to
            any third party.
          </p>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Data storage and security</p>
          <p className={styles.body}>
            Your data is stored securely using Supabase, which is hosted on AWS
            infrastructure. Passwords are hashed before storage and are never readable
            by anyone, including us. We use industry-standard security practices to
            protect your information.
          </p>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Your rights</p>
          <ul className={styles.list}>
            <li><span className={styles.bullet} />You can update your account information at any time from your profile</li>
            <li><span className={styles.bullet} />You can request deletion of your account and all associated data by contacting us</li>
            <li><span className={styles.bullet} />You can contact us at any time with questions about your data</li>
          </ul>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Cookies</p>
          <p className={styles.body}>
            FreshCourse uses only essential cookies required for authentication and session
            management. We do not use tracking or advertising cookies.
          </p>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Changes to this policy</p>
          <p className={styles.body}>
            We may update this privacy policy from time to time. When we do, we will
            update the date at the top of this page. Continued use of FreshCourse after
            changes means you accept the updated policy.
          </p>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Contact</p>
          <p className={styles.body}>
            If you have any questions about this privacy policy or how we handle your
            data, please reach out through our <a href="/contact" className={styles.link}>contact page</a>.
          </p>
        </div>

      </div>
    </div>
  )
}

export default Privacy
