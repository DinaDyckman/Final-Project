import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import { authService } from '../services/authService'
import { cartService } from '../services/cartService'  // ✅ השירות החדש
import api from '../services/api'
import { Product, CartItem } from '../types'

// 🌟 הנה האובייקט שהיה חסר וגרם למסך הלבן! החזרנו אותו למקום
const CATEGORY_GROUPS: Record<string, string[]> = {
  'Event Furniture': ['Tables', 'Chairs', 'Sofas', 'Lounge Furniture'],
  'Decor': ['Centerpieces', 'Tablecloths', 'Lighting', 'Backdrops', 'Floral Arrangements'],
  'Tech & Audio': ['Speakers', 'Microphones', 'Projectors', 'Computers', 'Screens'],
  'Catering': ['Serving Dishes', 'Cutlery', 'Glassware', 'Buffet Equipment'],
  'Other': ['Tents', 'Generators', 'Portable Restrooms', 'Dance Floors'],
}

interface ProductsProps {
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  isAuthenticated: boolean
  onMyAccountClick: () => void
  onLogout: () => void
  userId?: string // הוספנו תמיכה ביוזר איידי מהאבא
}

function Products({ cartOpen, setCartOpen, isAuthenticated, onMyAccountClick, onLogout, userId = 'guest' }: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const navigate = useNavigate()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [cartLoading, setCartLoading] = useState(true)  // ✅ ניהול טעינת עגלה
  const [userName, setUserName] = useState<string>(() => {
    const user = authService.getCurrentUser()
    return user?.name || ''
  })

  const [cart, setCart] = useState<CartItem[]>([])

  // ✅ טעינת העגלה ישירות מה-Database בשרת
  useEffect(() => {
    const loadCart = async () => {
      if (userId === 'guest' || !isAuthenticated) {
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
  }, [userId, isAuthenticated])

  // ✅ שמירת העגלה בשרת בכל שינוי עם Debounce של 500 מילישניות
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (userId === 'guest' || !isAuthenticated || cartLoading) return
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => {
      cartService.saveCart(cart)
    }, 500)
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
    }
  }, [cart])

  const handleLogout = async () => {
    if (userId !== 'guest' && isAuthenticated) {
      await cartService.saveCart(cart) // שמירה אחרונה לפני שיוצאים
    }
    authService.logout()
    onLogout()
    setProfileOpen(false)
    window.location.reload() // רענון נקי לדף
  }

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user?.name) setUserName(user.name)
    else setUserName('')
  }, [isAuthenticated])

  const checkout = async () => {
    if (!startDate || !endDate) return alert('Please select both dates.')
    if (endDate <= startDate) return alert('End date must be after start date.')
    const items = cart.map(i => ({ productId: i.product._id, quantity: i.quantity }))
    try {
      const { data } = await api.post('/rentals/checkout', {
        userId, items, startDate, endDate
      })
      await cartService.clearCart() // ✅ ניקוי העגלה ב-DB אחרי צ'קאאוט
      setCart([])
      setCartOpen(false)
      setCheckoutOpen(false)
      navigate('/thank-you', { state: { totalPrice: data.rental.totalPrice } })
    } catch {
      alert('Checkout failed, please try again.')
    }
  }

  useEffect(() => {
    productService.getAll().then(setProducts).catch(console.error)
  }, [])

  const allCategories = Array.from(new Set(products.map(p => p.category)))

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const filtered = selectedCategories.length === 0
    ? products
    : products.filter(p => selectedCategories.includes(p.category))

  const getQty = (id: string) => quantities[id] ?? 1

  const addToCart = (product: Product) => {
    const qty = getQty(product._id)
    setCart(prev => {
      const existing = prev.find(i => i.product._id === product._id)
      if (existing) return prev.map(i => i.product._id === product._id ? { ...i, quantity: i.quantity + qty } : i)
      return [...prev, { product, quantity: qty }]
    })
  }

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.product._id !== id))

  const cartTotal = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: '#5c1a33',
        padding: '15px 30px',
        boxShadow: '0 2px 10px rgba(92, 26, 51, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Logo */}
          <div className="logo">
            <span className="logo-main">Upscale</span>
            <span className="logo-sub">Simcha Rental</span>
          </div>

          {/* Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <button
              onClick={() => setCartOpen(true)}
              style={{
                background: 'transparent', border: 'none', color: 'white',
                fontSize: '14px', letterSpacing: '1px', cursor: 'pointer',
                textTransform: 'uppercase', padding: 0, transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#d4af37'}
              onMouseLeave={e => e.currentTarget.style.color = 'white'}
            >
              Cart {cartTotal > 0 && (
                <span style={{
                  background: '#d4af37', color: '#5c1a33', borderRadius: '50%',
                  padding: '1px 6px', fontSize: '11px', marginLeft: '5px', fontWeight: '700'
                }}>{cartTotal}</span>
              )}
            </button>

            {/* My Account */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => isAuthenticated ? setProfileOpen(p => !p) : onMyAccountClick()}
                style={{
                  background: 'transparent', border: '1px solid rgba(212,175,55,0.6)',
                  color: '#d4af37', fontSize: '14px', letterSpacing: '1px',
                  cursor: 'pointer', textTransform: 'uppercase', padding: '8px 18px',
                  borderRadius: '4px', transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#d4af37'
                  e.currentTarget.style.color = '#5c1a33'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#d4af37'
                }}
              >
                My Account
              </button>

              {/* Profile Dropdown */}
              {isAuthenticated && profileOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  background: 'white', borderRadius: '6px', minWidth: '200px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)', border: '1px solid #e8e8e8',
                  overflow: 'hidden', animation: 'modalSlideIn 0.2s ease-out'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f0f0f0',
                    background: '#faf7f5',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
                  }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#999', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Signed in as</p>
                      <p style={{ fontSize: '16px', fontWeight: '600', color: '#5c1a33' }}>{userName}</p>
                    </div>
                    <button
                      onClick={() => setProfileOpen(false)}
                      style={{
                        background: 'transparent', border: 'none',
                        color: '#bbb', fontSize: '16px', cursor: 'pointer',
                        lineHeight: 1, padding: 0, transition: 'color 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#7d2e54'}
                      onMouseLeave={e => e.currentTarget.style.color = '#bbb'}
                    >✕</button>
                  </div>

                  {/* ⚙️ כפתור ה-Admin Panel החדש מוזרק כאן ויופיע רק למנהלים */}
                  {authService.getCurrentUser()?.role === 'Admin' && (
                    <button
                      onClick={() => {
                        navigate('/admin')
                        setProfileOpen(false)
                      }}
                      style={{
                        width: '100%', padding: '14px 20px', background: 'transparent',
                        border: 'none', color: '#5c1a33', fontSize: '14px', letterSpacing: '1px',
                        textAlign: 'left', cursor: 'pointer', textTransform: 'uppercase',
                        transition: 'background 0.2s', borderBottom: '1px solid #f0f0f0',
                        display: 'flex', alignItems: 'center', gap: '8px'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#faf7f5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span></span> Admin Panel
                    </button>
                  )}

                  {/* כפתור ה-Logout המקורי נמצא כאן מתחתיו */}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%', padding: '14px 20px', background: 'transparent',
                      border: 'none', color: '#7d2e54', fontSize: '14px', letterSpacing: '1px',
                      textAlign: 'left', cursor: 'pointer', textTransform: 'uppercase',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fdf0f4'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* Sidebar */}
        <aside style={{ width: '240px', minWidth: '240px', background: '#faf7f5', borderRight: '1px solid #e8e8e8', padding: '30px 20px' }}>
          <h3 style={{ color: '#5c1a33', fontWeight: 400, fontSize: '1.1rem', letterSpacing: '1px', marginBottom: '20px', textTransform: 'uppercase' }}>Filter by Category</h3>
          {Object.entries(CATEGORY_GROUPS).map(([group, cats]) => {
            const available = cats.filter(c => allCategories.includes(c))
            if (available.length === 0) return null
            return (
              <div key={group} style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>{group}</p>
                {available.map(cat => (
                  <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', cursor: 'pointer', fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      style={{ accentColor: '#7d2e54', width: 'auto', margin: 0 }}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            )
          })}
          {allCategories.filter(c => !Object.values(CATEGORY_GROUPS).flat().includes(c)).map(cat => (
            <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                style={{ accentColor: '#7d2e54', width: 'auto', margin: 0 }}
              />
              {cat}
            </label>
          ))}
          {selectedCategories.length > 0 && (
            <button onClick={() => setSelectedCategories([])} style={{ marginTop: '16px', padding: '8px 14px', fontSize: '12px', background: 'transparent', color: '#7d2e54', border: '1px solid #7d2e54', cursor: 'pointer', width: '100%' }}>
              Clear Filters
            </button>
          )}
        </aside>

        {/* Main content */}
        <div style={{ flex: 1, padding: '30px' }}>
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ fontWeight: 300, fontSize: '2rem', color: '#5c1a33', letterSpacing: '2px', margin: 0 }}>Available Items</h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {filtered.map(product => (
              <div key={product._id} style={{ border: '1px solid #e8e8e8', background: 'white', borderRadius: '4px', overflow: 'hidden', transition: 'box-shadow 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(92,26,51,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                )}
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontWeight: 400, fontSize: '1rem', color: '#5c1a33', marginBottom: '6px' }}>{product.name}</h3>
                  <p style={{ fontSize: '12px', color: '#999', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>{product.category}</p>
                  <p style={{ fontSize: '13px', color: '#555', marginBottom: '4px' }}>Available: {product.quantityAvailable}</p>
                  {/* 🌟 הוספת המחיר המאובטח לתצוגה בכרטיס המוצר */}
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#d4af37', marginBottom: '14px' }}>Price: ${product.price || 0}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      min={1}
                      max={product.quantityAvailable}
                      value={getQty(product._id)}
                      onChange={e => setQuantities(prev => ({ ...prev, [product._id]: Math.max(1, Math.min(product.quantityAvailable, Number(e.target.value))) }))}
                      style={{ width: '60px', padding: '6px', margin: 0, fontSize: '14px' }}
                    />
                    <button onClick={() => addToCart(product)} style={{ flex: 1, padding: '8px', fontSize: '12px', letterSpacing: '1px' }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p style={{ color: '#999', textAlign: 'center', marginTop: '60px' }}>No products found for selected filters.</p>
          )}
        </div>
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '360px', height: '100vh', background: 'white', boxShadow: '-4px 0 20px rgba(0,0,0,0.15)', zIndex: 200, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontWeight: 300, fontSize: '1.5rem', color: '#5c1a33' }}>Your Cart</h2>
            <button onClick={() => setCartOpen(false)} style={{ background: 'transparent', color: '#5c1a33', border: 'none', fontSize: '20px', padding: '0', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {cartLoading ? (
              <p style={{ color: '#999', textAlign: 'center', marginTop: '40px' }}>Loading cart...</p>
            ) : cart.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', marginTop: '40px' }}>Your cart is empty</p>
            ) : cart.map(item => (
              <div key={item.product?._id || Math.random()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div>
                  <p style={{ fontWeight: 400, fontSize: '14px' }}>{item.product?.name || 'Unknown Item'}</p>
                  <p style={{ fontSize: '12px', color: '#999' }}>Qty: {item.quantity}</p>
                </div>
                <button onClick={() => removeFromCart(item.product?._id)} style={{ background: 'transparent', color: '#999', border: 'none', fontSize: '16px', padding: '0', cursor: 'pointer' }}>✕</button>
              </div>
            ))}
          </div>
          {cart.length > 0 && (
            <div style={{ padding: '20px', borderTop: '1px solid #e8e8e8' }}>
              <button onClick={() => setCheckoutOpen(true)} style={{ width: '100%', padding: '14px', background: '#5c1a33', color: 'white', fontSize: '14px', letterSpacing: '1px' }}>
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Date Picker Popup */}
      {checkoutOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '40px', width: '380px', border: '1px solid #e8e8e8', boxShadow: '0 10px 40px rgba(92,26,51,0.2)' }}>
            <h2 style={{ fontWeight: 300, fontSize: '1.5rem', color: '#5c1a33', letterSpacing: '2px', marginBottom: '30px' }}>Select Dates</h2>
            <label style={{ fontSize: '12px', color: '#999', letterSpacing: '1px', textTransform: 'uppercase' }}>Start Date</label>
            <input type="date" value={startDate} min={new Date().toISOString().split('T')[0]} onChange={e => setStartDate(e.target.value)} style={{ width: '100%', marginTop: '6px', marginBottom: '20px' }} />
            <label style={{ fontSize: '12px', color: '#999', letterSpacing: '1px', textTransform: 'uppercase' }}>End Date</label>
            <input type="date" value={endDate} min={startDate || new Date().toISOString().split('T')[0]} onChange={e => setEndDate(e.target.value)} style={{ width: '100%', marginTop: '6px', marginBottom: '30px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setCheckoutOpen(false)} style={{ flex: 1, padding: '12px', background: 'transparent', color: '#5c1a33', border: '1px solid #5c1a33', fontSize: '13px', letterSpacing: '1px' }}>Cancel</button>
              <button onClick={checkout} style={{ flex: 1, padding: '12px', background: '#5c1a33', color: 'white', fontSize: '13px', letterSpacing: '1px' }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products