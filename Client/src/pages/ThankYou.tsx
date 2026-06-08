import { useLocation, useNavigate } from 'react-router-dom'

function ThankYou() {
  const location = useLocation()
  const navigate = useNavigate()
  const totalPrice = location.state?.totalPrice

  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1 style={{ color: '#5c1a33', fontWeight: 300, fontSize: '2.5rem', letterSpacing: '3px', marginBottom: '20px' }}>Thank You!</h1>
      <div style={{ width: '60px', height: '2px', background: '#d4af37', margin: '0 auto 30px' }} />
      <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '20px' }}>Your rental order has been placed successfully!</p>
      {totalPrice !== undefined && (
        <p style={{ fontSize: '1.4rem', fontWeight: 300, color: '#5c1a33', marginBottom: '40px' }}>
          Total Price: <span style={{ color: '#d4af37', fontWeight: 400 }}>${totalPrice}</span>
        </p>
      )}
      <button onClick={() => navigate('/products')} style={{ padding: '14px 40px', letterSpacing: '2px' }}>
        Continue Shopping
      </button>
    </div>
  )
}

export default ThankYou
