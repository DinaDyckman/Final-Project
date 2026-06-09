import { Link, useLocation } from 'react-router-dom'

// Pages where the footer should not appear
const HIDDEN_ON = ['/admin', '/thank-you']

const Footer = () => {
  const { pathname } = useLocation()

  if (HIDDEN_ON.includes(pathname)) return null

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        {/* Brand */}
        <div style={styles.column}>
          <h2 style={styles.brandName}>Upscale</h2>
          <p style={styles.tagline}>
            Curated pieces for every occasion —<br />
            Luxury rentals, delivered with elegance.
          </p>
        </div>

        {/* Quick Links */}
        <div style={styles.column}>
          <h3 style={styles.columnHeading}>Quick Links</h3>
          <nav style={styles.linkList}>
            <Link to="/Products" style={styles.link} className="footer-link">Products</Link>
            <Link to="/Checkout" style={styles.link} className="footer-link">Checkout</Link>
            <Link to="/rental-history" style={styles.link} className="footer-link">Rental History</Link>
          </nav>
        </div>

        {/* Contact */}
        <div style={styles.column}>
          <h3 style={styles.columnHeading}>Contact Us</h3>
          <ul style={styles.contactList}>
            <li style={styles.contactItem}>
              <span style={styles.icon}></span>
              <span>054-854-5068</span>
            </li>
            <li style={styles.contactItem}>
              <span style={styles.icon}></span>
              <span>rentalupscale@gmail.com</span>
            </li>
            <li style={styles.contactItem}>
              <span style={styles.icon}></span>
              <span>Mon – Fri: 9 AM – 7 PM<br /></span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div style={styles.bottomBar}>
        <span style={styles.copyright}>
          © 2026 Upscale. All rights reserved.
        </span>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Inter:wght@300;400&display=swap');

        a.footer-link:hover {
          color: #d4af37 !important;
          letter-spacing: 0.04em;
          transition: color 0.2s ease, letter-spacing 0.2s ease;
        }

        @media (max-width: 768px) {
          .footer-inner {
            flex-direction: column !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </footer>
  )
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: '#5c1a33',
    color: '#e8dcc8',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 300,
    width: '100%',
    flexShrink: 0,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem 2rem',
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between',
    gap: '2.5rem',
  },
  column: {
    flex: '1 1 200px',
    minWidth: '180px',
  },
  brandName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.75rem',
    fontWeight: 600,
    color: '#d4af37',
    margin: '0 0 0.6rem',
    letterSpacing: '0.03em',
  },
  tagline: {
    fontSize: '0.875rem',
    lineHeight: 1.7,
    color: '#c9b99a',
    margin: 0,
  },
  columnHeading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1rem',
    fontWeight: 600,
    color: '#d4af37',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    margin: '0 0 1rem',
  },
  linkList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.6rem',
  },
  link: {
    color: '#e8dcc8',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  contactList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.6rem',
    fontSize: '0.875rem',
    lineHeight: 1.6,
    color: '#c9b99a',
  },
  icon: {
    fontSize: '0.9rem',
    marginTop: '0.1rem',
    flexShrink: 0,
  },
  bottomBar: {
    borderTop: '1px solid rgba(212, 175, 55, 0.25)',
    padding: '1rem 2rem',
    textAlign: 'center' as const,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  copyright: {
    fontSize: '0.8rem',
    color: '#9a8070',
    letterSpacing: '0.04em',
  },
}

export default Footer