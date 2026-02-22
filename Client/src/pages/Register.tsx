import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService'
import { useLanguage } from '../context/LanguageContext'

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await authService.register(username, email, password)
      navigate('/login')
    } catch (error) {
      console.error('Registration failed', error)
    }
  }

  return (
    <div className="form-container">
      <h1>{t('createAccount')}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t('fullName')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit" style={{width: '100%'}}>{t('createAccount')}</button>
      </form>
      <p style={{textAlign: 'center', marginTop: '30px', color: '#666'}}>{t('alreadyAccount')} <Link to="/login" style={{color: '#7d2e54', textDecoration: 'underline'}}>{t('signIn')}</Link></p>
    </div>
  )
}

export default Register
