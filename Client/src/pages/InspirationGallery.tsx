import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Trash2 } from 'lucide-react'
import { authService } from '../services/authService'

export interface GalleryItem {
  src: string
  title: string
  tag: string
}

const DEFAULT_GALLERY: GalleryItem[] = [
  { src: '/images/24c-Garden-3D-Lace-Overlay-with-sand-underlay-corner-768x768.jpg', title: 'Garden 3D Lace Overlay', tag: 'Tablecloths' },
  { src: '/images/58-Flowers-at-Midnight-corner-768x768.jpg', title: 'Flowers at Midnight', tag: 'Floral Arrangements' },
  { src: '/images/755A8935-768x768.jpg', title: 'Elegant Table Setting', tag: 'Event Furniture' },
  { src: '/images/755A8991-768x768.jpg', title: 'Premium Centerpiece', tag: 'Centerpieces' },
  { src: '/images/755A9483-1-768x512.jpg', title: 'Luxury Reception', tag: 'Decor' },
  { src: '/images/Beautiful-Butterflies.jpg', title: 'Beautiful Butterflies', tag: 'Backdrops' },
  { src: '/images/Butterfly-Chiffon-Overlay.jpg', title: 'Butterfly Chiffon Overlay', tag: 'Tablecloths' },
  { src: '/images/DSC00006-fotor-2025050111112-1-768x768.jpg', title: 'Simcha Setup', tag: 'Event Furniture' },
  { src: '/images/IMG_04861.jpg', title: 'Classic Gold Setting', tag: 'Centerpieces' },
  { src: '/images/white_tablecloth.jpg', title: 'White Elegance', tag: 'Tablecloths' },
  { src: '/images/White-Stripe-Overlay.jpg', title: 'White Stripe Overlay', tag: 'Tablecloths' },
]

export const GALLERY_KEY = 'inspirationGallery'

export function loadGallery(): GalleryItem[] {
  try {
    const saved = localStorage.getItem(GALLERY_KEY)
    return saved ? JSON.parse(saved) : DEFAULT_GALLERY
  } catch {
    return DEFAULT_GALLERY
  }
}

export function saveGallery(items: GalleryItem[]) {
  localStorage.setItem(GALLERY_KEY, JSON.stringify(items))
}

function InspirationGallery() {
  const navigate = useNavigate()
  const isAdmin = authService.getCurrentUser()?.role === 'Admin'
  const [gallery, setGallery] = useState<GalleryItem[]>(loadGallery)

  useEffect(() => { saveGallery(gallery) }, [gallery])

  const deleteItem = (i: number) => {
    if (!window.confirm('Remove this image from the gallery?')) return
    setGallery(prev => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#faf7f5' }}>

      {/* Header */}
      <div style={{ background: '#3b0f1f', padding: '60px 40px 50px', textAlign: 'center', position: 'relative' }}>
        <button
          onClick={() => navigate('/products')}
          style={{ position: 'absolute', left: '40px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: '1px solid rgba(212,175,55,0.45)', color: '#d4af37', padding: '8px 18px', cursor: 'pointer', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '7px' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#d4af37'; e.currentTarget.style.color = '#3b0f1f' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d4af37' }}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
          <Sparkles size={20} strokeWidth={1.5} color="#d4af37" />
          <h1 style={{ color: '#d4af37', fontWeight: 300, fontSize: '2.4rem', letterSpacing: '4px', textTransform: 'uppercase', margin: 0, fontFamily: 'inherit' }}>
            Inspiration Gallery
          </h1>
          <Sparkles size={20} strokeWidth={1.5} color="#d4af37" />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
          Curated looks for your perfect simcha
        </p>
        <div style={{ width: '60px', height: '1px', background: '#d4af37', margin: '20px auto 0' }} />
      </div>

      {/* Gallery Grid */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '50px 30px' }}>
        <div style={{ columns: '3', columnGap: '20px' }}>
          {gallery.map((item, i) => (
            <div
              key={i}
              style={{ breakInside: 'avoid', marginBottom: '20px', position: 'relative', overflow: 'hidden', borderRadius: '4px', cursor: 'pointer' }}
              onMouseEnter={e => { const o = e.currentTarget.querySelector('.overlay') as HTMLElement; if (o) o.style.opacity = '1' }}
              onMouseLeave={e => { const o = e.currentTarget.querySelector('.overlay') as HTMLElement; if (o) o.style.opacity = '0' }}
            >
              <img
                src={item.src}
                alt={item.title}
                style={{ width: '100%', display: 'block', transition: 'transform 0.4s ease' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
              <div
                className="overlay"
                style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(59,15,31,0.85) 0%, transparent 50%)', opacity: 0, transition: 'opacity 0.3s ease', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px' }}
              >
                <p style={{ color: '#d4af37', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 4px' }}>{item.tag}</p>
                <p style={{ color: 'white', fontSize: '15px', fontWeight: 300, letterSpacing: '1px', margin: 0 }}>{item.title}</p>
              </div>

              {/* Admin delete button */}
              {isAdmin && (
                <button
                  onClick={e => { e.stopPropagation(); deleteItem(i) }}
                  style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239,68,68,0.9)', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
                  title="Remove from gallery"
                >
                  <Trash2 size={14} strokeWidth={1.5} color="white" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#3b0f1f', padding: '50px 20px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>
          Ready to bring your vision to life?
        </p>
        <button
          onClick={() => navigate('/products')}
          style={{ background: 'transparent', border: '1px solid #d4af37', color: '#d4af37', padding: '12px 36px', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#d4af37'; e.currentTarget.style.color = '#3b0f1f' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d4af37' }}
        >
          Browse Collection
        </button>
      </div>
    </div>
  )
}

export default InspirationGallery
