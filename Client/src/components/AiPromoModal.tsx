import { useState } from 'react'

interface AiPromoModalProps {
  onClose: (eventData?: { type: string; date: string }) => void
}

function AiPromoModal({ onClose }: AiPromoModalProps) {
  const [eventType, setEventType] = useState('Anniversary')
  const [eventDate, setEventDate] = useState('2026-06-21')

  const handleContinue = () => {
    // 1. שומרים את הנתונים ב-sessionStorage כדי שהצ'אט בוט יוכל לגשת אליהם בהמשך
    sessionStorage.setItem('eventType', eventType)
    sessionStorage.setItem('eventDate', eventDate)

    // 2. מייצרים אירוע מותאם אישית שמודיע לצ'אט להיפתח
    const openChatEvent = new CustomEvent('openSimchaChat')
    window.dispatchEvent(openChatEvent)

    // 3. סוגרים את המודל
    onClose({ type: eventType, date: eventDate })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 999999,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      animation: 'fadeIn 0.4s ease'
    }}>
      <div style={{
        background: '#fff',
        width: '100%',
        maxWidth: '540px',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        animation: 'modalSlideIn 0.45s ease-out',
        position: 'relative',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
      }}>

        {/* Top burgundy header section */}
        <div style={{
          background: '#73183a',
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          position: 'relative'
        }}>
          <span style={{ fontSize: '24px', color: '#fff', display: 'flex', alignItems: 'center' }}>
        
          </span>
          <h2 style={{
            color: '#fff',
            fontSize: '1.5rem',
            fontWeight: '700',
            margin: 0,
            letterSpacing: '-0.3px'
          }}>
            Hi, I'm the Simcha Bot!
          </h2>
        </div>

        {/* Content section */}
        <div style={{ padding: '36px 36px 24px' }}>
          <p style={{
            color: '#666',
            fontSize: '17px',
            lineHeight: '1.5',
            fontWeight: '400',
            margin: '0 0 28px',
            textAlign: 'left'
          }}>
            Help us personalize your experience! Share your event details so we can show you real-time product availability.
          </p>

          {/* Form fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            
            {/* Field 1: Type of Event */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '700',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>
                Type of Event
              </label>
              <select 
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid #ccc',
                  fontSize: '15px',
                  color: '#333',
                  backgroundColor: '#fff',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="Anniversary">Anniversary</option>
                <option value="Wedding">Wedding</option>
                <option value="Bar Mitzvah">Bar Mitzvah</option>
                <option value="Bat Mitzvah">Bat Mitzvah</option>
                <option value="Custom Event">Other Special Event</option>
              </select>
            </div>

            {/* Field 2: Event Date */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '700',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>
                Event Date
              </label>
              <input 
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #ccc',
                  fontSize: '15px',
                  color: '#333',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>

          </div>
        </div>

        {/* Divider line */}
        <div style={{ height: '1px', background: '#f0f0f0', margin: '0 36px' }} />

        {/* Bottom Actions section */}
        <div style={{
          padding: '24px 36px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px'
        }}>
          <button
            onClick={() => onClose()}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#666',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '10px 0',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#333')}
            onMouseLeave={e => (e.currentTarget.style.color = '#666')}
          >
            Skip for now
          </button>

          <button
            onClick={handleContinue}
            style={{
              marginLeft: 'auto',
              background: '#73183a',
              color: '#fff',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(115, 24, 58, 0.2)',
              transition: 'background 0.2s, transform 0.1s'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#5c132e')}
            onMouseLeave={e => (e.currentTarget.style.background = '#73183a')}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Continue
          </button>
        </div>

      </div>
    </div>
  )
}

export default AiPromoModal