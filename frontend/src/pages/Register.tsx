import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register, isAuthenticated, isLoading } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) return <Navigate to="/argus" replace />

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await register(username, email, password, company)
      navigate('/argus', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#ffffff',
    border: '1px solid #d4d4d0',
    borderRadius: 8,
    padding: '12px 14px',
    color: '#0a0a0a',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.92rem',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#ffffff', paddingTop: 90, paddingBottom: 40 }}>
      <style>{`.auth-input::placeholder{color:#8a8a8a}`}</style>
      <div style={{ width: '100%', maxWidth: 460, background: '#ffffff', border: '1px solid #d4d4d0', borderRadius: 14, padding: 28, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: '#0a0a0a', letterSpacing: '0.18em', marginBottom: 8 }}>OMNIQ AUTH</div>
          <h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.5rem', color: '#0a0a0a', margin: 0 }}>Р РµРіРёСЃС‚СЂР°С†РёСЏ</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 14 }}>
            <input className="auth-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" style={inputStyle} />
            <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={inputStyle} />
            <input className="auth-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={inputStyle} />
            <input className="auth-input" value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" style={inputStyle} />
          </div>
          {error && <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.12)', color: '#0a0a0a', fontSize: '0.82rem' }}>{error}</div>}
          <button type="submit" disabled={isLoading} style={{ width: '100%', marginTop: 16, padding: '12px 14px', borderRadius: 8, border: '1px solid #0a0a0a', background: '#0a0a0a', color: '#ffffff', fontFamily: 'Orbitron, monospace', fontSize: '0.72rem', letterSpacing: '0.12em', cursor: isLoading ? 'wait' : 'pointer' }}>
            {isLoading ? 'CREATING ACCOUNT...' : 'РЎРћР—Р”РђРўР¬ РђРљРљРђРЈРќРў'}
          </button>
        </form>
        <div style={{ marginTop: 16, color: '#3a3a3a', fontSize: '0.82rem' }}>
          РЈР¶Рµ РµСЃС‚СЊ Р°РєРєР°СѓРЅС‚?{' '}
          <Link
            to="/login"
            style={{ color: '#0a0a0a', textDecoration: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline' }}
            onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none' }}
          >
            Р’РѕР№С‚Рё
          </Link>
        </div>
      </div>
    </div>
  )
}
