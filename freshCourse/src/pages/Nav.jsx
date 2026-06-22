import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/nav.module.css";
import { useUser } from "../context/AuthContext";
import { supabase } from "../auth/auth";

function Nav() {
  const { user, userLoading } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setDropdownOpen(false);
    navigate("/");
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() || "?";

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brandSection}>
        <img
          className={styles.logo}
          src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=64&h=64&fit=crop"
          alt="Fresh Course logo"
        />
        <span className={styles.brandName}>Fresh Course</span>
      </Link>

      <div className={styles.links}>
        {!user && <Link to="/" className={styles.link}>Home</Link>}
        <Link to="/courses" className={styles.link}>Courses</Link>
        <Link to="/exams" className={styles.link}>Exams</Link>
        {user && <Link to="/dashboard" className={styles.link}>Dashboard</Link>}
        {!user && <Link to="/about" className={styles.link}>About</Link>}
        {!user && <Link to="/contact" className={styles.link}>Contact</Link>}
      </div>

      <div className={styles.actions}>
        {userLoading ? null : user ? (
          <div className={styles.profileWrapper} ref={dropdownRef}>
            <button
              className={styles.avatarBtn}
              onClick={() => setDropdownOpen(prev => !prev)}
              aria-label="Profile menu"
            >
              {initials}
            </button>

            {dropdownOpen && (
              <div className={styles.dropdown}>
                <p className={styles.dropdownEmail}>{user.email}</p>
                <div className={styles.dropdownDivider} />
                <Link
                  to="/profile"
                  className={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/auth" className={styles.loginBtn}>Login</Link>
            <Link to="/auth" className={styles.signupBtn}>Get started</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Nav;