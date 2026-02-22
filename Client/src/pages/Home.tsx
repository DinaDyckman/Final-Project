import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

function Home() {
  const { t } = useLanguage()

  return (
    <>
      <div className="hero">
        <h1>{t('luxuryRentals')}</h1>
        <p>{t('experiencePremium')}</p>
        <div className="nav">
          <Link to="/products" className="btn">{t('exploreCollection')}</Link>
        </div>
      </div>
      <div className="container">
        <h2 style={{textAlign: 'center', marginBottom: '50px'}}>{t('ourServices')}</h2>
        <div className="grid">
          <div className="card">
            <h3>{t('premiumSelection')}</h3>
            <p style={{color: '#666'}}>{t('curatedCollection')}</p>
          </div>
          <div className="card">
            <h3>{t('flexibleTerms')}</h3>
            <p style={{color: '#666'}}>{t('rentAsLong')}</p>
          </div>
          <div className="card">
            <h3>{t('trustedService')}</h3>
            <p style={{color: '#666'}}>{t('professionalSupport')}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
