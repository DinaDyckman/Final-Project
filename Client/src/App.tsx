import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import AuthPage from './pages/AuthPage'
import Products from './pages/Products'
import ThankYou from './pages/ThankYou'
import ChatBox from './components/ChatBox'
import AiPromoModal from './components/AiPromoModal'
import { LanguageProvider } from './context/LanguageContext'

function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [showPromoModal, setShowPromoModal] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  // State חדש כדי לשלוט בפתיחת הצ'אט ישירות מהמודל
  const [isChatForceOpen, setIsChatForceOpen] = useState(false)

  const getInitialAuthState = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    return !!(token && token !== 'null' && token !== 'undefined' && token.length > 20)
  }

  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthState)

  const refreshAuthState = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    const isValid = !!(token && token !== 'null' && token !== 'undefined' && token.length > 20)
    setIsAuthenticated(isValid)
    if (isValid) setShowAuthModal(false)
  }

  const handleMyAccountClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
    } else {
      // already handled inside Products via profileOpen dropdown
    }
  }

  // פונקציה שמטפלת בסגירת המודל והפעלת הצ'אט בוט
  const handlePromoClose = (eventData?: { type: string; date: string }) => {
    setShowPromoModal(false)
    setIsChatForceOpen(true) // פותח את הצ'אט בוט אוטומטית!
    
    if (eventData) {
      // כאן שומרים את סוג האירוע והתאריך שהמשתמש בחר בשביל הבוט
      sessionStorage.setItem('eventType', eventData.type)
      sessionStorage.setItem('eventDate', eventData.date)
    }
  }

  const isBlurred = showPromoModal || showAuthModal

  return (
    <LanguageProvider>
      <Router>
        <div style={{ position: 'relative', minHeight: '100vh' }}>
          {/* Main layout - blurred when any modal is open */}
          <div style={{
            filter: isBlurred ? 'blur(7px)' : 'none',
            pointerEvents: isBlurred ? 'none' : 'auto',
            transition: 'filter 0.35s ease'
          }}>
            <Routes>
              <Route path="/" element={<Products cartOpen={cartOpen} setCartOpen={setCartOpen} isAuthenticated={isAuthenticated} onMyAccountClick={handleMyAccountClick} onLogout={refreshAuthState} />} />
              <Route path="/products" element={<Products cartOpen={cartOpen} setCartOpen={setCartOpen} isAuthenticated={isAuthenticated} onMyAccountClick={handleMyAccountClick} onLogout={refreshAuthState} />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="*" element={<Navigate to="/products" replace />} />
            </Routes>
          </div>

          {/* Auth Modal */}
          {showAuthModal && (
            <div
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999,
                animation: 'fadeIn 0.3s ease'
              }}
              onClick={(e) => { if (e.target === e.currentTarget) setShowAuthModal(false) }}
            >
              <div style={{ animation: 'modalSlideIn 0.4s ease-out', position: 'relative' }}>
                <AuthPage onAuthSuccess={refreshAuthState} onClose={() => setShowAuthModal(false)} />
              </div>
            </div>
          )}

          {/* AI Promo Modal - Simcha Bot */}
          {showPromoModal && (
            <AiPromoModal onClose={handlePromoClose} />
          )}

   
<ChatBox cartOpen={cartOpen} />
        </div>

        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes modalSlideIn {
            from { opacity: 0; transform: scale(0.85) translateY(-40px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </Router>
    </LanguageProvider>
  )
}

export default App