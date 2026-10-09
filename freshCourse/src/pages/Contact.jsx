import { useState } from 'react'
import styles from '../styles/contact.module.css'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    // replace this with your actual email service later (e.g. Resend, Formspree)
    await new Promise(r => setTimeout(r, 1000))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <p className={styles.pageTitle}>Contact us</p>
        <p className={styles.pageSub}>Have a question or feedback? We would love to hear from you.</p>
      </div>

      <div className={styles.layout}>

        <div className={styles.infoCol}>
          <div className={styles.infoCard}>
            <p className={styles.infoTitle}>Get in touch</p>
            <p className={styles.infoBody}>
              Whether you have found a bug, want to suggest a feature, or just want to say
              hello — send us a message and we will get back to you as soon as we can.
            </p>
          </div>
          <div className={styles.infoCard}>
            <p className={styles.infoTitle}>Response time</p>
            <p className={styles.infoBody}>
              We typically respond within 1–3 business days.
            </p>
          </div>
        </div>

        <div className={styles.formCol}>
          {submitted ? (
            <div className={styles.successBox}>
              <p className={styles.successIcon}>✓</p>
              <p className={styles.successTitle}>Message sent</p>
              <p className={styles.successBody}>
                Thanks for reaching out. We will get back to you soon.
              </p>
              <button
                className={styles.resetBtn}
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }) }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Abebe Girma"
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  required
                  rows={5}
                  className={styles.textarea}
                />
              </div>
              <button type="submit" disabled={loading} className={styles.btn}>
                {loading ? 'Sending...' : 'Send message'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}

export default Contact
