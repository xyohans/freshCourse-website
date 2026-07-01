import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import styles from "../styles/nav.module.css";
import { useUser } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

function Nav() {
  const { user, userLoading } = useUser();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() || "?";

  return (
    <>
      <nav className={styles.nav}>
        <Link to="/" className={styles.brandSection}>
          <img
            className={styles.logo}
            src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=64&h=64&fit=crop"
            alt="Fresh Course logo"
          />
          <span className={styles.brandName}>Fresh Course</span>
        </Link>

        {/* Desktop Links */}
        <div className={styles.links}>
          {!user && (
            <Link to="/" className={styles.link}>
              Home
            </Link>
          )}

          <Link to="/courses" className={styles.link}>
            Courses
          </Link>

          <Link to="/exams" className={styles.link}>
            Exams
          </Link>

          {user && (
            <Link to="/dashboard" className={styles.link}>
              Dashboard
            </Link>
          )}

          {!user && (
            <Link to="/about" className={styles.link}>
              About
            </Link>
          )}

          {!user && (
            <Link to="/contact" className={styles.link}>
              Contact
            </Link>
          )}
        </div>

        {/* Desktop Actions */}
        <div className={styles.actions}>
          {userLoading ? null : user ? (
            <div className={styles.profileWrapper} ref={dropdownRef}>
              <button
                className={styles.avatarBtn}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {initials}
              </button>

              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <p className={styles.dropdownEmail}>{user.email}</p>

                  <div className={styles.dropdownDivider}></div>

                  <Link
                    to="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    className={styles.dropdownItem}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/auth" className={styles.loginBtn}>
                Login
              </Link>

              <Link to="/auth" className={styles.signupBtn}>
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.menuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <HiOutlineX size={26} />
          ) : (
            <HiOutlineMenu size={26} />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu} ref={mobileMenuRef}>
          {!user && (
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
          )}

          <Link to="/courses" onClick={() => setMobileMenuOpen(false)}>
            Courses
          </Link>

          <Link to="/exams" onClick={() => setMobileMenuOpen(false)}>
            Exams
          </Link>

          {user && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {!user && (
            <>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>

              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>

              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>

              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}

          {user && (
            <>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                Profile
              </Link>

              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Nav;