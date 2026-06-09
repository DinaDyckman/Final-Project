import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { productService } from '../services/productService'
import api from '../services/api'
import { Product } from '../types'

type Rental = {
  _id: string
  userId: string
  items: { productId: Product; quantity: number; priceAtTimeOfRental: number }[]
  startDate: string
  endDate: string
  totalPrice: number
  status: 'pending' | 'confirmed' | 'completed'
  createdAt: string
}

type Tab = 'dashboard' | 'products' | 'rentals'

function AdminPanel() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [rentalsError, setRentalsError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  // Track which rental IDs are currently being processed (for loading state on button)
  const [returningIds, setReturningIds] = useState<Set<string>>(new Set())

  // Product form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({
    name: '', category: '', quantityAvailable: 0, price: 0, imageUrl: ''
  })
  const [productError, setProductError] = useState('')
  const [productSuccess, setProductSuccess] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setRentalsError('')
    try {
      const [prods, rentalsRes] = await Promise.all([
        productService.getAll(),
        api.get('/rentals/all')
      ])
      setProducts(prods)
      setRentals(rentalsRes.data || [])
    } catch (err: any) {
      console.error('Failed to load admin data:', err)
      const status = err?.response?.status
      const msg = err?.response?.data?.message || err.message
      setRentalsError(`Failed to load rentals (${status}): ${msg}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    authService.rehydrateSession()
    const user = authService.getCurrentUser()
    if (!user) { navigate('/products'); return }
    if (user.role?.toLowerCase() !== 'admin') { navigate('/products'); return }
    loadData()
  }, [navigate, loadData])

  // ── Dashboard stats ──────────────────────────────
  const totalRevenue = rentals.reduce((sum, r) => sum + (r.totalPrice || 0), 0)
  const totalRentals = rentals.length
  const pendingRentals = rentals.filter(r => r.status === 'pending').length

  const productRentCount: Record<string, { name: string; count: number }> = {}
  rentals.forEach(r => {
    if (r.items && Array.isArray(r.items)) {
      r.items.forEach(item => {
        const id = item.productId?._id
        const name = item.productId?.name || 'Unknown Product'
        if (id) {
          if (!productRentCount[id]) productRentCount[id] = { name, count: 0 }
          productRentCount[id].count += item.quantity || 0
        }
      })
    }
  })
  const topProduct = Object.values(productRentCount).sort((a, b) => b.count - a.count)[0]

  // ── Product handlers ─────────────────────────────
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProductError('')
    setProductSuccess('')
    try {
      if (editingProduct) {
        await productService.update(editingProduct._id, productForm)
        setProductSuccess('Product updated successfully!')
        setProducts(prev => prev.map(p => p._id === editingProduct._id ? { ...p, ...productForm } : p))
      } else {
        const newProduct = await productService.create(productForm)
        setProductSuccess('Product added successfully!')
        setProducts(prev => [...prev, newProduct])
      }
      setProductForm({ name: '', category: '', quantityAvailable: 0, price: 0, imageUrl: '' })
      setEditingProduct(null)
    } catch (err: any) {
      setProductError(err.response?.data?.message || 'Failed to save product.')
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      category: product.category,
      quantityAvailable: product.quantityAvailable,
      price: product.price,
      imageUrl: product.imageUrl || ''
    })
    setProductSuccess('')
    setProductError('')
  }

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await productService.delete(id)
      setProducts(prev => prev.filter(p => p._id !== id))
    } catch {
      alert('Failed to delete product.')
    }
  }

  // ── Rental handlers ──────────────────────────────
  const handleStatusChange = async (rentalId: string, status: string) => {
    try {
      await api.patch(`/rentals/${rentalId}/status`, { status })
      setRentals(prev => prev.map(r => r._id === rentalId ? { ...r, status: status as any } : r))
    } catch {
      alert('Failed to update status.')
    }
  }

  // ── NEW: Mark as Returned handler ────────────────
  // Calls PATCH /api/rentals/:id/return which:
  //   1. Sets rental status → 'completed'
  //   2. Loops through items and restores each product's quantityAvailable in DB
  const handleMarkReturned = async (rentalId: string) => {
    const confirmed = window.confirm(
      'Mark this rental as returned?\n\nThis will set the status to "Completed" and restore the product inventory.'
    )
    if (!confirmed) return

    setReturningIds(prev => new Set(prev).add(rentalId))
    try {
      await api.patch(`/rentals/${rentalId}/return`)
      // Instantly update UI — no need to refetch
      setRentals(prev =>
        prev.map(r => r._id === rentalId ? { ...r, status: 'completed' } : r)
      )
      alert('✅ Rental marked as returned. Inventory has been restored.')
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to mark as returned.'
      alert(`❌ Error: ${msg}`)
    } finally {
      setReturningIds(prev => {
        const next = new Set(prev)
        next.delete(rentalId)
        return next
      })
    }
  }

  const filteredRentals = rentals.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    const matchesSearch =
      (r._id && r._id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.userId && typeof r.userId === 'string' && r.userId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.items && Array.isArray(r.items) && r.items.some(i => i.productId && i.productId.name && i.productId.name.toLowerCase().includes(searchQuery.toLowerCase())))
    return matchesStatus && matchesSearch
  })

  // ── Styles ───────────────────────────────────────
  const tabStyle = (tab: Tab) => ({
    padding: '12px 24px',
    background: activeTab === tab ? '#5c1a33' : 'transparent',
    color: activeTab === tab ? 'white' : '#5c1a33',
    border: '1px solid #5c1a33',
    cursor: 'pointer',
    fontSize: '14px',
    letterSpacing: '1px',
    transition: 'all 0.2s'
  })

  const statusColor = (status: string) => ({
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    completed: '#10b981'
  }[status] || '#999')

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#5c1a33', fontSize: '18px' }}>
      Loading admin panel...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#faf7f5' }}>

      {/* Header */}
      <nav style={{ backgroundColor: '#5c1a33', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ color: 'white', fontSize: '20px', fontWeight: 300, letterSpacing: '2px' }}>Admin Panel</span>
          <span style={{ color: '#d4af37', fontSize: '13px', marginLeft: '12px', letterSpacing: '1px' }}>Upscale Simcha Rental</span>
        </div>
        <button
          onClick={() => navigate('/products')}
          style={{ background: 'transparent', border: '1px solid rgba(212,175,55,0.6)', color: '#d4af37', padding: '8px 18px', cursor: 'pointer', fontSize: '13px', letterSpacing: '1px' }}
        >
          ← Back to Store
        </button>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '30px' }}>
          <button style={tabStyle('dashboard')} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
          <button style={tabStyle('products')} onClick={() => setActiveTab('products')}>📦 Products</button>
          <button style={tabStyle('rentals')} onClick={() => setActiveTab('rentals')}>📋 Rentals</button>
        </div>

        {/* ── DASHBOARD TAB ── */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 style={{ color: '#5c1a33', fontWeight: 300, letterSpacing: '2px', marginBottom: '24px' }}>Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              {[
                { label: 'Total Rentals', value: totalRentals, color: '#5c1a33' },
                { label: 'Total Revenue', value: `₪${totalRevenue.toLocaleString()}`, color: '#10b981' },
                { label: 'Pending Orders', value: pendingRentals, color: '#f59e0b' },
                { label: 'Total Products', value: products.length, color: '#3b82f6' },
              ].map(stat => (
                <div key={stat.label} style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${stat.color}` }}>
                  <div style={{ fontSize: '28px', fontWeight: '600', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '13px', color: '#999', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
            {topProduct && (
              <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', maxWidth: '400px' }}>
                <h3 style={{ color: '#5c1a33', fontWeight: 400, marginBottom: '12px' }}>🏆 Most Rented Product</h3>
                <p style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>{topProduct.name}</p>
                <p style={{ color: '#999', fontSize: '14px' }}>Rented {topProduct.count} times</p>
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {activeTab === 'products' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ color: '#5c1a33', fontWeight: 400, letterSpacing: '1px', marginBottom: '24px' }}>
                {editingProduct ? ' Edit Product' : '➕ Add New Product'}
              </h3>
              {productSuccess && <p style={{ color: '#10b981', background: '#f0fdf4', padding: '10px', borderRadius: '4px', marginBottom: '16px' }}>{productSuccess}</p>}
              {productError && <p style={{ color: '#ef4444', background: '#fef2f2', padding: '10px', borderRadius: '4px', marginBottom: '16px' }}>{productError}</p>}
              <form onSubmit={handleProductSubmit}>
                {[
                  { label: 'Product Name', key: 'name', type: 'text' },
                  { label: 'Category', key: 'category', type: 'text' },
                  { label: 'Quantity Available', key: 'quantityAvailable', type: 'number' },
                  { label: 'Price per Day (₪)', key: 'price', type: 'number' },
                  { label: 'Image URL (optional)', key: 'imageUrl', type: 'text' },
                ].map(field => (
                  <div key={field.key} style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#999', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>{field.label}</label>
                    <input
                      type={field.type}
                      value={(productForm as any)[field.key]}
                      onChange={e => setProductForm(prev => ({ ...prev, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value }))}
                      required={field.key !== 'imageUrl'}
                      style={{ width: '100%', padding: '10px', border: '1px solid #e8e8e8', borderRadius: '4px', fontSize: '14px' }}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" style={{ flex: 1, padding: '12px', background: '#5c1a33', color: 'white', border: 'none', cursor: 'pointer', fontSize: '14px', letterSpacing: '1px' }}>
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  {editingProduct && (
                    <button type="button" onClick={() => { setEditingProduct(null); setProductForm({ name: '', category: '', quantityAvailable: 0, price: 0, imageUrl: '' }) }}
                      style={{ padding: '12px 20px', background: 'transparent', color: '#5c1a33', border: '1px solid #5c1a33', cursor: 'pointer', fontSize: '14px' }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
                <h3 style={{ color: '#5c1a33', fontWeight: 400, letterSpacing: '1px' }}>All Products ({products.length})</h3>
              </div>
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {products.map(product => (
                  <div key={product._id} style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f9f9f9', gap: '12px' }}>
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt={product.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 500, color: '#333', marginBottom: '2px' }}>{product.name}</p>
                      <p style={{ fontSize: '12px', color: '#999' }}>{product.category} · ₪{product.price}/day · Qty: {product.quantityAvailable}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEditProduct(product)}
                        style={{ padding: '6px 12px', background: 'transparent', color: '#5c1a33', border: '1px solid #5c1a33', cursor: 'pointer', fontSize: '12px' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProduct(product._id)}
                        style={{ padding: '6px 12px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', cursor: 'pointer', fontSize: '12px' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── RENTALS TAB ── */}
        {activeTab === 'rentals' && (
          <div>
            {rentalsError && (
              <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
                ⚠️ {rentalsError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <input
                type="text"
                placeholder="Search by user ID, order ID or product name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ flex: 1, padding: '10px 16px', border: '1px solid #e8e8e8', borderRadius: '4px', fontSize: '14px' }}
              />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{ padding: '10px 16px', border: '1px solid #e8e8e8', borderRadius: '4px', fontSize: '14px', color: '#333' }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
                <h3 style={{ color: '#5c1a33', fontWeight: 400, letterSpacing: '1px' }}>
                  All Rentals ({filteredRentals.length})
                </h3>
              </div>
              {filteredRentals.length === 0 ? (
                <p style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No rentals found.</p>
              ) : filteredRentals.map(rental => (
                <div key={rental._id} style={{ padding: '20px 24px', borderBottom: '1px solid #f9f9f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Order ID: {rental._id}</p>
                      <p style={{ fontSize: '13px', color: '#666' }}>User: {rental.userId || 'Unknown'}</p>
                      <p style={{ fontSize: '13px', color: '#666' }}>
                        {rental.startDate ? new Date(rental.startDate).toLocaleDateString('he-IL') : ''} → {rental.endDate ? new Date(rental.endDate).toLocaleDateString('he-IL') : ''}
                      </p>
                    </div>

                    {/* ── RIGHT SIDE: price + status dropdown + Mark Returned button ── */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <p style={{ fontSize: '18px', fontWeight: '600', color: '#5c1a33', margin: 0 }}>
                        ₪{(rental.totalPrice || 0).toLocaleString()}
                      </p>

                      <select
                        value={rental.status}
                        onChange={e => handleStatusChange(rental._id, e.target.value)}
                        style={{ padding: '6px 12px', border: `1px solid ${statusColor(rental.status)}`, borderRadius: '4px', color: statusColor(rental.status), fontSize: '13px', cursor: 'pointer' }}
                      >
                        <option value="pending"> Pending</option>
                        <option value="confirmed"> Confirmed</option>
                        <option value="completed"> Completed</option>
                      </select>

                      {/* ── NEW: Mark Returned button — only shown when NOT yet completed ── */}
                      {rental.status !== 'completed' && (
                        <button
                          onClick={() => handleMarkReturned(rental._id)}
                          disabled={returningIds.has(rental._id)}
                          style={{
                            padding: '6px 14px',
                            background: returningIds.has(rental._id) ? '#e8e8e8' : '#10b981',
                            color: returningIds.has(rental._id) ? '#999' : 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: returningIds.has(rental._id) ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            letterSpacing: '0.5px',
                            fontWeight: 500,
                            transition: 'background 0.2s'
                          }}
                        >
                          {returningIds.has(rental._id) ? 'Processing...' : '↩ Mark Returned'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {rental.items && Array.isArray(rental.items) && rental.items.map((item, i) => (
                      <span key={i} style={{ background: '#faf7f5', border: '1px solid #e8e8e8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', color: '#666' }}>
                        {item.productId?.name || 'Unknown Product'} × {item.quantity || 0}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel