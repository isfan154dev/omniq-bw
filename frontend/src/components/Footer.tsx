import { NavLink } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  const PRODUCTS = [
    { label: t('footer_argus'), to: '/argus' },
    { label: t('footer_nexus'), to: '/nexus' },
    { label: t('footer_aurora'), to: '/aurora' },
  ]

  const COMPANY = [
    { label: t('footer_about'), href: '#' },
    { label: t('footer_security'), href: '#' },
    { label: t('footer_compliance'), href: '#' },
    { label: t('footer_status'), href: '#' },
  ]

  const RESOURCES = [
    { label: t('footer_docs'), href: '#' },
    { label: t('footer_api'), href: '#' },
    { label: t('footer_cases'), href: '#' },
    { label: t('footer_blog'), href: '#' },
  ]

  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-dim)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grid texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Main footer grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 48,
            padding: '64px 0 48px',
          }}
        >
          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, #0a0a0a, #2a2a2a)',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <polygon points="10,2 18,7 18,13 10,18 2,13 2,7" stroke="white" strokeWidth="1.5" fill="none"/>
                  <circle cx="10" cy="10" r="3" fill="white"/>
                  <line x1="10" y1="2" x2="10" y2="7" stroke="white" strokeWidth="1.2"/>
                  <line x1="10" y1="13" x2="10" y2="18" stroke="white" strokeWidth="1.2"/>
                  <line x1="2" y1="7" x2="7" y2="10" stroke="white" strokeWidth="1.2"/>
                  <line x1="13" y1="10" x2="18" y2="7" stroke="white" strokeWidth="1.2"/>
                </svg>
              </div>
              <span
                style={{
                  fontFamily: 'Orbitron, monospace',
                  fontWeight: 900,
                  fontSize: '1rem',
                  letterSpacing: '0.12em',
                  color: '#0a0a0a',
                }}
              >
                OMNIQ
              </span>
            </div>

            <p
              style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '0.8rem',
                color: 'var(--accent-cyan)',
                letterSpacing: '0.08em',
                marginBottom: 16,
                opacity: 0.9,
              }}
            >
              {t('footer_tagline')}
            </p>

            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                lineHeight: 1.7,
                maxWidth: 300,
                marginBottom: 24,
              }}
            >
              {t('footer_desc')}
            </p>

            {/* Social / contact icons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {['⬡', '◈', '◉'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-dim)',
                    borderRadius: 'var(--radius-base)',
                    color: 'var(--text-muted)',
                    fontSize: '1rem',
                    transition: 'all 200ms ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    el.style.borderColor = '#0a0a0a'
                    el.style.color = '#0a0a0a'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget
                    el.style.borderColor = 'var(--border-dim)'
                    el.style.color = 'var(--text-muted)'
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Products column */}
          <div>
            <h4
              style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                marginBottom: 20,
              }}
            >
              {t('footer_products')}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PRODUCTS.map(link => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    style={{
                      fontFamily: 'Share Tech Mono, monospace',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      transition: 'color 200ms ease',
                      letterSpacing: '0.02em',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-cyan)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4
              style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                marginBottom: 20,
              }}
            >
              {t('footer_company')}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {COMPANY.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    style={{
                      fontFamily: 'Share Tech Mono, monospace',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      transition: 'color 200ms ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-cyan)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources column */}
          <div>
            <h4
              style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                marginBottom: 20,
              }}
            >
              {t('footer_resources')}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {RESOURCES.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    style={{
                      fontFamily: 'Share Tech Mono, monospace',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      transition: 'color 200ms ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-cyan)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-dim)',
            padding: '24px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <p
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
            }}
          >
            &copy; {new Date().getFullYear()} OMNIQ Technologies. {t('footer_rights')}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span
              style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
              }}
            >
              v2.4.1-stable
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="status-dot" style={{ width: 6, height: 6 }} />
              <span
                style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  fontSize: '0.65rem',
                  color: 'var(--accent-teal)',
                  letterSpacing: '0.1em',
                }}
              >
                {t('footer_systems')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer .container > div:first-of-type {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          footer .container > div:first-of-type {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </footer>
  )
}
