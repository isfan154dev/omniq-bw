import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useModal } from '../context/ModalContext'
import { useAuth } from '../context/AuthContext'

function OmniqLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,4 96,33 80,86 20,86 4,33" stroke="#0a0a0a" strokeWidth="3.5" fill="#ffffff" strokeLinejoin="round" />
      <polygon points="50,15 85,37 73,75 27,75 15,37" stroke="rgba(0,0,0,0.3)" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
      <path d="M22,50 Q50,28 78,50 Q50,72 22,50 Z" stroke="#0a0a0a" strokeWidth="2.2" fill="rgba(0,0,0,0.06)" />
      <circle cx="50" cy="50" r="10" stroke="#0a0a0a" strokeWidth="2" fill="#ffffff" />
      <circle cx="50" cy="50" r="4.5" fill="#0a0a0a" />
      <circle cx="52.5" cy="47.5" r="1.5" fill="rgba(255,255,255,0.9)" />
      <circle cx="50" cy="50" r="14" stroke="rgba(0,0,0,0.25)" strokeWidth="0.8" fill="none" strokeDasharray="3 3" />
    </svg>
  )
}

const NAV_LABELS: Record<string, Record<string, string>> = {
  en: { home: 'Home', argus: 'ARGUS', nexus: 'NEXUS', aurora: 'AURORA', pricing: 'Pricing', pitch: 'Pitch Deck' },
  ru: { home: 'Р“Р»Р°РІРЅР°СЏ', argus: 'ARGUS', nexus: 'NEXUS', aurora: 'AURORA', pricing: 'РўР°СЂРёС„С‹', pitch: 'РџСЂРµР·РµРЅС‚Р°С†РёСЏ' },
  uz: { home: 'Bosh sahifa', argus: 'ARGUS', nexus: 'NEXUS', aurora: 'AURORA', pricing: 'Narxlar', pitch: 'Taqdimot' },
}

export default function Navbar() {
  const { language, setLanguage } = useLanguage()
  const { openAccess } = useModal()
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const t = NAV_LABELS[language] || NAV_LABELS.en

  const navLinks = [
    { to: '/', label: t.home },
    { to: '/argus', label: t.argus, badge: 'LIVE' },
    { to: '/nexus', label: t.nexus, badge: 'LIVE' },
    { to: '/aurora', label: t.aurora },
    { to: '/pricing', label: t.pricing },
    { to: '/pitch', label: t.pitch },
  ]

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const loginLabel = language === 'ru' ? 'в†’ Р’РѕР№С‚Рё' : language === 'uz' ? 'в†’ Kirish' : 'в†’ Login'
  const registerLabel = language === 'ru' ? 'Р РµРіРёСЃС‚СЂР°С†РёСЏ' : language === 'uz' ? 'RoвЂyxatdan oвЂtish' : 'Register'
  const logoutLabel = language === 'ru' ? 'Р’С‹Р№С‚Рё' : language === 'uz' ? 'Chiqish' : 'Logout'
  const requestLabel = language === 'ru' ? 'Р—Р°РїСЂРѕСЃРёС‚СЊ РґРѕСЃС‚СѓРї' : language === 'uz' ? 'Kirish soК»rovi' : 'Request Access'

  const linkBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '6px 12px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.78rem',
    fontWeight: 500,
    textDecoration: 'none',
    borderRadius: 5,
    transition: 'all 180ms',
    whiteSpace: 'nowrap',
  }

  const btnBase: React.CSSProperties = {
    padding: '6px 14px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.78rem',
    fontWeight: 500,
    background: 'transparent',
    color: '#3a3a3a',
    border: '1px solid rgba(0,0,0,0.2)',
    borderRadius: 5,
    cursor: 'pointer',
    transition: 'all 180ms',
    whiteSpace: 'nowrap',
  }

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: '#ffffff', borderBottom: '1px solid #d4d4d0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 64, gap: 8 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 8 }}>
          <OmniqLogo size={38} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.05rem', color: '#0a0a0a', letterSpacing: '0.1em' }}>OMNIQ</span>
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.48rem', color: '#0a0a0a', letterSpacing: '0.18em', marginTop: 2 }}>DECISION INTELLIGENCE</span>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginRight: 'auto', paddingLeft: 4 }}>
          <span className="status-dot" style={{ width: 6, height: 6 }} />
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.55rem', color: '#0a0a0a', letterSpacing: '0.12em' }}>LIVE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                ...linkBase,
                color: isActive(link.to) ? '#0a0a0a' : '#3a3a3a',
                background: isActive(link.to) ? 'rgba(0,0,0,0.08)' : 'transparent',
                border: isActive(link.to) ? '1px solid rgba(0,0,0,0.18)' : '1px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isActive(link.to)) {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = '#0a0a0a'
                  el.style.background = 'rgba(0,0,0,0.04)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive(link.to)) {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = '#3a3a3a'
                  el.style.background = 'transparent'
                }
              }}
            >
              {link.label}
              {link.badge && (
                <span style={{ fontSize: '0.48rem', fontFamily: 'Share Tech Mono, monospace', background: 'rgba(0,0,0,0.08)', color: '#0a0a0a', padding: '1px 5px', borderRadius: 3 }}>
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 12 }}>
          <div style={{ display: 'flex', gap: 2, background: '#f5f5f3', border: '1px solid #d4d4d0', borderRadius: 5, padding: '2px 3px' }}>
            {(['en', 'ru', 'uz'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                style={{
                  padding: '3px 8px',
                  fontFamily: 'Share Tech Mono, monospace',
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  background: language === lang ? '#ffffff' : 'transparent',
                  color: language === lang ? '#0a0a0a' : '#8a8a8a',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  textTransform: 'uppercase',
                }}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {isAuthenticated ? (
            <>
              <div style={{ padding: '6px 12px', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem', color: '#0a0a0a', border: '1px solid #d4d4d0', borderRadius: 5, background: '#f5f5f3', whiteSpace: 'nowrap' }}>
                {user?.username ?? 'USER'}
              </div>
              <button
                onClick={logout}
                style={btnBase}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = '#0a0a0a'
                  el.style.borderColor = '#0a0a0a'
                  el.style.background = 'rgba(0,0,0,0.04)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = '#3a3a3a'
                  el.style.borderColor = 'rgba(0,0,0,0.2)'
                  el.style.background = 'transparent'
                }}
              >
                {logoutLabel}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={btnBase}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = '#0a0a0a'
                  el.style.borderColor = '#0a0a0a'
                  el.style.background = 'rgba(0,0,0,0.04)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = '#3a3a3a'
                  el.style.borderColor = 'rgba(0,0,0,0.2)'
                  el.style.background = 'transparent'
                }}
              >
                {loginLabel}
              </button>
              <button
                onClick={() => navigate('/register')}
                style={btnBase}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = '#0a0a0a'
                  el.style.borderColor = '#0a0a0a'
                  el.style.background = 'rgba(0,0,0,0.04)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = '#3a3a3a'
                  el.style.borderColor = 'rgba(0,0,0,0.2)'
                  el.style.background = 'transparent'
                }}
              >
                {registerLabel}
              </button>
            </>
          )}

          <button
            onClick={openAccess}
            style={{ padding: '7px 16px', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 600, background: '#0a0a0a', color: '#ffffff', border: '1px solid #0a0a0a', borderRadius: 5, cursor: 'pointer', transition: 'all 180ms', whiteSpace: 'nowrap' }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.background = '#2a2a2a'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.background = '#0a0a0a'
            }}
          >
            {requestLabel}
          </button>
        </div>
      </div>
    </nav>
  )
}
