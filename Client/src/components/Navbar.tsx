import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

function Navbar() {
  const { language, toggleLanguage, t } = useLanguage()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <span className="logo-main">Upscale</span>
          <span className="logo-sub">Simcha Rental</span>
        </Link>
        <div className="nav-links">
          <Link to="/products">{t('products')}</Link>
          <Link to="/inspiration-gallery">{t('inspirationGallery')}</Link>
          <Link to="/login">{t('signIn')}</Link>
          <button onClick={toggleLanguage} className="lang-btn">
            {language === 'en' ? 'עב' : 'EN'}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
