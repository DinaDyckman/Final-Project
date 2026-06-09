import { useState } from 'react'

interface AiPromoModalProps {
  onClose: (eventData?: { type: string; date: string }) => void
}

function AiPromoModal({ onClose }: AiPromoModalProps) {
  const [eventType, setEventType] = useState('Anniversary')
  const [eventDate, setEventDate] = useState('2026-06-21')

  const handleContinue = () => {
    sessionStorage.setItem('eventType', eventType)
    sessionStorage.setItem('eventDate', eventDate)
    const openChatEvent = new CustomEvent('openSimchaChat')
    window.dispatchEvent(openChatEvent)
    onClose({ type: eventType, date: eventDate })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 999999,
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
          onClick={() => onClose()}
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

        {/* Top gradient header */}
        <div style={{
          background: 'linear-gradient(140deg, #5c1a33 0%, #7d2e54 60%, #5c1a33 100%)',
          padding: '44px 40px 36px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative rings */}
          <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '160px', height: '160px', borderRadius: '50%', border: '1px solid rgba(212,175,55,0.2)' }} />
          <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', border: '1px solid rgba(212,175,55,0.15)' }} />
          <div style={{ position: 'absolute', top: '-20px', right: '60px', width: '80px', height: '80px', borderRadius: '50%', border: '1px solid rgba(212,175,55,0.1)' }} />

          {/* Badge */}
          <div style={{
            display: 'inline-block',
            border: '1px solid rgba(212,175,55,0.5)',
            color: '#d4af37', fontSize: '10px', letterSpacing: '3px',
            textTransform: 'uppercase', padding: '4px 14px', borderRadius: '20px',
            marginBottom: '18px', position: 'relative', zIndex: 1
          }}>AI Event Assistant</div>

          <h2 style={{
            color: '#d4af37', fontSize: '1.9rem', fontWeight: '300',
            letterSpacing: '3px', margin: '0 0 10px',
            fontFamily: "'Segoe UI', sans-serif", position: 'relative', zIndex: 1
          }}>Hi, I'm the Simcha Bot!</h2>

          <p style={{
            color: 'rgba(255,255,255,0.65)', fontSize: '12px',
            letterSpacing: '2px', textTransform: 'uppercase',
            margin: 0, position: 'relative', zIndex: 1
          }}>Upscale Simcha Rental</p>
        </div>

        {/* Bottom content */}
        <div style={{ padding: '34px 40px 38px' }}>

          {/* Diamond divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
            <div style={{ width: '6px', height: '6px', background: '#d4af37', transform: 'rotate(45deg)' }} />
            <div style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
          </div>

          <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.7', fontWeight: '300', marginBottom: '24px', letterSpacing: '0.3px' }}>
            Help us personalize your experience! Share your event details so our intelligent assistant can tailor suggestions to your vision and budget.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {['Personalized Suggestions', 'Budget Planning', 'Available 24/7'].map(label => (
              <span key={label} style={{
                background: '#faf7f5', border: '1px solid #e8e0da',
                color: '#7d2e54', fontSize: '12px', letterSpacing: '0.5px',
                padding: '6px 14px', borderRadius: '20px'
              }}>{label}</span>
            ))}
          </div>

          {/* Form fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', marginBottom: '28px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Type of Event
              </label>
              <select
                value={eventType}
                onChange={e => setEventType(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '4px', border: '1px solid #e8e8e8', fontSize: '14px', color: '#333', backgroundColor: '#fff', outline: 'none', cursor: 'pointer' }}
              >
                <option value="Anniversary">Anniversary</option>
                <option value="Wedding">Wedding</option>
                <option value="Bar Mitzvah">Bar Mitzvah</option>
                <option value="Bat Mitzvah">Bat Mitzvah</option>
                <option value="Bris">Bris</option>
                <option value="Birthday">Birthday</option>
                <option value="Corporate Event">Corporate Event</option>
                <option value="Custom Event">Other Special Event</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Event Date
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '4px', border: '1px solid #e8e8e8', fontSize: '14px', color: '#333', outline: 'none', fontFamily: 'inherit', marginBottom: 0 }}
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '12px', color: '#bbb', letterSpacing: '0.5px', cursor: 'pointer', margin: 0, transition: 'color 0.2s' }}
              onClick={() => onClose()}
              onMouseEnter={e => (e.currentTarget.style.color = '#7d2e54')}
              onMouseLeave={e => (e.currentTarget.style.color = '#bbb')}
            >Skip for now →</p>

            <button
              onClick={handleContinue}
              style={{
                background: 'linear-gradient(135deg, #5c1a33, #7d2e54)',
                color: '#fff', border: 'none',
                padding: '12px 32px', borderRadius: '4px',
                fontSize: '13px', fontWeight: '600', letterSpacing: '1px',
                textTransform: 'uppercase', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(92,26,51,0.3)',
                transition: 'transform 0.1s, box-shadow 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(92,26,51,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 15px rgba(92,26,51,0.3)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Chat with Simcha Bot ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AiPromoModal
