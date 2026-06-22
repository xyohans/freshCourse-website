import { useState, useEffect } from 'react'
import { supabase } from '../auth/auth'
import { useUser } from '../context/AuthContext'

function Profile() {
  const { user } = useUser()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [profileError, setProfileError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // Load current values from user metadata
  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || '')
      setPhone(user.user_metadata?.phone_number || '')
    }
  }, [user])

  async function handleProfileUpdate(e) {
    e.preventDefault()
    setProfileLoading(true)
    setProfileMsg('')
    setProfileError('')
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name, phone_number: phone }
    })
    if (error) setProfileError(error.message)
    else setProfileMsg('Profile updated successfully!')
    setProfileLoading(false)
  }

  async function handlePasswordUpdate(e) {
    e.preventDefault()
    if (newPassword !== confirmPassword) return setPasswordError('Passwords do not match')
    if (newPassword.length < 6) return setPasswordError('Password must be at least 6 characters')
    setPasswordLoading(true)
    setPasswordMsg('')
    setPasswordError('')
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) setPasswordError(error.message)
    else {
      setPasswordMsg('Password updated successfully!')
      setNewPassword('')
      setConfirmPassword('')
    }
    setPasswordLoading(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Profile</h1>
        <p style={styles.pageSub}>{user?.email}</p>

        {/* Profile info section */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Personal information</h2>
          <form onSubmit={handleProfileUpdate} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Full name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Abebe Girma"
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Phone number</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={styles.phonePrefix}>+251</div>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="91 234 5678"
                  style={{ ...styles.input, flex: 1 }}
                />
              </div>
            </div>

            {profileError && <p style={styles.error}>{profileError}</p>}
            {profileMsg && <p style={styles.success}>{profileMsg}</p>}

            <button type="submit" disabled={profileLoading} style={styles.btn}>
              {profileLoading ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* Password section */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Change password</h2>
          <form onSubmit={handlePasswordUpdate} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={styles.input}
              />
            </div>

            {passwordError && <p style={styles.error}>{passwordError}</p>}
            {passwordMsg && <p style={styles.success}>{passwordMsg}</p>}

            <button type="submit" disabled={passwordLoading} style={styles.btn}>
              {passwordLoading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
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

export default Profile