import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AuthPage from './pages/AuthPage'
import Products from './pages/Products'
import ThankYou from './pages/ThankYou'
import ChatBox from './components/ChatBox'
import AiPromoModal from './components/AiPromoModal'
import { LanguageProvider } from './context/LanguageContext'
import { authService } from './services/authService'

authService.rehydrateSession()

function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isChatForceOpen, setIsChatForceOpen] = useState(false)
  
  // 🌟 מתחילים כ-false זמני כדי שהעמוד לא יתרסק, ונשנה אותו בתוך ה-useEffect
  const [showPromoModal, setShowPromoModal] = useState(false)

  const getInitialAuthState = () => {
    const token = authService.getToken()
    return !!(token && token !== 'null' && token !== 'undefined' && token.length > 20)
  }

  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthState)

  const getCurrentUserId = () => {
    const user = authService.getCurrentUser()
    return user?.id || 'guest'
  }

  const [currentUserId, setCurrentUserId] = useState(getCurrentUserId)

  // 🌟 אפשרות 1 המתוקנת: בודקים ומציגים את הפרסומת רק אחרי שהיוזר איידי מוכן ב-100%
  useEffect(() => {
    const userId = getCurrentUserId()
    const hasSeenPromo = sessionStorage.getItem(`hasSeenPromo_${userId}`)
    
    if (hasSeenPromo !== 'true') {
      setShowPromoModal(true)
    } else {
      setShowPromoModal(false)
    }
  }, [currentUserId, isAuthenticated]) // ירוץ בכל פעם שהמשתמש משתנה

  const refreshAuthState = () => {
    const token = authService.getToken()
    const isValid = !!(token && token !== 'null' && token !== 'undefined' && token.length > 20)
    const newUserId = getCurrentUserId() 
    
    setCurrentUserId(newUserId)
    setIsAuthenticated(isValid)
    if (isValid) setShowAuthModal(false)
  }

  const handleMyAccountClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
    }
  }

  const handlePromoClose = (eventData?: { type: string; date: string }) => {
    setShowPromoModal(false)
    setIsChatForceOpen(true)
    
    // 🌟 שומרים את הסימון ספציפית לפי ה-ID של המשתמש הנוכחי בתוך הסשן
    const userId = getCurrentUserId()
    sessionStorage.setItem(`hasSeenPromo_${userId}`, 'true')

    if (eventData) {
      sessionStorage.setItem('eventType', eventData.type)
      sessionStorage.setItem('eventDate', eventData.date)
    }
  }

  const isBlurred = showPromoModal || showAuthModal

  return (
    <LanguageProvider>
      <Router>
        <div style={{ position: 'relative', minHeight: '100vh' }}>
          <div style={{
            filter: isBlurred ? 'blur(7px)' : 'none',
            pointerEvents: isBlurred ? 'none' : 'auto',
            transition: 'filter 0.35s ease'
          }}>
            <Routes>
              <Route path="/" element={
                <Products
                  key={currentUserId}
                  userId={currentUserId}
                  cartOpen={cartOpen}
                  setCartOpen={setCartOpen}
                  isAuthenticated={isAuthenticated}
                  onMyAccountClick={handleMyAccountClick}
                  onLogout={refreshAuthState}
                />
              } />
              <Route path="/products" element={
                <Products
                  key={currentUserId}
                  userId={currentUserId}
                  cartOpen={cartOpen}
                  setCartOpen={setCartOpen}
                  isAuthenticated={isAuthenticated}
                  onMyAccountClick={handleMyAccountClick}
                  onLogout={refreshAuthState}
                />
              } />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="*" element={<Navigate to="/products" replace />} />
            </Routes>
          </div>

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