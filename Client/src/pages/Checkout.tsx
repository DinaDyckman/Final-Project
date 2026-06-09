import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { cartService } from '../services/cartService'
import api from '../services/api'
import { CartItem } from '../types'

// ─── Types ────────────────────────────────────────────────────────────────────
interface CheckoutProps {
  cart: CartItem[]
  setCart: (cart: CartItem[]) => void
  userId: string
}

type DeliveryMethod = 'delivery' | 'pickup'
type CheckoutStep = 'form' | 'processing' | 'success'

// ─── Component ────────────────────────────────────────────────────────────────
function Checkout({ cart, setCart, userId }: CheckoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { startDate, endDate } = (location.state as any) || {}

  const [step, setStep] = useState<CheckoutStep>('form')
  const [confirmationNumber, setConfirmationNumber] = useState('')

  // Form fields
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [eventAddress, setEventAddress] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ── Price calculation ──────────────────────────────────────────────────────
  const days = startDate && endDate
    ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 1
  const subtotal = cart.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity * days, 0)
  const deliveryFee = deliveryMethod === 'delivery' ? 150 : 0
  const total = subtotal + deliveryFee

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {}
    if (!fullName.trim()) e.fullName = 'Full name is required'
    if (!phone.trim() || phone.replace(/\D/g, '').length < 9) e.phone = 'Valid phone number required'
    if (deliveryMethod === 'delivery' && !eventAddress.trim()) e.eventAddress = 'Delivery address is required'
    if (cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Card number must be 16 digits'
    if (!expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = 'Format: MM/YY'
    if (cvv.length < 3) e.cvv = 'CVV must be 3–4 digits'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return

    setStep('processing')

    // Simulate payment gateway delay (2.5s)
    await new Promise(resolve => setTimeout(resolve, 2500))

    try {
      const items = cart.map(i => ({ productId: i.product._id, quantity: i.quantity }))
      const { data } = await api.post('/rentals/checkout', {
        userId, items, startDate, endDate
      })

      await cartService.clearCart()
      setCart([])

      // Generate confirmation number
      const conf = 'USR-' + Math.random().toString(36).substring(2, 8).toUpperCase()
      setConfirmationNumber(conf)
      setStep('success')

    } catch (err) {
      setStep('form')
      setErrors({ submit: 'Payment failed. Please try again.' })
    }
  }

  // ── Card number formatter ──────────────────────────────────────────────────
  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
    return digits
  }

  // ── Render: Processing ─────────────────────────────────────────────────────
  if (step === 'processing') return (
    <div style={styles.centered}>
      <div style={styles.processingCard}>
        <div style={styles.spinner} />
        <p style={{ color: '#5c1a33', fontSize: '18px', fontWeight: 300, letterSpacing: '2px', marginTop: '24px' }}>
          Processing Secure Payment
        </p>
        <p style={{ color: '#aaa', fontSize: '13px', marginTop: '8px' }}>
          Please do not close this window...
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '20px' }}>
          <span style={styles.lockIcon}></span>
          <span style={{ fontSize: '11px', color: '#bbb', letterSpacing: '1px' }}>256-BIT SSL ENCRYPTED</span>
        </div>
      </div>
    </div>
  )

  // ── Render: Success ────────────────────────────────────────────────────────
  if (step === 'success') return (
    <div style={styles.centered}>
      <div style={styles.successCard}>
        <div style={styles.successIcon}>✓</div>
        <h2 style={{ color: '#5c1a33', fontWeight: 300, letterSpacing: '2px', margin: '20px 0 8px' }}>
          Order Confirmed
        </h2>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '28px' }}>
          Thank you for choosing Upscale Simcha Rental
        </p>
        <div style={styles.confBox}>
          <p style={{ fontSize: '11px', color: '#bbb', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            Confirmation Number
          </p>
          <p style={{ fontSize: '22px', fontWeight: '600', color: '#5c1a33', letterSpacing: '3px', fontFamily: 'monospace' }}>
            {confirmationNumber}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '28px' }}>
          <button onClick={() => navigate('/rental-history')} style={styles.primaryBtn}>
            View My Orders
          </button>
          <button onClick={() => navigate('/products')} style={styles.ghostBtn}>
            Back to Store
          </button>
        </div>
      </div>
    </div>
  )

  // ── Render: Main form ──────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#faf7f5' }}>

      {/* Nav */}
      <nav style={styles.nav}>
        <div>
          <span style={{ color: 'white', fontSize: '20px', fontWeight: 300, letterSpacing: '2px' }}>Checkout</span>
          <span style={{ color: '#d4af37', fontSize: '13px', marginLeft: '12px', letterSpacing: '1px' }}>Upscale Simcha Rental</span>
        </div>
        <button onClick={() => navigate('/products')} style={styles.navBtn}>← Back to Store</button>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>

        {/* ── Left: Form ── */}
        <div style={{ flex: 2, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Shipping & Event Details */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.stepNum}>1</span> Shipping & Event Details
            </h3>

            <div style={styles.fieldGroup}>
              <Field label="Full Name" error={errors.fullName}>
                <input
                  style={{ ...styles.input, ...(errors.fullName ? styles.inputError : {}) }}
                  placeholder="e.g. Sara Cohen"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </Field>

              <Field label="Phone Number" error={errors.phone}>
                <input
                  style={{ ...styles.input, ...(errors.phone ? styles.inputError : {}) }}
                  placeholder="e.g. 054-123-4567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </Field>
            </div>

            <Field label="Delivery Method" error="">
              <div style={{ display: 'flex', gap: '12px' }}>
                {(['delivery', 'pickup'] as DeliveryMethod[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setDeliveryMethod(m)}
                    style={{
                      ...styles.methodBtn,
                      ...(deliveryMethod === m ? styles.methodBtnActive : {})
                    }}
                  >
                    {m === 'delivery' ? 'Delivery to Event' : 'Self-Pickup'}
                  </button>
                ))}
              </div>
            </Field>

            {deliveryMethod === 'delivery' && (
              <Field label="Event Address / Location" error={errors.eventAddress}>
                <input
                  style={{ ...styles.input, ...(errors.eventAddress ? styles.inputError : {}) }}
                  placeholder="e.g. 12 HaNassi St, Tel Aviv"
                  value={eventAddress}
                  onChange={e => setEventAddress(e.target.value)}
                />
              </Field>
            )}

            <div style={styles.fieldGroup}>
              <Field label="Rental Start Date" error="">
                <input style={{ ...styles.input, background: '#f7f7f7', color: '#aaa' }} value={startDate || '—'} disabled />
              </Field>
              <Field label="Rental End Date" error="">
                <input style={{ ...styles.input, background: '#f7f7f7', color: '#aaa' }} value={endDate || '—'} disabled />
              </Field>
            </div>
          </section>

          {/* Payment */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.stepNum}>2</span> Payment Details
              <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#bbb', letterSpacing: '1px', fontWeight: 400 }}> SSL SECURED</span>
            </h3>

            
            

            <Field label="Card Number" error={errors.cardNumber}>
              <input
                style={{ ...styles.input, fontFamily: 'monospace', letterSpacing: '2px', ...(errors.cardNumber ? styles.inputError : {}) }}
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={e => setCardNumber(formatCard(e.target.value))}
                maxLength={19}
              />
            </Field>

            <div style={styles.fieldGroup}>
              <Field label="Expiry Date" error={errors.expiry}>
                <input
                  style={{ ...styles.input, ...(errors.expiry ? styles.inputError : {}) }}
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                />
              </Field>
              <Field label="CVV" error={errors.cvv}>
                <input
                  style={{ ...styles.input, ...(errors.cvv ? styles.inputError : {}) }}
                  placeholder="•••"
                  type="password"
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                />
              </Field>
            </div>

            {errors.submit && (
              <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px' }}>⚠️ {errors.submit}</p>
            )}
          </section>
        </div>

        {/* ── Right: Order Summary ── */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ ...styles.section, position: 'sticky', top: '24px' }}>
            <h3 style={styles.sectionTitle}>Order Summary</h3>

            <div style={{ marginBottom: '20px' }}>
              {cart.map(item => (
                <div key={item.product._id} style={styles.summaryItem}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', color: '#333', fontWeight: 500, margin: '0 0 2px' }}>
                      {item.product.name}
                    </p>
                    <p style={{ fontSize: '12px', color: '#aaa', margin: 0 }}>
                      ×{item.quantity} · {days} day{days !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <p style={{ fontSize: '14px', color: '#5c1a33', fontWeight: 500, margin: 0 }}>
                    ₪{((item.product.price || 0) * item.quantity * days).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div style={styles.divider} />

            <div style={styles.summaryRow}>
              <span style={{ color: '#777' }}>Subtotal</span>
              <span>₪{subtotal.toLocaleString()}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={{ color: '#777' }}>
                {deliveryMethod === 'delivery' ? 'Delivery Fee' : 'Pickup'}
              </span>
              <span style={{ color: deliveryMethod === 'pickup' ? '#10b981' : '#333' }}>
                {deliveryMethod === 'pickup' ? 'Free' : `₪${deliveryFee}`}
              </span>
            </div>

            <div style={styles.divider} />

            <div style={{ ...styles.summaryRow, marginTop: '12px' }}>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#5c1a33' }}>Total</span>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#5c1a33' }}>
                ₪{total.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleSubmit}
              style={{ ...styles.primaryBtn, marginTop: '24px', width: '100%' }}
            >
              Place Order · ₪{total.toLocaleString()}
            </button>

            <p style={{ fontSize: '11px', color: '#bbb', textAlign: 'center', marginTop: '12px', letterSpacing: '0.5px' }}>
               Your payment is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
      <label style={{ fontSize: '11px', color: '#999', letterSpacing: '1px', textTransform: 'uppercase' }}>
        {label}
      </label>
      {children}
      {error && <p style={{ fontSize: '11px', color: '#ef4444', margin: 0 }}>{error}</p>}
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  centered: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', background: '#faf7f5'
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
  section: {
    background: 'white', borderRadius: '10px',
    padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    border: '1px solid #f0f0f0', display: 'flex',
    flexDirection: 'column', gap: '18px'
  },
  sectionTitle: {
    color: '#5c1a33', fontWeight: 400, fontSize: '16px',
    letterSpacing: '1px', margin: 0, display: 'flex',
    alignItems: 'center', gap: '10px'
  },
  stepNum: {
    background: '#5c1a33', color: 'white',
    borderRadius: '50%', width: '24px', height: '24px',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: '600', flexShrink: 0
  },
  fieldGroup: {
    display: 'flex', gap: '16px', flexWrap: 'wrap'
  },
  input: {
    padding: '11px 14px', border: '1px solid #e8e8e8',
    borderRadius: '6px', fontSize: '14px', outline: 'none',
    width: '100%', boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s', background: 'white'
  },
  inputError: {
    borderColor: '#ef4444'
  },
  methodBtn: {
    flex: 1, padding: '12px', border: '1px solid #e8e8e8',
    borderRadius: '6px', background: 'white', cursor: 'pointer',
    fontSize: '13px', color: '#555', transition: 'all 0.2s'
  },
  methodBtnActive: {
    border: '1px solid #5c1a33', background: '#fdf7f9',
    color: '#5c1a33', fontWeight: 500
  },
  mockCard: {
    background: 'linear-gradient(135deg, #5c1a33 0%, #3a0f20 100%)',
    borderRadius: '12px', padding: '24px', marginBottom: '4px',
    boxShadow: '0 8px 24px rgba(92,26,51,0.3)'
  },
  summaryItem: {
    display: 'flex', alignItems: 'flex-start', gap: '12px',
    paddingBottom: '12px', borderBottom: '1px solid #f5f5f5', marginBottom: '12px'
  },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', fontSize: '14px', color: '#333'
  },
  divider: {
    height: '1px', background: '#f0f0f0', margin: '4px 0'
  },
  primaryBtn: {
    padding: '14px 24px', background: '#5c1a33',
    color: 'white', border: 'none', borderRadius: '6px',
    fontSize: '14px', letterSpacing: '1px', cursor: 'pointer',
    fontWeight: 500
  },
  ghostBtn: {
    padding: '12px 24px', background: 'transparent',
    color: '#5c1a33', border: '1px solid #5c1a33', borderRadius: '6px',
    fontSize: '14px', letterSpacing: '1px', cursor: 'pointer'
  },
  processingCard: {
    background: 'white', borderRadius: '12px', padding: '60px 48px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.1)', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center'
  },
  spinner: {
    width: '48px', height: '48px', borderRadius: '50%',
    border: '3px solid #f0e8ec', borderTop: '3px solid #5c1a33',
    animation: 'spin 0.9s linear infinite'
  },
  lockIcon: {
    fontSize: '14px'
  },
  successCard: {
    background: 'white', borderRadius: '12px', padding: '60px 48px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.1)', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    maxWidth: '420px', width: '90%'
  },
  successIcon: {
    width: '64px', height: '64px', borderRadius: '50%',
    background: '#f0fdf4', border: '2px solid #10b981',
    color: '#10b981', fontSize: '28px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontWeight: '700'
  },
  confBox: {
    background: '#faf7f5', border: '1px solid #e8e8e8',
    borderRadius: '8px', padding: '20px 32px', textAlign: 'center'
  }
}

export default Checkout