import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useModal } from '../context/ModalContext'
import { useAuth } from '../context/AuthContext'

function OmniqLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,4 96,33 80,86 20,86 4,33" stroke="#2EAEE8" strokeWidth="3.5" fill="rgba(10,22,50,0.85)" strokeLinejoin="round" />
      <polygon points="50,15 85,37 73,75 27,75 15,37" stroke="rgba(46,174,232,0.3)" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
      <path d="M22,50 Q50,28 78,50 Q50,72 22,50 Z" stroke="#2EAEE8" strokeWidth="2.2" fill="rgba(46,174,232,0.06)" />
      <circle cx="50" cy="50" r="10" stroke="#2EAEE8" strokeWidth="2" fill="rgba(10,22,50,0.9)" />
      <circle cx="50" cy="50" r="4.5" fill="#2EAEE8" />
      <circle cx="52.5" cy="47.5" r="1.5" fill="rgba(255,255,255,0.7)" />
      <circle cx="50" cy="50" r="14" stroke="rgba(46,174,232,0.25)" strokeWidth="0.8" fill="none" strokeDasharray="3 3" />
    </svg>
  )
}

const NAV_LABELS: Record<string, Record<string, string>> = {
  en: { home: 'Home', argus: 'ARGUS', nexus: 'NEXUS', aurora: 'AURORA', pricing: 'Pricing', pitch: 'Pitch Deck' },
  ru: { home: 'Главная', argus: 'ARGUS', nexus: 'NEXUS', aurora: 'AURORA', pricing: 'Тарифы', pitch: 'Презентация' },
  uz: { home: 'Bosh sahifa', argus: 'ARGUS', nexus: 'NEXUS', aurora: 'AURORA', pricing: 'Narxlar', pitch: 'Taqdimot' },
}

export default function Navbar() {
  const { language, setLanguage } = useLanguage()
  const { openAccess } = useModal()
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [, setMenuOpen] = useState(false)
  const t = NAV_LABELS[language] || NAV_LABELS.en

  const navLinks = [
    { to: '/',        label: t.home },
    { to: '/argus',   label: t.argus,  badge: 'LIVE' },
    { to: '/nexus',   label: t.nexus,  badge: 'LIVE' },
    { to: '/aurora',  label: t.aurora },
    { to: '/pricing', label: t.pricing },
    { to: '/pitch',   label: t.pitch },
  ]

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const loginLabel   = language === 'ru' ? '→ Войти' : language === 'uz' ? '→ Kirish' : '→ Login'
  const registerLabel = language === 'ru' ? 'Регистрация' : language === 'uz' ? 'Ro‘yxatdan o‘tish' : 'Register'
  const logoutLabel  = language === 'ru' ? 'Выйти' : language === 'uz' ? 'Chiqish' : 'Logout'
  const requestLabel = language === 'ru' ? 'Запросить доступ' : language === 'uz' ? 'Kirish soʻrovi' : 'Request Access'

  const linkBase: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '6px 12px',
    fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 500,
    textDecoration: 'none', borderRadius: 5, transition: 'all 180ms', whiteSpace: 'nowrap',
  }
  const btnBase: React.CSSProperties = {
    padding: '6px 14px', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 500,
    background: 'transparent', color: '#8A9BBF', border: '1px solid rgba(46,174,232,0.2)',
    borderRadius: 5, cursor: 'pointer', transition: 'all 180ms', whiteSpace: 'nowrap',
  }

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(7,12,24,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(46,174,232,0.12)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 64, gap: 8 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 8 }}>
          <OmniqLogo size={38} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.05rem', color: '#E8EDF5', letterSpacing: '0.1em' }}>OMNIQ</span>
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.48rem', color: '#2EAEE8', letterSpacing: '0.18em', marginTop: 2 }}>DECISION INTELLIGENCE</span>
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginRight: 'auto', paddingLeft: 4 }}>
          <span className="status-dot" style={{ width: 6, height: 6 }} />
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.55rem', color: '#2EAEE8', letterSpacing: '0.12em' }}>LIVE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{ ...linkBase, color: isActive(link.to) ? '#2EAEE8' : '#8A9BBF', background: isActive(link.to) ? 'rgba(46,174,232,0.1)' : 'transparent', border: isActive(link.to) ? '1px solid rgba(46,174,232,0.25)' : '1px solid transparent' }}
              onMouseEnter={e => { if (!isActive(link.to)) { const el = e.currentTarget as HTMLElement; el.style.color = '#E8EDF5'; el.style.background = 'rgba(46,174,232,0.06)'; } }}
              onMouseLeave={e => { if (!isActive(link.to)) { const el = e.currentTarget as HTMLElement; el.style.color = '#8A9BBF'; el.style.background = 'transparent'; } }}
            >
              {link.label}
              {link.badge && (<span style={{ fontSize: '0.48rem', fontFamily: 'Share Tech Mono, monospace', background: 'rgba(46,174,232,0.15)', color: '#2EAEE8', padding: '1px 5px', borderRadius: 3 }}>{link.badge}</span>)}
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 12 }}>
          <div style={{ display: 'flex', gap: 2, background: 'rgba(46,174,232,0.06)', border: '1px solid rgba(46,174,232,0.15)', borderRadius: 5, padding: '2px 3px' }}>
            {(['en','ru','uz'] as const).map(lang => (
              <button key={lang} onClick={() => setLanguage(lang)} style={{ padding: '3px 8px', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.06em', background: language === lang ? 'rgba(46,174,232,0.2)' : 'transparent', color: language === lang ? '#2EAEE8' : '#526080', border: 'none', borderRadius: 4, cursor: 'pointer', transition: 'all 150ms', textTransform: 'uppercase' }}>{lang.toUpperCase()}</button>
            ))}
          </div>
          {isAuthenticated ? (
            <>
              <div style={{ padding: '6px 12px', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem', color: '#2EAEE8', border: '1px solid rgba(46,174,232,0.2)', borderRadius: 5, background: 'rgba(46,174,232,0.08)', whiteSpace: 'nowrap' }}>
                {user?.username ?? 'USER'}
              </div>
              <button onClick={logout} style={btnBase}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#E8EDF5'; el.style.borderColor = 'rgba(46,174,232,0.4)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#8A9BBF'; el.style.borderColor = 'rgba(46,174,232,0.2)'; }}
              >{logoutLabel}</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={btnBase}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#E8EDF5'; el.style.borderColor = 'rgba(46,174,232,0.4)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#8A9BBF'; el.style.borderColor = 'rgba(46,174,232,0.2)'; }}
              >{loginLabel}</button>
              <button onClick={() => navigate('/register')} style={btnBase}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#E8EDF5'; el.style.borderColor = 'rgba(46,174,232,0.4)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#8A9BBF'; el.style.borderColor = 'rgba(46,174,232,0.2)'; }}
              >{registerLabel}</button>
            </>
          )}
          <button onClick={openAccess} style={{ padding: '7px 16px', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 600, background: '#1A6DB5', color: '#fff', border: '1px solid rgba(46,174,232,0.3)', borderRadius: 5, cursor: 'pointer', transition: 'all 180ms', whiteSpace: 'nowrap' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#2EAEE8'; el.style.boxShadow = '0 0 18px rgba(46,174,232,0.3)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#1A6DB5'; el.style.boxShadow = 'none'; }}
          >{requestLabel}</button>
        </div>
      </div>
    </nav>
  )
}
