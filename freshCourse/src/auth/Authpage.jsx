import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import styles from '../styles/auth.module.css'

function AuthPage() {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone_number: phone,
          },
        },
      })
      if (error) setError(error.message)
      else alert('Check your email for the confirmation link!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else navigate('/dashboard')
    }
    setLoading(false)
  }

  function switchMode() {
    setIsSignUp(!isSignUp)
    setError('')
    setName('')
    setPhone('')
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <div className={styles.logo}>
          Fresh<span className={styles.logoAccent}>Course</span>
        </div>

        <div className={styles.tabRow}>
          <button
            onClick={() => !isSignUp || switchMode()}
            className={`${styles.tab} ${!isSignUp ? styles.tabActive : ''}`}
          >
            Log in
          </button>
          <button
            onClick={() => isSignUp || switchMode()}
            className={`${styles.tab} ${isSignUp ? styles.tabActive : ''}`}
          >
            Sign up
          </button>
        </div>

        <h2 className={styles.heading}>
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className={styles.sub}>
          {isSignUp ? 'Free access to 15 courses and past exams' : 'Log in to continue learning'}
        </p>

        <form onSubmit={handleAuth} className={styles.form}>

          {isSignUp && (
            <div className={styles.field}>
              <label className={styles.label}>Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Abebe Girma"
                required
                className={styles.input}
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={styles.input}
            />
          </div>

          {isSignUp && (
            <div className={styles.field}>
              <label className={styles.label}>Phone number</label>
              <div className={styles.phoneRow}>
                <div className={styles.phonePrefix}>+251</div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="91 234 5678"
                  className={`${styles.input} ${styles.phoneInput}`}
                />
              </div>
            </div>
          )}

          <div className={styles.field}>
            <label className={`${styles.label} ${styles.labelRow}`}>
              Password
              {!isSignUp && (
                <a href="/forgot-password" className={styles.forgot}>Forgot?</a>
              )}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={styles.input}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} className={styles.btn}>
            {loading ? 'Please wait…' : isSignUp ? 'Sign up free' : 'Log in'}
          </button>
        </form>

        <p className={styles.switchText}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <span onClick={switchMode} className={styles.switchLink}>
            {isSignUp ? 'Log in' : 'Sign up free'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default AuthPage