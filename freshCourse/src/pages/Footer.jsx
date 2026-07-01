import { Link } from "react-router-dom";
import styles from "../styles/footer.module.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        {/* Brand Column */}
        <div className={styles.brandColumn}>
          <h2 className={styles.brandName}>EthioLearn</h2>
          <p className={styles.brandDescription}>
            Empowering Ethiopian university students with the resources they need to succeed in their freshman year and beyond.
          </p>
        </div>

        {/* Links Column 1 */}
        <div className={styles.linkColumn}>
          <h3 className={styles.columnTitle}>Resources</h3>
          <ul className={styles.linkList}>
            <li><Link to="/courses" className={styles.linkItem}>Freshman Courses</Link></li>
            <li><Link to="/exams" className={styles.linkItem}>Past Exams</Link></li>
            <li><Link to="/universities" className={styles.linkItem}>Universities</Link></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className={styles.linkColumn}>
          <h3 className={styles.columnTitle}>Company</h3>
          <ul className={styles.linkList}>
            <li><Link to="/about" className={styles.linkItem}>About Us</Link></li>
            <li><Link to="/contact" className={styles.linkItem}>Contact</Link></li>
            <li><Link to="/privacy" className={styles.linkItem}>Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className={styles.newsletterColumn}>
          <h3 className={styles.columnTitle}>Stay Updated</h3>
          <p className={styles.newsletterText}>Get the latest exam tips and platform updates.</p>
          <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className={styles.emailInput} 
              required
            />
            <button type="submit" className={styles.subscribeButton}>Subscribe</button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.footerBottom}>
        <p className={styles.copyrightText}>
          &copy; {currentYear} EthioLearn. All rights reserved.
        </p>
        <div className={styles.socialLinks}>
          <a href="#" className={styles.socialIcon} aria-label="Facebook">FB</a>
          <a href="#" className={styles.socialIcon} aria-label="Telegram">TG</a>
          <a href="#" className={styles.socialIcon} aria-label="Twitter">X</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;