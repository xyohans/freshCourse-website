import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useUser } from '../context/AuthContext'
import styles from '../styles/auth.module.css'

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
    <div className={styles.pageWide}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Profile</h1>
        <p className={styles.pageSub}>{user?.email}</p>

        <div className={`${styles.card} ${styles.cardStack}`}>
          <h2 className={styles.sectionTitle}>Personal information</h2>
          <form onSubmit={handleProfileUpdate} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Full name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Abebe Girma"
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Phone number</label>
              <div className={styles.phoneRow}>
                <div className={styles.phonePrefix}>+251</div>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="91 234 5678"
                  className={`${styles.input} ${styles.phoneInput}`}
                />
              </div>
            </div>

            {profileError && <p className={styles.error}>{profileError}</p>}
            {profileMsg && <p className={styles.success}>{profileMsg}</p>}

            <button type="submit" disabled={profileLoading} className={styles.btn}>
              {profileLoading ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>

        <div className={`${styles.card} ${styles.cardStack}`}>
          <h2 className={styles.sectionTitle}>Change password</h2>
          <form onSubmit={handlePasswordUpdate} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={styles.input}
              />
            </div>

            {passwordError && <p className={styles.error}>{passwordError}</p>}
            {passwordMsg && <p className={styles.success}>{passwordMsg}</p>}

            <button type="submit" disabled={passwordLoading} className={styles.btn}>
              {passwordLoading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile