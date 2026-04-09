import { useEffect, useRef, useState } from 'react'
import { useModal } from '../context/ModalContext'
import { useLanguage } from '../context/LanguageContext'

interface FormState {
  name: string
  company: string
  position: string
  phone: string
  email: string
  message: string
}

const EMPTY: FormState = { name: '', company: '', position: '', phone: '', email: '', message: '' }

const API_URL = 'https://omniq-backend.onrender.com'

interface FieldProps {
  id: keyof FormState
  label: string
  value: string
  placeholder: string
  onChange: (v: string) => void
  error?: string
  textarea?: boolean
  type?: string
  accentColor: string
  inputRef?: React.Ref<HTMLInputElement>
}

const Field = ({ label, value, placeholder, onChange, error, textarea, type, accentColor, inputRef }: FieldProps) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{
      display: 'block',
      fontFamily: 'Share Tech Mono, monospace',
      fontSize: '0.65rem',
      letterSpacing: '0.12em',
      color: error ? '#0a0a0a' : '#8a8a8a',
      marginBottom: 6,
      textTransform: 'uppercase',
    }}>{label}</label>
    {textarea ? (
      <textarea
        value={value}
        placeholder={placeholder}
        rows={3}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          background: '#ffffff',
          border: `1px solid ${error ? '#0a0a0a' : `${accentColor}33`}`,
          borderRadius: 6,
          padding: '10px 12px',
          color: '#0a0a0a',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.85rem',
          resize: 'vertical',
          outline: 'none',
          transition: 'border-color 200ms ease',
          boxSizing: 'border-box',
        }}
        onFocus={e => { e.target.style.borderColor = accentColor }}
        onBlur={e => { e.target.style.borderColor = error ? '#0a0a0a' : `${accentColor}33` }}
      />
    ) : (
      <input
        ref={inputRef}
        type={type ?? 'text'}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          background: '#ffffff',
          border: `1px solid ${error ? '#0a0a0a' : `${accentColor}33`}`,
          borderRadius: 6,
          padding: '10px 12px',
          color: '#0a0a0a',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.85rem',
          outline: 'none',
          transition: 'border-color 200ms ease',
          boxSizing: 'border-box',
        }}
        onFocus={e => { e.target.style.borderColor = accentColor }}
        onBlur={e => { e.target.style.borderColor = error ? '#0a0a0a' : `${accentColor}33` }}
      />
    )}
    {error && (
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: '#0a0a0a', marginTop: 4 }}>
        {error}
      </div>
    )}
  </div>
)

export default function OmniqModal() {
  const { modalType, closeModal } = useModal()
  const { t } = useLanguage()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const overlayRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const isDemo = modalType === 'demo'
  const isAccess = modalType === 'access'
  const open = isDemo || isAccess
  const accentColor = isDemo ? '#2a2a2a' : '#0a0a0a'

  useEffect(() => {
    if (open) {
      setForm(EMPTY)
      setErrors({})
      setSubmitted(false)
      setApiError('')
      setTimeout(() => firstInputRef.current?.focus(), 80)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, closeModal])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  function validate(): boolean {
    const nextErrors: Partial<FormState> = {}
    if (!form.name.trim()) nextErrors.name = t('modal_err_required')
    if (!form.company.trim()) nextErrors.company = t('modal_err_required')
    if (isAccess && !form.position.trim()) nextErrors.position = t('modal_err_required')
    if (!form.phone.trim()) nextErrors.phone = t('modal_err_required')
    if (!form.email.trim()) nextErrors.email = t('modal_err_required')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = t('modal_err_email')
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setApiError('')
    try {
      const res = await fetch(`${API_URL}/api/leads/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lead_type: isDemo ? 'demo' : 'access' }),
      })
      if (!res.ok) throw new Error('Server error')
      setSubmitted(true)
    } catch {
      setApiError('РћС€РёР±РєР° РѕС‚РїСЂР°РІРєРё. РџРѕРїСЂРѕР±СѓР№С‚Рµ РµС‰С‘ СЂР°Р·.')
    } finally {
      setLoading(false)
    }
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) closeModal()
  }

  return (
    <>
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          background: 'rgba(255,255,255,0.78)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 180ms ease',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: isAccess ? 540 : 480,
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#ffffff',
            border: `1px solid ${accentColor}44`,
            borderRadius: 16,
            boxShadow: '0 24px 60px rgba(0,0,0,0.12)',
            animation: 'slideUp 220ms cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, borderRadius: '16px 16px 0 0' }} />

          <div style={{ padding: '28px 28px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span className="status-dot" />
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.18em', color: accentColor }}>
                  {isDemo ? 'OMNIQ DEMO REQUEST' : 'OMNIQ ACCESS REQUEST'}
                </span>
              </div>
              <h2 style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', letterSpacing: '0.05em', color: '#0a0a0a', marginBottom: 6 }}>
                {t(isDemo ? 'modal_demo_title' : 'modal_access_title')}
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 380 }}>
                {t(isDemo ? 'modal_demo_subtitle' : 'modal_access_subtitle')}
              </p>
            </div>
            <button
              onClick={closeModal}
              aria-label="Close"
              style={{ flexShrink: 0, width: 36, height: 36, background: 'rgba(0,0,0,0.04)', border: '1px solid var(--border-dim)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1, transition: 'all 150ms ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.color = accentColor }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              вњ•
            </button>
          </div>

          <div style={{ height: 1, background: 'var(--border-dim)', margin: '20px 28px' }} />

          <div style={{ padding: '0 28px 28px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', animation: 'fadeIn 300ms ease' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${accentColor}15`, border: `2px solid ${accentColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.6rem' }}>вњ“</div>
                <h3 style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.08em', color: accentColor, marginBottom: 12 }}>
                  {t('modal_success_title')}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 28 }}>
                  {t('modal_success_message')}
                </p>
                <button
                  onClick={closeModal}
                  style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', padding: '11px 32px', background: 'transparent', border: `1px solid ${accentColor}`, borderRadius: 6, color: accentColor, cursor: 'pointer', transition: 'all 200ms ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${accentColor}15` }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  {t('modal_close')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                  <Field id="name" label={t('modal_field_name')} value={form.name} placeholder={t('modal_ph_name')} onChange={v => setForm(f => ({ ...f, name: v }))} error={errors.name} accentColor={accentColor} inputRef={firstInputRef} />
                  <Field id="company" label={t('modal_field_company')} value={form.company} placeholder={t('modal_ph_company')} onChange={v => setForm(f => ({ ...f, company: v }))} error={errors.company} accentColor={accentColor} />
                </div>
                {isAccess && <Field id="position" label={t('modal_field_position')} value={form.position} placeholder={t('modal_ph_position')} onChange={v => setForm(f => ({ ...f, position: v }))} error={errors.position} accentColor={accentColor} />}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                  <Field id="phone" label={t('modal_field_phone')} value={form.phone} placeholder={t('modal_ph_phone')} onChange={v => setForm(f => ({ ...f, phone: v }))} error={errors.phone} accentColor={accentColor} type="tel" />
                  <Field id="email" label={t('modal_field_email')} value={form.email} placeholder={t('modal_ph_email')} onChange={v => setForm(f => ({ ...f, email: v }))} error={errors.email} accentColor={accentColor} type="email" />
                </div>
                {isAccess && <Field id="message" label={t('modal_field_message')} value={form.message} placeholder={t('modal_ph_message')} onChange={v => setForm(f => ({ ...f, message: v }))} accentColor={accentColor} textarea />}
                {apiError && <div style={{ background: 'rgba(0,0,0,0.1)', border: '1px solid #0a0a0a80', borderRadius: 6, padding: '10px 12px', color: '#0a0a0a', fontSize: '0.8rem', marginBottom: 12 }}>{apiError}</div>}
                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', marginTop: 8, padding: '13px 24px', fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.14em', cursor: loading ? 'wait' : 'pointer', border: 'none', borderRadius: 6, background: loading ? '#5a5a5a' : '#0a0a0a', color: '#ffffff', transition: 'all 200ms ease', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.background = '#2a2a2a' } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = loading ? '#5a5a5a' : '#0a0a0a' }}
                >
                  {loading ? 'в—€ РћРўРџР РђР’РљРђ...' : t(isDemo ? 'modal_submit_demo' : 'modal_submit_access')}
                </button>
                <p style={{ textAlign: 'center', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.06em', marginTop: 12 }}>
                  {t('modal_privacy_note')}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.97) } to { opacity: 1; transform: none } }
        @media (max-width: 480px) { .modal-two-col { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
