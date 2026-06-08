import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService'
import { useLanguage } from '../context/LanguageContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await authService.login(email, password)
      navigate('/products')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    }
  }

  return (
    <div className="form-container">
      <h1>{t('signIn')}</h1>
      <form onSubmit={handleSubmit}>
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
        {error && <p style={{ color: 'red', marginBottom: '15px', fontSize: '14px' }}>{error}</p>}
        <button type="submit" style={{ width: '100%' }}>{t('signIn')}</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '30px', color: '#666' }}>
        {t('newCustomer')}{' '}
        <Link to="/register" style={{ color: '#7d2e54', textDecoration: 'underline' }}>
          {t('createAnAccount')}
        </Link>
      </p>
    </div>
  )
}

export default Login