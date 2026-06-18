import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/nav.module.css";

function Nav() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token"); // placeholder until real auth is wired

  function handleDashboardClick(e) {
    e.preventDefault();
    // if (isLoggedIn) {
      navigate("/dashboard");
    // } else {
    //   navigate("/login");
    // }
  }

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brandSection}>
        <img
          className={styles.logo}
          src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=64&h=64&fit=crop"
          alt="EthioLearn logo"
        />
        <span className={styles.brandName}>Fresh Course</span>
      </Link>

      <div className={styles.links}>
        <Link to="/courses" className={styles.link}>Courses</Link>
        <Link to="/exams" className={styles.link}>Exams</Link>
        <a href="/dashboard" className={styles.link} onClick={handleDashboardClick}>
          Dashboard
        </a>
        <Link to="/about" className={styles.link}>About</Link>
        <Link to="/contact" className={styles.link}>Contact</Link>
      </div>

      <div className={styles.actions}>
        <Link to="/login" className={styles.loginBtn}>Login</Link>
        <Link to="/signup" className={styles.signupBtn}>Get started</Link>
      </div>
    </nav>
  );
}

export default Nav;