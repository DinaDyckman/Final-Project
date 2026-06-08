import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService'
import { useLanguage } from '../context/LanguageContext'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('User')
  const [adminCode, setAdminCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      // קריאה לפונקציה לפי הסדר המדויק של הפרמטרים ב-Service
      await authService.register(
        name, 
        email, 
        password, 
        role, 
        role === 'Admin' ? adminCode : undefined
      )
      
      setSuccess('החשבון נוצר בהצלחה! מעביר אותך למסך התחברות...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="form-container">
      <h1>{t('createAnAccount') || 'הרשמה למערכת'}</h1>
      
      {success && <p style={{ color: 'green', marginBottom: '15px', fontSize: '14px' }}>{success}</p>}
      {error && <p style={{ color: 'red', marginBottom: '15px', fontSize: '14px' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t('name') || 'שם מלא'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder={t('emailAddress')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder={t('password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div style={{ marginBottom: '15px', textAlign: 'right' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#666' }}>סוג חשבון:</label>
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
            style={{ border: '2px solid #7d2e54' }}
          />
        )}

        <button type="submit" style={{ width: '100%' }}>{t('register') || 'הירשם'}</button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '30px', color: '#666' }}>
        כבר יש לך חשבון?{' '}
        <Link to="/login" style={{ color: '#7d2e54', textDecoration: 'underline' }}>
          {t('signIn')}
        </Link>
      </p>
    </div>
  )
}

export default Register