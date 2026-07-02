import { useNavigate } from "react-router-dom";
import styles from "../styles/notfound.module.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.sub}>
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={() => navigate("/")}>
            Go home
          </button>
          <button className={styles.secondaryBtn} onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;