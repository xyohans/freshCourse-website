import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../auth/auth'

function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()

  // Supabase fires PASSWORD_RECOVERY event when user lands from email link
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm) return setError('Passwords do not match')
    if (password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else {
      alert('Password updated successfully!')
      navigate('/auth')
    }
    setLoading(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>Fresh<span style={{ color: '#1D9E75' }}>Course</span></div>
        <h2 style={styles.heading}>Reset password</h2>

        {!ready ? (
          <p style={styles.sub}>Verifying your reset link…</p>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>New password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                style={styles.input}
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" disabled={loading} style={styles.btn}>
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f0f4f0', padding: '40px 16px' },
  container: { maxWidth: '560px', margin: '0 auto' },
  pageTitle: { fontSize: '22px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 4px' },
  pageSub: { fontSize: '13px', color: '#6b7280', margin: '0 0 24px' },
  card: { background: '#ffffff', border: '1px solid #e2e8e2', borderRadius: '16px', padding: '28px', marginBottom: '16px' },
  sectionTitle: { fontSize: '15px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 18px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '12px', fontWeight: '500', color: '#374151' },
  input: { height: '40px', padding: '0 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', color: '#1a1a1a', outline: 'none', width: '100%', boxSizing: 'border-box' },
  phonePrefix: { height: '40px', padding: '0 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', color: '#6b7280', background: '#f5f7f5', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' },
  btn: { height: '42px', background: '#1D9E75', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  error: { fontSize: '13px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 12px', margin: '0' },
  success: { fontSize: '13px', color: '#065f46', background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '8px', padding: '10px 12px', margin: '0' },
  backLink: { display: 'block', marginTop: '20px', fontSize: '13px', color: '#1D9E75', textDecoration: 'none', textAlign: 'center' },
}
export default ResetPassword