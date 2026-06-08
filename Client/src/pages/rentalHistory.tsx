import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import api from '../services/api'

// ─── Types ───────────────────────────────────────────────────────────────────
type RentalProduct = {
  _id: string
  name: string
  imageUrl?: string
  price: number
  category: string
}

type RentalItem = {
  productId: RentalProduct
  quantity: number
  priceAtTimeOfRental: number
}

type Rental = {
  _id: string
  items: RentalItem[]
  startDate: string
  endDate: string
  totalPrice: number
  status: 'pending' | 'confirmed' | 'completed'
  createdAt: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const statusConfig = {
  pending:   { label: 'Pending',   color: '#f59e0b', bg: '#fffbeb', icon: '⏳' },
  confirmed: { label: 'Confirmed', color: '#3b82f6', bg: '#eff6ff', icon: '✅' },
  completed: { label: 'Completed', color: '#10b981', bg: '#f0fdf4', icon: '🏁' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('he-IL', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
}

// ─── Component ────────────────────────────────────────────────────────────────
function RentalHistory() {
  const navigate = useNavigate()
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    // Rehydrate session first (handles "rememberMe" users after page refresh)
    authService.rehydrateSession()
    const user = authService.getCurrentUser()

    if (!user) {
      navigate('/login')
      return
    }

    const fetchMyRentals = async () => {
      setLoading(true)
      setError('')
      try {
        // GET /api/rentals/my-rentals — uses the JWT token in the request header.
        // The backend extracts the userId from the token via authMiddleware.
        const res = await api.get('/rentals/my-rentals')
        setRentals(res.data || [])
      } catch (err: any) {
        const msg = err?.response?.data?.message || 'Failed to load your rental history.'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }

    fetchMyRentals()
  }, [navigate])

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  // ── Render: Loading ──────────────────────────────────────────────────────
  if (loading) return (
    <div style={styles.centered}>
      <div style={styles.spinner} />
      <p style={{ color: '#5c1a33', marginTop: '16px', letterSpacing: '1px' }}>Loading your orders...</p>
    </div>
  )

  // ── Render: Error ────────────────────────────────────────────────────────
  if (error) return (
    <div style={styles.centered}>
      <div style={{ background: '#fef2f2', color: '#ef4444', padding: '20px 28px', borderRadius: '8px', textAlign: 'center', maxWidth: '420px' }}>
        <p style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</p>
        <p style={{ fontWeight: 500 }}>{error}</p>
        <button onClick={() => navigate('/products')} style={styles.backBtn}>Back to Store</button>
      </div>
    </div>
  )

  // ── Render: Main ─────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#faf7f5' }}>

      {/* ── Header ── */}
      <nav style={styles.nav}>
        <div>
          <span style={{ color: 'white', fontSize: '20px', fontWeight: 300, letterSpacing: '2px' }}>My Orders</span>
          <span style={{ color: '#d4af37', fontSize: '13px', marginLeft: '12px', letterSpacing: '1px' }}>Upscale Simcha Rental</span>
        </div>
        <button onClick={() => navigate('/products')} style={styles.navBtn}>
          ← Back to Store
        </button>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        <h2 style={{ color: '#5c1a33', fontWeight: 300, letterSpacing: '2px', marginBottom: '8px' }}>
          Rental History
        </h2>
        <p style={{ color: '#999', fontSize: '14px', marginBottom: '32px' }}>
          {rentals.length === 0
            ? 'You have no rentals yet.'
            : `Showing ${rentals.length} order${rentals.length !== 1 ? 's' : ''}`}
        </p>

        {/* ── Empty state ── */}
        {rentals.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '48px', marginBottom: '12px' }}>🛍️</p>
            <p style={{ color: '#5c1a33', fontSize: '18px', fontWeight: 300, marginBottom: '8px' }}>No orders yet</p>
            <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px' }}>Browse our collection and make your first rental!</p>
            <button onClick={() => navigate('/products')} style={{ ...styles.backBtn, display: 'inline-block' }}>
              Browse Products
            </button>
          </div>
        )}

        {/* ── Rental cards ── */}
        {rentals.map(rental => {
          const sc = statusConfig[rental.status] || statusConfig.pending
          const isExpanded = expandedId === rental._id

          return (
            <div key={rental._id} style={styles.card}>

              {/* Card Header */}
              <div style={styles.cardHeader}>
                <div>
                  {/* Status badge */}
                  <span style={{ ...styles.badge, color: sc.color, background: sc.bg }}>
                    {sc.icon} {sc.label}
                  </span>
                  <p style={{ fontSize: '11px', color: '#bbb', marginTop: '8px', fontFamily: 'monospace' }}>
                    Order #{rental._id}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '22px', fontWeight: '600', color: '#5c1a33', margin: 0 }}>
                    ₪{(rental.totalPrice || 0).toLocaleString()}
                  </p>
                  <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                    Ordered {formatDate(rental.createdAt)}
                  </p>
                </div>
              </div>

              {/* Dates row */}
              <div style={styles.datesRow}>
                <div style={styles.dateBox}>
                  <span style={styles.dateLabel}>Start Date</span>
                  <span style={styles.dateValue}>📅 {formatDate(rental.startDate)}</span>
                </div>
                <div style={{ color: '#ccc', fontSize: '20px', alignSelf: 'center' }}>→</div>
                <div style={styles.dateBox}>
                  <span style={styles.dateLabel}>End Date</span>
                  <span style={styles.dateValue}>📅 {formatDate(rental.endDate)}</span>
                </div>
                <div style={{ flex: 1 }} />
                {/* Toggle items */}
                <button
                  onClick={() => toggleExpand(rental._id)}
                  style={styles.toggleBtn}
                >
                  {isExpanded ? '▲ Hide Items' : `▼ Show Items (${rental.items?.length || 0})`}
                </button>
              </div>

              {/* Expandable items list */}
              {isExpanded && (
                <div style={styles.itemsList}>
                  {rental.items && rental.items.length > 0 ? rental.items.map((item, idx) => {
                    const product = item.productId
                    return (
                      <div key={idx} style={styles.itemRow}>
                        {/* Product image or placeholder */}
                        {product?.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={styles.itemImg}
                          />
                        ) : (
                          <div style={styles.itemImgPlaceholder}>🎪</div>
                        )}

                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 500, color: '#333', margin: '0 0 2px' }}>
                            {product?.name || 'Unknown Product'}
                          </p>
                          <p style={{ fontSize: '12px', color: '#aaa', margin: 0 }}>
                            {product?.category || ''}
                          </p>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <p style={{ color: '#5c1a33', fontWeight: 500, margin: '0 0 2px' }}>
                            ×{item.quantity}
                          </p>
                          <p style={{ fontSize: '12px', color: '#aaa', margin: 0 }}>
                            ₪{item.priceAtTimeOfRental}/day each
                          </p>
                        </div>
                      </div>
                    )
                  }) : (
                    <p style={{ color: '#aaa', fontSize: '13px', padding: '12px 0' }}>No items found.</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  centered: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '100vh', background: '#faf7f5'
  },
  spinner: {
    width: '36px', height: '36px', borderRadius: '50%',
    border: '3px solid #e8e8e8', borderTop: '3px solid #5c1a33',
    animation: 'spin 0.8s linear infinite'
  },
  nav: {
    backgroundColor: '#5c1a33', padding: '15px 30px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  navBtn: {
    background: 'transparent', border: '1px solid rgba(212,175,55,0.6)',
    color: '#d4af37', padding: '8px 18px', cursor: 'pointer',
    fontSize: '13px', letterSpacing: '1px'
  },
  backBtn: {
    marginTop: '16px', padding: '10px 24px', background: '#5c1a33',
    color: 'white', border: 'none', borderRadius: '4px',
    cursor: 'pointer', fontSize: '14px', letterSpacing: '1px'
  },
  card: {
    background: 'white', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
    marginBottom: '20px', overflow: 'hidden',
    border: '1px solid #f0f0f0'
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', padding: '20px 24px',
    borderBottom: '1px solid #f7f7f7'
  },
  badge: {
    display: 'inline-block', padding: '4px 12px',
    borderRadius: '20px', fontSize: '12px',
    fontWeight: 500, letterSpacing: '0.5px'
  },
  datesRow: {
    display: 'flex', alignItems: 'flex-start', gap: '16px',
    padding: '16px 24px', borderBottom: '1px solid #f7f7f7',
    flexWrap: 'wrap'
  },
  dateBox: {
    display: 'flex', flexDirection: 'column', gap: '4px'
  },
  dateLabel: {
    fontSize: '11px', color: '#bbb',
    textTransform: 'uppercase', letterSpacing: '0.8px'
  },
  dateValue: {
    fontSize: '14px', color: '#444', fontWeight: 500
  },
  toggleBtn: {
    padding: '6px 14px', background: 'transparent',
    color: '#5c1a33', border: '1px solid #e0cdd6',
    borderRadius: '4px', cursor: 'pointer',
    fontSize: '12px', letterSpacing: '0.5px',
    alignSelf: 'center'
  },
  itemsList: {
    padding: '12px 24px 20px'
  },
  itemRow: {
    display: 'flex', alignItems: 'center', gap: '14px',
    padding: '12px 0', borderBottom: '1px solid #f9f9f9'
  },
  itemImg: {
    width: '52px', height: '52px',
    objectFit: 'cover', borderRadius: '6px',
    border: '1px solid #f0f0f0'
  },
  itemImgPlaceholder: {
    width: '52px', height: '52px', borderRadius: '6px',
    background: '#faf7f5', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', border: '1px solid #f0f0f0'
  }
}

export default RentalHistory