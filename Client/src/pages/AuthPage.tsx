import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useLanguage } from '../context/LanguageContext'

function AuthPage({ onAuthSuccess, onClose }: { onAuthSuccess?: () => void, onClose?: () => void }) {
  const [isLoginTab, setIsLoginTab] = useState(true)
  const [step, setStep] = useState(1)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('User')
  const [adminCode, setAdminCode] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      // ✅ If this doesn't throw, login succeeded
      await authService.login(email, password, rememberMe)
      setSuccess('התחברת בהצלחה!')
      onAuthSuccess?.() // ✅ Always called on success — triggers mountKey increment in App.tsx
      navigate('/products')
    } catch (err: any) {
      setError(err.response?.data?.message || 'ההתחברות נכשלה. נא לבדוק את הפרטים.')
    }
  }

  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      // ✅ Same fix — if no throw, verification succeeded
      await authService.verifyCode(email, verificationCode, rememberMe)
      setSuccess('החשבון אומת בהצלחה!')
      onAuthSuccess?.() // ✅ Always called on success
      navigate('/products')
    } catch (err: any) {
      setError(err.response?.data?.message || 'קוד שגוי או פג תוקף.')
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await authService.register(name, email, password, role, role === 'Admin' ? adminCode : undefined)
      setSuccess('החשבון נוצר בהצלחה! קוד אימות נשלח לאימייל שלך.')
      setStep(2)
    } catch (err: any) {
      setError(err.response?.data?.message || 'ההרשמה נכשלה. נא לנסות שוב.')
    }
  }

  return (
    <div style={{ 
      background: '#fff', 
      padding: '40px', 
      borderRadius: '12px', 
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)', 
      width: '100%', 
      maxWidth: '420px',
      position: 'relative',
      zIndex: 10000
    }}>

      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '14px', right: '16px',
            background: 'transparent', border: 'none',
            color: '#bbb', fontSize: '20px', cursor: 'pointer',
            lineHeight: 1, transition: 'color 0.2s', padding: 0
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#7d2e54'}
          onMouseLeave={e => e.currentTarget.style.color = '#bbb'}
        >✕</button>
      )}
      
      {success && (
        <p style={{ color: 'green', backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '4px', fontSize: '14px', textAlign: 'center' }}>
          {success}
        </p>
      )}
      {error && (
        <p style={{ color: 'red', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', fontSize: '14px', textAlign: 'center' }}>
          {error}
        </p>
      )}

      {step === 2 ? (
        <form onSubmit={handleVerifyCodeSubmit}>
          <h2 style={{ textAlign: 'center', color: '#7d2e54', marginBottom: '20px' }}>אימות הרשמה 🔐</h2>
          <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '20px' }}>
            הזן את קוד האימות בן 6 הספרות שנשלח לכתובת המייל: <br /><strong>{email}</strong>
          </p>
          <input
            type="text"
            placeholder="000000"
            maxLength={6}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', fontSize: '20px', letterSpacing: '8px', textAlign: 'center', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#7d2e54', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            אמת והשלם הרשמה
          </button>
          <button type="button" onClick={() => setStep(1)} style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer' }}>
            חזור לטופס ההרשמה
          </button>
        </form>
      ) : (
        <div>
          <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '2px solid #eee' }}>
            <button 
              onClick={() => { setIsLoginTab(true); setError(''); setSuccess('') }}
              style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: isLoginTab ? '3px solid #7d2e54' : 'none', fontWeight: 'bold', color: isLoginTab ? '#7d2e54' : '#aaa', cursor: 'pointer' }}
            >
              התחברות
            </button>
            <button 
              onClick={() => { setIsLoginTab(false); setError(''); setSuccess('') }}
              style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: !isLoginTab ? '3px solid #7d2e54' : 'none', fontWeight: 'bold', color: !isLoginTab ? '#7d2e54' : '#aaa', cursor: 'pointer' }}
            >
              הרשמה
            </button>
          </div>

          {isLoginTab ? (
            <form onSubmit={handleLoginSubmit}>
              <input
                type="email"
                placeholder={t('emailAddress') || "כתובת אימייל"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <input
                type="password"
                placeholder={t('password') || "סיסמה"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '14px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: 'auto', margin: 0 }}
                />
                זכור אותי (השאר מחובר)
              </label>
              <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#7d2e54', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                התחבר
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <input
                type="text"
                placeholder={t('name') || "שם מלא"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <input
                type="email"
                placeholder={t('emailAddress') || "כתובת אימייל"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <input
                type="password"
                placeholder={t('password') || "סיסמה"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              
              <div style={{ marginBottom: '15px', textAlign: 'right' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#666' }}>סוג חשבון:</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="User">משתמש רגיל</option>
                  <option value="Admin">מנהל מערכת (Admin)</option>
                </select>
              </div>

              {role === 'Admin' && (
                <input
                  type="password"
                  placeholder="הזינו קוד מנהל סודי לאימות"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '2px solid #7d2e54' }}
                />
              )}

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '14px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: 'auto', margin: 0 }}
                />
                זכור אותי (השאר מחובר)
              </label>

              <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#7d2e54', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                {t('register') || 'הירשם והיכנס'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default AuthPage