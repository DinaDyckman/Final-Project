import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import { authService } from '../services/authService'
import { Product, CartItem } from '../types'

const CATEGORY_GROUPS: Record<string, string[]> = {
  'Event Furniture': ['Tables', 'Chairs', 'Sofas', 'Lounge Furniture'],
  'Decor': ['Centerpieces', 'Tablecloths', 'Lighting', 'Backdrops', 'Floral Arrangements'],
  'Tech & Audio': ['Speakers', 'Microphones', 'Projectors', 'Computers', 'Screens'],
  'Catering': ['Serving Dishes', 'Cutlery', 'Glassware', 'Buffet Equipment'],
  'Other': ['Tents', 'Generators', 'Portable Restrooms', 'Dance Floors'],
}

function Products({ cartOpen, setCartOpen }: { cartOpen: boolean, setCartOpen: (open: boolean) => void }) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const navigate = useNavigate()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [userName, setUserName] = useState<string>('Guest')

  const handleLogout = () => {
    authService.logout()
    window.location.reload() // Force refresh to trigger auth state update
  }

  // Get user name on component mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (currentUser && currentUser.name) {
      setUserName(currentUser.name)
    }
  }, [])

  const checkout = async () => {
    if (!startDate || !endDate) return alert('Please select both dates.')
    if (endDate <= startDate) return alert('End date must be after start date.')
    const userId = localStorage.getItem('userId') || 'user_123'
    const items = cart.map(i => ({ productId: i.product._id, quantity: i.quantity }))
    try {
      const res = await fetch('/api/rentals/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, items, startDate, endDate })
      })
      if (!res.ok) throw new Error('Checkout failed')
      const data = await res.json()
      setCart([])
      setCartOpen(false)
      setCheckoutOpen(false)
      navigate('/thank-you', { state: { totalPrice: data.rental.totalPrice } })
    } catch (error) {
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
    <div style={{ display: 'flex', minHeight: '100vh' }}>

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontWeight: 300, fontSize: '2rem', color: '#5c1a33', letterSpacing: '2px' }}>Available Items</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '400',
              color: '#5c1a33',
              letterSpacing: '0.5px',
              padding: '0 8px'
            }}>
              Welcome, <span style={{ fontWeight: '600', color: '#7d2e54' }}>{userName}</span>
            </div>
            <button onClick={() => setCartOpen(true)} style={{ position: 'relative', padding: '10px 20px', background: '#5c1a33', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
              Cart {cartTotal > 0 && <span style={{ background: '#d4af37', color: '#5c1a33', borderRadius: '50%', padding: '2px 7px', fontSize: '12px', marginLeft: '6px' }}>{cartTotal}</span>}
            </button>
            <button 
              onClick={handleLogout}
              style={{ 
                padding: '10px 20px', 
                background: 'transparent', 
                color: '#5c1a33', 
                border: '2px solid #5c1a33', 
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                letterSpacing: '1px',
                transition: 'all 0.3s',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#5c1a33'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#5c1a33'
              }}
            >
              Logout
            </button>
          </div>
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
                <p style={{ fontSize: '13px', color: '#555', marginBottom: '14px' }}>Available: {product.quantityAvailable}</p>
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

      {/* Cart Drawer */}
      {cartOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '360px', height: '100vh', background: 'white', boxShadow: '-4px 0 20px rgba(0,0,0,0.15)', zIndex: 200, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontWeight: 300, fontSize: '1.5rem', color: '#5c1a33' }}>Your Cart</h2>
            <button onClick={() => setCartOpen(false)} style={{ background: 'transparent', color: '#5c1a33', border: 'none', fontSize: '20px', padding: '0', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {cart.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', marginTop: '40px' }}>Your cart is empty</p>
            ) : cart.map(item => (
              <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div>
                  <p style={{ fontWeight: 400, fontSize: '14px' }}>{item.product.name}</p>
                  <p style={{ fontSize: '12px', color: '#999' }}>Qty: {item.quantity}</p>
                </div>
                <button onClick={() => removeFromCart(item.product._id)} style={{ background: 'transparent', color: '#999', border: 'none', fontSize: '16px', padding: '0', cursor: 'pointer' }}>✕</button>
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
