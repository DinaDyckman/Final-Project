interface AiPromoReminderProps {
  onClose: () => void
}

function AiPromoReminder({ onClose }: AiPromoReminderProps) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 999998,
      animation: 'fadeIn 0.4s ease'
    }}>
      <div style={{
        background: '#fff',
        width: '100%',
        maxWidth: '520px',
        borderRadius: '4px',
        boxShadow: '0 30px 80px rgba(92, 26, 51, 0.35)',
        overflow: 'hidden',
        animation: 'modalSlideIn 0.45s ease-out',
        position: 'relative'
      }}>

        {/* X Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '14px', right: '16px',
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.75)', fontSize: '20px',
            cursor: 'pointer', zIndex: 2, lineHeight: 1,
            transition: 'color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
        >✕</button>

        {/* Top burgundy header */}
        <div style={{
          background: 'linear-gradient(140deg, #5c1a33 0%, #7d2e54 60%, #5c1a33 100%)',
          padding: '44px 40px 36px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '160px', height: '160px', borderRadius: '50%', border: '1px solid rgba(212,175,55,0.2)' }} />
          <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', border: '1px solid rgba(212,175,55,0.15)' }} />
          <div style={{ position: 'absolute', top: '-20px', right: '60px', width: '80px', height: '80px', borderRadius: '50%', border: '1px solid rgba(212,175,55,0.1)' }} />

          <div style={{
            display: 'inline-block',
            border: '1px solid rgba(212,175,55,0.5)',
            color: '#d4af37', fontSize: '10px', letterSpacing: '3px',
            textTransform: 'uppercase', padding: '4px 14px', borderRadius: '20px',
            marginBottom: '18px', position: 'relative', zIndex: 1
          }}>New Feature</div>

          <h2 style={{
            color: '#d4af37', fontSize: '1.9rem', fontWeight: '300',
            letterSpacing: '3px', margin: '0 0 10px',
            fontFamily: "'Segoe UI', sans-serif", position: 'relative', zIndex: 1
          }}>AI Event Assistant</h2>

          <p style={{
            color: 'rgba(255,255,255,0.65)', fontSize: '12px',
            letterSpacing: '2px', textTransform: 'uppercase',
            margin: 0, position: 'relative', zIndex: 1
          }}>Upscale Simcha Rental</p>
        </div>

        {/* Bottom content */}
        <div style={{ padding: '34px 40px 38px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '26px' }}>
            <div style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
            <div style={{ width: '6px', height: '6px', background: '#d4af37', transform: 'rotate(45deg)' }} />
            <div style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
          </div>

          <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.9', fontWeight: '300', marginBottom: '28px', letterSpacing: '0.3px' }}>
            Not sure where to start? Our intelligent assistant helps you plan the
            perfect Simcha — from table arrangements to full décor packages,
            tailored to your vision and budget.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {['Personalized Suggestions', 'Budget Planning', 'Available 24/7'].map(label => (
              <span key={label} style={{
                background: '#faf7f5', border: '1px solid #e8e0da',
                color: '#7d2e54', fontSize: '12px', letterSpacing: '0.5px',
                padding: '6px 14px', borderRadius: '20px'
              }}>{label}</span>
            ))}
          </div>

          <p style={{ fontSize: '12px', color: '#bbb', letterSpacing: '0.5px', marginTop: '16px', cursor: 'pointer', transition: 'color 0.2s' }}
            onClick={onClose}
            onMouseEnter={e => (e.currentTarget.style.color = '#7d2e54')}
            onMouseLeave={e => (e.currentTarget.style.color = '#bbb')}
          >Continue browsing →</p>
        </div>
      </div>
    </div>
  )
}

export default AiPromoReminder
