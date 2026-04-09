import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated, isLoading } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) return <Navigate to="/argus" replace />

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await login(username, password)
      navigate('/argus', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg-primary)', paddingTop: 90, paddingBottom: 40 }}>
      <div style={{ width: '100%', maxWidth: 440, background: 'var(--bg-card)', border: '1px solid rgba(46,174,232,0.14)', borderRadius: 14, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: '#2EAEE8', letterSpacing: '0.18em', marginBottom: 8 }}>OMNIQ AUTH</div>
          <h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.5rem', color: '#E8EDF5', margin: 0 }}>Вход</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 14 }}>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(46,174,232,0.16)', borderRadius: 8, padding: '12px 14px', color: '#E8EDF5', fontFamily: 'Inter, sans-serif', fontSize: '0.92rem', boxSizing: 'border-box' }} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(46,174,232,0.16)', borderRadius: 8, padding: '12px 14px', color: '#E8EDF5', fontFamily: 'Inter, sans-serif', fontSize: '0.92rem', boxSizing: 'border-box' }} />
          </div>
          {error && <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, background: 'rgba(217,64,64,0.1)', border: '1px solid rgba(217,64,64,0.2)', color: '#F3B3B3', fontSize: '0.82rem' }}>{error}</div>}
          <button type="submit" disabled={isLoading} style={{ width: '100%', marginTop: 16, padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(46,174,232,0.24)', background: 'linear-gradient(135deg, #1A6DB5, #2EAEE8)', color: '#fff', fontFamily: 'Orbitron, monospace', fontSize: '0.72rem', letterSpacing: '0.12em', cursor: isLoading ? 'wait' : 'pointer' }}>
            {isLoading ? 'SIGNING IN...' : 'ВОЙТИ'}
          </button>
        </form>
        <div style={{ marginTop: 16, color: '#8A9BBF', fontSize: '0.82rem' }}>
          Нет аккаунта? <Link to="/register" style={{ color: '#2EAEE8', textDecoration: 'none' }}>Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  )
}
