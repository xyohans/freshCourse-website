import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './auth'
// import styles from '../styles/auth.module.css'

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
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logo}>
          Fresh<span style={{ color: '#1D9E75' }}>Course</span>
        </div>

        {/* Tab switcher */}
        <div style={styles.tabRow}>
          <button
            onClick={() => !isSignUp || switchMode()}
            style={{ ...styles.tab, ...(isSignUp ? {} : styles.tabActive) }}
          >
            Log in
          </button>
          <button
            onClick={() => isSignUp || switchMode()}
            style={{ ...styles.tab, ...(isSignUp ? styles.tabActive : {}) }}
          >
            Sign up
          </button>
        </div>

        <h2 style={styles.heading}>
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h2>
        <p style={styles.sub}>
          {isSignUp ? 'Free access to 15 courses and past exams' : 'Log in to continue learning'}
        </p>

        <form onSubmit={handleAuth} style={styles.form}>

          {/* Name — sign up only */}
          {isSignUp && (
            <div style={styles.field}>
              <label style={styles.label}>Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Abebe Girma"
                required
                style={styles.input}
              />
            </div>
          )}

          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={styles.input}
            />
          </div>

          {/* Phone — sign up only */}
          {isSignUp && (
            <div style={styles.field}>
              <label style={styles.label}>Phone number</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={styles.phonePrefix}>+251</div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="91 234 5678"
                  style={{ ...styles.input, flex: 1 }}
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div style={styles.field}>
            <label style={{ ...styles.label, display: 'flex', justifyContent: 'space-between' }}>
              Password
              {!isSignUp && (
                <a href="/forgot-password" style={styles.forgot}>Forgot?</a>
              )}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Please wait…' : isSignUp ? 'Sign up free' : 'Log in'}
          </button>
        </form>

        <p style={styles.switchText}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <span onClick={switchMode} style={styles.switchLink}>
            {isSignUp ? 'Log in' : 'Sign up free'}
          </span>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f0',
    padding: '24px 16px',
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e2e8e2',
    borderRadius: '16px',
    padding: '36px 32px',
    width: '100%',
    maxWidth: '420px',
  },
  logo: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '24px',
    letterSpacing: '-0.3px',
  },
  tabRow: {
    display: 'flex',
    border: '1px solid #e2e8e2',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '24px',
  },
  tab: {
    flex: 1,
    height: '38px',
    border: 'none',
    background: '#f5f7f5',
    fontSize: '13px',
    fontWeight: '500',
    color: '#6b7280',
    cursor: 'pointer',
  },
  tabActive: {
    background: '#ffffff',
    color: '#1D9E75',
  },
  heading: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0 0 4px',
  },
  sub: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '0 0 22px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    height: '40px',
    padding: '0 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1a1a1a',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  phonePrefix: {
    height: '40px',
    padding: '0 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#6b7280',
    background: '#f5f7f5',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  forgot: {
    fontSize: '12px',
    color: '#1D9E75',
    textDecoration: 'none',
    fontWeight: '400',
  },
  error: {
    fontSize: '13px',
    color: '#dc2626',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '10px 12px',
    margin: '0',
  },
  btn: {
    height: '42px',
    background: '#1D9E75',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '4px',
  },
  switchText: {
    fontSize: '13px',
    color: '#6b7280',
    textAlign: 'center',
    marginTop: '20px',
  },
  switchLink: {
    color: '#1D9E75',
    fontWeight: '500',
    cursor: 'pointer',
  },
}

export default AuthPage