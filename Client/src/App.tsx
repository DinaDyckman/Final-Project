import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AuthPage from './pages/AuthPage'
import Products from './pages/Products'
import ThankYou from './pages/ThankYou'
import AdminPanel from './pages/AdminPanel'
import ChatBox from './components/ChatBox'
import AiPromoModal from './components/AiPromoModal'
import AiPromoReminder from './components/AiPromoReminder'
import Footer from './components/Footer'
import { LanguageProvider } from './context/LanguageContext'
import { authService } from './services/authService'
import { cartService } from './services/cartService'
import RentalHistory from './pages/rentalHistory'
import Checkout from './pages/Checkout'
import { CartItem } from './types'

authService.rehydrateSession()

function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [showPromoModal, setShowPromoModal] = useState(true)
  const [showReminder, setShowReminder] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isChatForceOpen, setIsChatForceOpen] = useState(false)
  const [mountKey, setMountKey] = useState(0)

  const [cart, setCart] = useState<CartItem[]>([])
  const [cartLoading, setCartLoading] = useState(true)

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

  useEffect(() => {
    const loadCart = async () => {
      if (currentUserId === 'guest' || !isAuthenticated) {
        setCart([])
        setCartLoading(false)
        return
      }
      setCartLoading(true)
      const dbCart = await cartService.getCart()
      setCart(dbCart)
      setCartLoading(false)
    }
    loadCart()
  }, [currentUserId, isAuthenticated])

  useEffect(() => {
    const timer = setTimeout(() => setShowReminder(true), 10000)
    return () => clearTimeout(timer)
  }, [])

  const refreshAuthState = () => {
    const token = authService.getToken()
    const isValid = !!(token && token !== 'null' && token !== 'undefined' && token.length > 20)
    const newUserId = getCurrentUserId()
    setCurrentUserId(newUserId)
    setIsAuthenticated(isValid)
    setShowAuthModal(false)
    setMountKey(prev => prev + 1)
  }

  const handleMyAccountClick = () => {
    if (!isAuthenticated) setShowAuthModal(true)
  }

  const handlePromoClose = (eventData?: { type: string; date: string }) => {
    setShowPromoModal(false)
    setIsChatForceOpen(true)
    if (eventData) {
      sessionStorage.setItem('eventType', eventData.type)
      sessionStorage.setItem('eventDate', eventData.date)
    }
  }

  const isBlurred = showPromoModal || showAuthModal

  return (
    <LanguageProvider>
      <Router>
        {/*
          Outer shell: flex column so the Footer is always pushed to the
          bottom and the main content expands to fill the remaining space.
        */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>

          {/* ── Blurrable content area ── */}
          <div style={{
            flex: 1,
            filter: isBlurred ? 'blur(7px)' : 'none',
            pointerEvents: isBlurred ? 'none' : 'auto',
            transition: 'filter 0.35s ease',
          }}>
            <Routes>
              <Route path="/" element={
                <Products
                  key={mountKey}
                  userId={currentUserId}
                  cart={cart}
                  setCart={setCart}
                  cartLoading={cartLoading}
                  cartOpen={cartOpen}
                  setCartOpen={setCartOpen}
                  isAuthenticated={isAuthenticated}
                  onMyAccountClick={handleMyAccountClick}
                  onLogout={refreshAuthState}
                />
              } />
              <Route path="/products" element={
                <Products
                  key={mountKey}
                  userId={currentUserId}
                  cart={cart}
                  setCart={setCart}
                  cartLoading={cartLoading}
                  cartOpen={cartOpen}
                  setCartOpen={setCartOpen}
                  isAuthenticated={isAuthenticated}
                  onMyAccountClick={handleMyAccountClick}
                  onLogout={refreshAuthState}
                />
              } />
              <Route path="/checkout" element={
                <Checkout
                  cart={cart}
                  setCart={setCart}
                  userId={currentUserId}
                />
              } />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/rental-history" element={<RentalHistory />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="*" element={<Navigate to="/products" replace />} />
            </Routes>
          </div>

          {/*
            Footer lives OUTSIDE the blurred div so it is never blurred by
            the modal overlay, but INSIDE the Router so useLocation() works.
            It hides itself on /admin and /thank-you via its own hook.
          */}
          <Footer />

          {/* ── Auth modal overlay ── */}
          {showAuthModal && (
            <div
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 999999, animation: 'fadeIn 0.3s ease',
              }}
              onClick={(e) => { if (e.target === e.currentTarget) setShowAuthModal(false) }}
            >
              <div style={{ animation: 'modalSlideIn 0.4s ease-out', position: 'relative' }}>
                <AuthPage onAuthSuccess={refreshAuthState} onClose={() => setShowAuthModal(false)} />
              </div>
            </div>
          )}

          {showPromoModal && <AiPromoModal onClose={handlePromoClose} />}
          {!showPromoModal && showReminder && <AiPromoReminder onClose={() => setShowReminder(false)} />}
          <ChatBox cartOpen={cartOpen} />
        </div>

        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes modalSlideIn {
            from { opacity: 0; transform: scale(0.85) translateY(-40px); }
            to   { opacity: 1; transform: scale(1)    translateY(0);     }
          }
        `}</style>
      </Router>
    </LanguageProvider>
  )
}

export default App