import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'

function ContactUs() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#faf7f5' }}>

      {/* Header */}
      <div style={{ background: '#3b0f1f', padding: '60px 40px 50px', textAlign: 'center', position: 'relative' }}>
        <button
          onClick={() => navigate('/products')}
          style={{ position: 'absolute', left: '40px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: '1px solid rgba(212,175,55,0.45)', color: '#d4af37', padding: '8px 18px', cursor: 'pointer', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '7px' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#d4af37'; e.currentTarget.style.color = '#3b0f1f' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d4af37' }}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back
        </button>
        <h1 style={{ color: '#d4af37', fontWeight: 300, fontSize: '2.4rem', letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 12px', fontFamily: 'inherit' }}>
          Contact Us
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
          We'd love to hear from you
        </p>
        <div style={{ width: '60px', height: '1px', background: '#d4af37', margin: '20px auto 0' }} />
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 30px', display: 'flex', gap: '50px', flexWrap: 'wrap' }}>

        {/* Left — contact info */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <h2 style={{ color: '#5c1a33', fontWeight: 300, fontSize: '1.6rem', letterSpacing: '2px', marginBottom: '30px' }}>Get In Touch</h2>
          <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.8, marginBottom: '36px' }}>
            Whether you're planning a wedding, bar mitzvah, or any special simcha — we're here to help you create an unforgettable experience.
          </p>

          {[
            { icon: <Phone size={18} strokeWidth={1.5} color="#5c1a33" />, label: 'Phone', value: '0548545068' },
            { icon: <Mail size={18} strokeWidth={1.5} color="#5c1a33" />, label: 'Email', value: 'rentalupscale@gmail.com' },
            { icon: <MapPin size={18} strokeWidth={1.5} color="#5c1a33" />, label: 'Location', value: 'Jerusalem, Israel' },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '42px', height: '42px', background: '#fdf0f4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {icon}
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 4px' }}>{label}</p>
                <p style={{ fontSize: '15px', color: '#333', margin: 0 }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right — form */}
        <div style={{ flex: 2, minWidth: '300px' }}>
          {submitted ? (
            <div style={{ background: 'white', borderRadius: '10px', padding: '60px 40px', textAlign: 'center', boxShadow: '0 2px 20px rgba(0,0,0,0.06)' }}>
              <CheckCircle size={48} strokeWidth={1.5} color="#10b981" style={{ marginBottom: '20px' }} />
              <h3 style={{ color: '#5c1a33', fontWeight: 300, fontSize: '1.5rem', letterSpacing: '2px', marginBottom: '12px' }}>Message Sent!</h3>
              <p style={{ color: '#999', fontSize: '14px' }}>We'll get back to you within 24 hours.</p>
              <button
                onClick={() => setSubmitted(false)}
                style={{ marginTop: '24px', background: 'transparent', border: '1px solid #5c1a33', color: '#5c1a33', padding: '10px 28px', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '10px', padding: '40px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Sara Cohen' },
                  { label: 'Email Address', key: 'email', type: 'email', placeholder: 'sara@example.com' },
                ].map(f => (
                  <div key={f.key} style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#999', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      required
                      value={(form as any)[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', border: '1px solid #e8e8e8', borderRadius: '6px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#5c1a33')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#e8e8e8')}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#999', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Phone Number</label>
                <input
                  type="tel"
                  placeholder="054-123-4567"
                  value={form.phone}
                  onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #e8e8e8', borderRadius: '6px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#5c1a33')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e8e8e8')}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#999', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Message</label>
                <textarea
                  placeholder="Tell us about your event..."
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #e8e8e8', borderRadius: '6px', fontSize: '14px', outline: 'none', resize: 'vertical', transition: 'border-color 0.2s', fontFamily: 'inherit', boxSizing: 'border-box' as const }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#5c1a33')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e8e8e8')}
                />
              </div>

              {error && (
                <p style={{ color: '#ef4444', background: '#fef2f2', padding: '10px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={14} strokeWidth={1.5} /> {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{ padding: '14px', background: loading ? '#aaa' : '#5c1a33', color: 'white', border: 'none', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '6px', transition: 'background 0.2s' }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#3b0f1f' }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#5c1a33' }}
              >
                <Send size={15} strokeWidth={1.5} />
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactUs
