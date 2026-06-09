import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import { authService } from '../services/authService'
import { cartService } from '../services/cartService'
import { Product, CartItem } from '../types'
import {
  ShoppingCart, User, LogOut, LayoutDashboard, ClipboardList,
  Search, SlidersHorizontal, Tag, PackageCheck, ShoppingBag,
  CalendarDays, ArrowRightCircle, CheckCircle, Trash2, Filter, X
} from 'lucide-react'

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
  userId?: string
  cart: CartItem[]
  setCart: (cart: CartItem[]) => void
  cartLoading: boolean
}

function Products({ cartOpen, setCartOpen, isAuthenticated, onMyAccountClick, onLogout, userId = 'guest', cart, setCart, cartLoading }: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const navigate = useNavigate()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [userName, setUserName] = useState<string>(() => {
    const user = authService.getCurrentUser()
    return user?.name || ''
  })
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [sortBy, setSortBy] = useState('default')
  const [toast, setToast] = useState('')

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
      await cartService.saveCart(cart)
    }
    authService.logout()
    onLogout()
    setProfileOpen(false)
    window.location.reload()
  }

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user?.name) setUserName(user.name)
    else setUserName('')
  }, [isAuthenticated])

  useEffect(() => {
    productService.getAll().then(setProducts).catch(console.error)
  }, [])

  const allCategories = Array.from(new Set(products.map(p => p.category)))

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const filtered = products
    .filter(p => selectedCategories.length === 0 || selectedCategories.includes(p.category))
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0)
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0)
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
      return 0
    })

  const getQty = (id: string) => quantities[id] ?? 1

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const addToCart = (product: Product) => {
    const qty = getQty(product._id)
    setCart((() => {
      const existing = cart.find(i => i.product._id === product._id)
      if (existing) return cart.map(i => i.product._id === product._id ? { ...i, quantity: i.quantity + qty } : i)
      return [...cart, { product, quantity: qty }]
    })())
    showToast(`${product.name} added to cart`)
  }

  const removeFromCart = (id: string) => setCart(cart.filter(i => i.product._id !== id))

  const cartTotal = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: '#3b0f1f',
        borderBottom: '1px solid rgba(212,175,55,0.2)',
        padding: '0 40px',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 4px 24px rgba(0,0,0,0.45)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', height: '70px', gap: '24px' }}>

          {/* Left — logo */}
          <div className="logo" style={{ flexShrink: 0 }}>
            <span className="logo-main" style={{ fontSize: '2.2rem', color: '#d4a373' }}>Upscale</span>
            <span className="logo-sub" style={{ letterSpacing: '4px', color: '#d4a373' }}>Simcha Rental</span>
          </div>

          {/* Center — nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexShrink: 0 }}>
            {[
              { label: 'Products', path: '/products' },
              { label: 'Inspiration Gallery', path: '/inspiration-gallery' },
              { label: 'My Orders', path: '/rental-history' },
              { label: 'Contact Us', path: '/contact' },
            ].map(({ label, path }) => (
              <span
                key={path}
                onClick={() => navigate(path)}
                style={{ position: 'relative', color: 'rgba(255,255,255,0.85)', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', paddingBottom: '6px', whiteSpace: 'nowrap', fontWeight: 400, fontFamily: 'inherit' }}
                onMouseEnter={e => { (e.currentTarget.lastChild as HTMLElement).style.width = '100%' }}
                onMouseLeave={e => { (e.currentTarget.lastChild as HTMLElement).style.width = '0%' }}
              >
                {label}
                <span style={{ position: 'absolute', bottom: 0, left: 0, width: '0%', height: '2px', background: '#d4af37', transition: 'width 0.3s ease', display: 'block' }} />
              </span>
            ))}
          </div>

          {/* Right — cart + account */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexShrink: 0 }}>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.85)', fontSize: '11px', letterSpacing: '2px', cursor: 'pointer', textTransform: 'uppercase', padding: 0, transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#d4af37')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
            >
              <ShoppingCart size={17} strokeWidth={1.5} />
              Cart
              {cartTotal > 0 && (
                <span style={{ background: '#d4af37', color: '#3b0f1f', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{cartTotal}</span>
              )}
            </button>

            {/* Divider */}
            <div style={{ width: '1px', height: '20px', background: 'rgba(212,175,55,0.3)' }} />

            {/* My Account Button */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => isAuthenticated ? setProfileOpen(p => !p) : onMyAccountClick()}
                style={{ background: 'transparent', border: '1px solid rgba(212,175,55,0.5)', color: '#d4af37', fontSize: '11px', letterSpacing: '2px', cursor: 'pointer', textTransform: 'uppercase', padding: '8px 18px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '7px' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#d4af37'; e.currentTarget.style.color = '#3b0f1f' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d4af37' }}
              >
                <User size={14} strokeWidth={1.5} />
                {isAuthenticated ? userName || 'My Account' : 'Sign In'}
              </button>

              {isAuthenticated && profileOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#2a0d1a', minWidth: '210px', boxShadow: '0 12px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(212,175,55,0.2)', overflow: 'hidden', animation: 'modalSlideIn 0.2s ease-out' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(212,175,55,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <p style={{ fontSize: '10px', color: 'rgba(212,175,55,0.6)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Signed in as</p>
                      <p style={{ fontSize: '15px', fontWeight: '500', color: '#d4af37', letterSpacing: '1px' }}>{userName}</p>
                    </div>
                    <button onClick={() => setProfileOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', lineHeight: 1, padding: 0 }}>
                      <X size={15} strokeWidth={1.5} />
                    </button>
                  </div>

                  {authService.getCurrentUser()?.role === 'Admin' && (
                    <button
                      onClick={() => { navigate('/admin'); setProfileOpen(false) }}
                      style={{ width: '100%', padding: '13px 20px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '11px', letterSpacing: '2px', textAlign: 'left', cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s', borderBottom: '1px solid rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.08)'; e.currentTarget.style.color = '#d4af37' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
                    >
                      <LayoutDashboard size={14} strokeWidth={1.5} />
                      Admin Panel
                    </button>
                  )}

                  <button
                    onClick={() => { navigate('/rental-history'); setProfileOpen(false) }}
                    style={{ width: '100%', padding: '13px 20px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '11px', letterSpacing: '2px', textAlign: 'left', cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s', borderBottom: '1px solid rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.08)'; e.currentTarget.style.color = '#d4af37' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
                  >
                    <ClipboardList size={14} strokeWidth={1.5} />
                    My Orders
                  </button>

                  <button
                    onClick={handleLogout}
                    style={{ width: '100%', padding: '13px 20px', background: 'transparent', border: 'none', color: 'rgba(255,100,100,0.85)', fontSize: '11px', letterSpacing: '2px', textAlign: 'left', cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,100,100,0.08)'; e.currentTarget.style.color = '#ff6464' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,100,100,0.85)' }}
                  >
                    <LogOut size={14} strokeWidth={1.5} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Gold accent line under nav */}
      <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #d4af37, transparent)' }} />

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* Sidebar */}
        <aside style={{ width: '240px', minWidth: '240px', background: '#faf7f5', borderRight: '1px solid #e8e8e8', padding: '30px 20px', position: 'sticky', top: '71px', height: 'calc(100vh - 71px)', overflowY: 'auto' }}>
          <h3 style={{ color: '#5c1a33', fontWeight: 400, fontSize: '1.1rem', letterSpacing: '1px', marginBottom: '20px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} strokeWidth={1.5} color="#5c1a33" />
            Filter by Category
          </h3>
          {Object.entries(CATEGORY_GROUPS).map(([group, cats]) => {
            const available = cats.filter(c => allCategories.includes(c))
            if (available.length === 0) return null
            return (
              <div key={group} style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>{group}</p>
                {available.map(cat => (
                  <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', cursor: 'pointer', fontSize: '14px' }}>
                    <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} style={{ accentColor: '#7d2e54', width: 'auto', margin: 0 }} />
                    {cat}
                  </label>
                ))}
              </div>
            )
          })}
          {allCategories.filter(c => !Object.values(CATEGORY_GROUPS).flat().includes(c)).map(cat => (
            <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} style={{ accentColor: '#7d2e54', width: 'auto', margin: 0 }} />
              {cat}
            </label>
          ))}
          {selectedCategories.length > 0 && (
            <button
              onClick={() => setSelectedCategories([])}
              style={{ marginTop: '16px', padding: '8px 14px', fontSize: '12px', background: 'transparent', color: '#7d2e54', border: '1px solid #7d2e54', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <X size={13} strokeWidth={1.5} />
              Clear Filters
            </button>
          )}
        </aside>

        {/* Products Grid */}
        <div style={{ flex: 1, padding: '30px' }}>
          <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
            <h1 style={{ fontWeight: 300, fontSize: '2rem', color: '#5c1a33', letterSpacing: '2px', margin: 0 }}>Available Items</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

              {/* Search */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e8e8e8', borderRadius: '4px', background: 'white', padding: '0 12px', gap: '8px', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                onFocusCapture={e => { (e.currentTarget as HTMLElement).style.borderColor = '#5c1a33'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 2px rgba(92,26,51,0.08)' }}
                onBlurCapture={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e8e8e8'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
              >
                <Search size={14} strokeWidth={1.5} color="#aaa" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '180px', padding: '9px 0', background: 'transparent', border: 'none', outline: 'none', color: '#333', fontSize: '13px', fontFamily: 'inherit' }}
                />
              </div>

              {/* Sort */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <SlidersHorizontal size={15} strokeWidth={1.5} color="#aaa" style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }} />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{ padding: '10px 14px 10px 32px', border: '1px solid #e8e8e8', borderRadius: '4px', fontSize: '14px', color: '#555', cursor: 'pointer', outline: 'none', appearance: 'none' }}
                >
                  <option value="default">Sort: Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {filtered.map(product => (
              <div key={product._id}
                style={{ border: '1px solid #e8e8e8', background: 'white', borderRadius: '4px', overflow: 'hidden', transition: 'box-shadow 0.3s, transform 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(92,26,51,0.15)'; e.currentTarget.style.transform = 'scale(1.03)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)' }}
                onClick={() => setSelectedProduct(product)}
              >
                <div style={{ position: 'relative' }}>
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                  )}
                  {product.quantityAvailable === 0 && (
                    <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#c0392b', color: 'white', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', padding: '4px 10px', borderRadius: '3px', textTransform: 'uppercase' }}>Out of Stock</span>
                  )}
                </div>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontWeight: 400, fontSize: '1rem', color: '#5c1a33', marginBottom: '6px' }}>{product.name}</h3>
                  <p style={{ fontSize: '12px', color: '#999', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Tag size={11} strokeWidth={1.5} />
                    {product.category}
                  </p>
                  <p style={{ fontSize: '13px', color: '#555', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <PackageCheck size={13} strokeWidth={1.5} color="#555" />
                    Available: {product.quantityAvailable}
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#d4af37', marginBottom: '14px' }}>₪{product.price || 0}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number" min={1} max={product.quantityAvailable} value={getQty(product._id)}
                      onChange={e => setQuantities(prev => ({ ...prev, [product._id]: Math.max(1, Math.min(product.quantityAvailable, Number(e.target.value))) }))}
                      style={{ width: '60px', padding: '6px', margin: 0, fontSize: '14px' }}
                      onClick={e => e.stopPropagation()}
                    />
                    <button
                      onClick={e => { e.stopPropagation(); addToCart(product) }}
                      disabled={product.quantityAvailable === 0}
                      style={{ flex: 1, padding: '8px', fontSize: '12px', letterSpacing: '1px', opacity: product.quantityAvailable === 0 ? 0.4 : 1, cursor: product.quantityAvailable === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <ShoppingBag size={13} strokeWidth={1.5} />
                      {product.quantityAvailable === 0 ? 'Unavailable' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <p style={{ color: '#999', textAlign: 'center', marginTop: '60px' }}>No products found for selected filters.</p>}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setSelectedProduct(null)}>
          <div style={{ background: 'white', borderRadius: '8px', width: '480px', maxWidth: '90vw', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
            onClick={e => e.stopPropagation()}>
            {selectedProduct.imageUrl && (
              <img src={selectedProduct.imageUrl} alt={selectedProduct.name} style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
            )}
            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h2 style={{ fontWeight: 400, fontSize: '1.5rem', color: '#5c1a33', margin: 0 }}>{selectedProduct.name}</h2>
                <button onClick={() => setSelectedProduct(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#bbb', lineHeight: 1, padding: 0 }}>
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
              <p style={{ fontSize: '12px', color: '#999', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Tag size={11} strokeWidth={1.5} />
                {selectedProduct.category}
              </p>
              <p style={{ fontSize: '14px', color: '#555', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <PackageCheck size={14} strokeWidth={1.5} color="#555" />
                Available: <strong>{selectedProduct.quantityAvailable}</strong>
              </p>
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#d4af37', marginBottom: '24px' }}>₪{selectedProduct.price || 0} per day</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number" min={1} max={selectedProduct.quantityAvailable}
                  value={getQty(selectedProduct._id)}
                  onChange={e => setQuantities(prev => ({ ...prev, [selectedProduct._id]: Math.max(1, Math.min(selectedProduct.quantityAvailable, Number(e.target.value))) }))}
                  style={{ width: '70px', padding: '10px', fontSize: '14px' }}
                  onClick={e => e.stopPropagation()}
                />
                <button
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null) }}
                  style={{ flex: 1, padding: '12px', background: '#5c1a33', color: 'white', border: 'none', fontSize: '14px', letterSpacing: '1px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}
                >
                  <ShoppingCart size={16} strokeWidth={1.5} />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '360px', height: '100vh', background: 'white', boxShadow: '-4px 0 20px rgba(0,0,0,0.15)', zIndex: 200, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontWeight: 300, fontSize: '1.5rem', color: '#5c1a33', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <ShoppingCart size={20} strokeWidth={1.5} color="#5c1a33" />
              Your Cart
            </h2>
            <button onClick={() => setCartOpen(false)} style={{ background: 'transparent', color: '#5c1a33', border: 'none', padding: '0', cursor: 'pointer' }}>
              <X size={20} strokeWidth={1.5} />
            </button>
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
                <button onClick={() => removeFromCart(item.product?._id)} style={{ background: 'transparent', color: '#bbb', border: 'none', padding: '0', cursor: 'pointer' }}>
                  <Trash2 size={15} strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div style={{ padding: '16px 20px', borderTop: '1px solid #f0f0f0', background: '#faf7f5' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '10px', color: '#aaa', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <CalendarDays size={11} strokeWidth={1.5} />
                    Start Date
                  </label>
                  <input type="date" value={startDate} min={new Date().toISOString().split('T')[0]} onChange={e => setStartDate(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #e8e8e8', borderRadius: '4px', fontSize: '12px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '10px', color: '#aaa', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <CalendarDays size={11} strokeWidth={1.5} />
                    End Date
                  </label>
                  <input type="date" value={endDate} min={startDate || new Date().toISOString().split('T')[0]} onChange={e => setEndDate(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #e8e8e8', borderRadius: '4px', fontSize: '12px' }} />
                </div>
              </div>
              {startDate && endDate && endDate > startDate && (
                <p style={{ fontSize: '13px', color: '#555', marginBottom: '10px', textAlign: 'center' }}>
                  Estimated: <strong style={{ color: '#5c1a33' }}>
                    ₪{cart.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0) *
                      Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))}
                  </strong>
                  {' '}({Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days)
                </p>
              )}
              <button
                onClick={() => {
                  if (!startDate || !endDate) return alert('Please select both dates first.')
                  if (endDate <= startDate) return alert('End date must be after start date.')
                  setCartOpen(false)
                  navigate('/checkout', { state: { startDate, endDate } })
                }}
                style={{ width: '100%', padding: '14px', background: '#5c1a33', color: 'white', border: 'none', fontSize: '14px', letterSpacing: '1px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <ArrowRightCircle size={17} strokeWidth={1.5} />
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', background: '#2d6a4f', color: 'white', padding: '12px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', animation: 'fadeInUp 0.3s ease', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} strokeWidth={1.5} />
          {toast}
        </div>
      )}
    </div>
  )
}

export default Products
