import { useState } from 'react'
import { supabase } from '../supabaseClient'
import styles from '../styles/auth.module.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          Fresh<span className={styles.logoAccent}>Course</span>
        </div>

        {sent ? (
          <>
            <h2 className={styles.heading}>Check your email</h2>
            <p className={styles.sub}>
              We sent a password reset link to <span className={styles.strong}>{email}</span>.
              Click the link in the email to reset your password.
            </p>
            <a href="/auth" className={styles.backLink}>← Back to login</a>
          </>
        ) : (
          <>
            <h2 className={styles.heading}>Forgot password?</h2>
            <p className={styles.sub}>Enter your email and we'll send you a reset link.</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={styles.input}
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" disabled={loading} className={styles.btn}>
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>

            <a href="/auth" className={styles.backLink}>← Back to login</a>
          </>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword