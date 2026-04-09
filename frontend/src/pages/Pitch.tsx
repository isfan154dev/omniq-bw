import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useModal } from '../context/ModalContext'

const TOTAL_SLIDES = 8

export default function Pitch() {
  const [slide, setSlide] = useState(1)
  const { t } = useLanguage()
  const { openAccess, openDemo } = useModal()

  const prev = useCallback(() => setSlide(s => Math.max(1, s - 1)), [])
  const next = useCallback(() => setSlide(s => Math.min(TOTAL_SLIDES, s + 1)), [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [next, prev])

  return (
    <div
      style={{
        paddingTop: 80,
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="scanline-overlay" />

      {/* Slide area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <SlideContainer slide={slide} t={t} openAccess={openAccess} openDemo={openDemo} />
      </div>

      {/* Navigation bar */}
      <div
        style={{
          borderTop: '1px solid var(--border-dim)',
          background: 'rgba(5,5,8,0.9)',
          backdropFilter: 'blur(12px)',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        {/* Dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i + 1)}
              style={{
                width: slide === i + 1 ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                background: slide === i + 1 ? 'var(--accent-cyan)' : 'var(--border-dim)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Counter */}
        <div
          style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.15em',
          }}
        >
          {String(slide).padStart(2, '0')} {t('pitch_of')} {String(TOTAL_SLIDES).padStart(2, '0')}
        </div>

        {/* Prev / Next */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={prev}
            disabled={slide === 1}
            className="btn-ghost"
            style={{ fontSize: '0.65rem', padding: '8px 20px', opacity: slide === 1 ? 0.3 : 1 }}
          >
            в†ђ {t('pitch_prev')}
          </button>
          <button
            onClick={next}
            disabled={slide === TOTAL_SLIDES}
            className="btn-primary"
            style={{ fontSize: '0.65rem', padding: '8px 20px', opacity: slide === TOTAL_SLIDES ? 0.3 : 1 }}
          >
            {t('pitch_next')} в†’
          </button>
        </div>
      </div>
    </div>
  )
}

type TFunc = (key: Parameters<ReturnType<typeof useLanguage>['t']>[0]) => string

interface SlideContainerProps {
  slide: number
  t: TFunc
  openAccess: () => void
  openDemo: () => void
}

function SlideContainer({ slide, t, openAccess, openDemo }: SlideContainerProps) {
  const slides: Record<number, JSX.Element> = {
    1: <Slide1 t={t} />,
    2: <Slide2 t={t} />,
    3: <Slide3 t={t} />,
    4: <Slide4 t={t} />,
    5: <Slide5 t={t} />,
    6: <Slide6 t={t} />,
    7: <Slide7 t={t} />,
    8: <Slide8 t={t} openAccess={openAccess} openDemo={openDemo} />,
  }
  return (
    <div
      key={slide}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        animation: 'pitchFadeIn 0.4s ease',
      }}
    >
      <style>{`@keyframes pitchFadeIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      {slides[slide]}
    </div>
  )
}

/* в”Ђв”Ђ Slide helpers в”Ђв”Ђ */

function SlideWrap({ children, align = 'center' }: { children: React.ReactNode; align?: 'center' | 'left' }) {
  return (
    <div
      className="container"
      style={{
        width: '100%',
        paddingTop: 40,
        paddingBottom: 40,
        textAlign: align === 'center' ? 'center' : 'left',
      }}
    >
      {children}
    </div>
  )
}

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-label" style={{ justifyContent: 'center', marginBottom: 20 }}>
      {children}
    </div>
  )
}

function STitle({ children, gradient = 'cyan' }: { children: React.ReactNode; gradient?: 'cyan' | 'purple' | 'green' }) {
  const gradMap = {
    cyan: 'linear-gradient(135deg, #ffffff 0%, #efefed 40%, #0a0a0a 100%)',
    purple: 'linear-gradient(135deg, #ffffff 0%, #d4d4d0 40%, #2a2a2a 100%)',
    green: 'linear-gradient(135deg, #ffffff 0%, #e8e8e6 40%, #3a3a3a 100%)',
  }
  return (
    <h2
      style={{
        fontFamily: 'Orbitron, monospace',
        fontWeight: 900,
        fontSize: 'clamp(1.8rem, 4vw, 3rem)',
        background: gradMap[gradient],
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: 1.1,
        marginBottom: 24,
      }}
    >
      {children}
    </h2>
  )
}

function StatBox({ value, label, accent = '#0a0a0a' }: { value: string; label: string; accent?: string }) {
  return (
    <div
      style={{
        padding: '20px 16px',
        border: '1px solid var(--border-dim)',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(255,255,255,0.02)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'Orbitron, monospace',
          fontWeight: 900,
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          color: accent,
          textShadow: 'none',
          lineHeight: 1.1,
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  )
}

/* в”Ђв”Ђ Individual Slides в”Ђв”Ђ */

function Slide1({ t }: { t: TFunc }) {
  return (
    <SlideWrap>
      <div
        style={{
          display: 'inline-block',
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          color: 'var(--accent-cyan)',
          padding: '4px 14px',
          border: '1px solid rgba(0,0,0,0.3)',
          borderRadius: 'var(--radius-pill)',
          background: 'rgba(0,0,0,0.06)',
          marginBottom: 28,
        }}
      >
        {t('pitch_s1_badge')}
      </div>

      <div
        style={{
          fontFamily: 'Orbitron, monospace',
          fontWeight: 900,
          fontSize: 'clamp(1rem, 2vw, 1.3rem)',
          letterSpacing: '0.3em',
          color: 'var(--text-muted)',
          marginBottom: 12,
          textTransform: 'uppercase',
        }}
      >
        OMNIQ
      </div>

      <h1
        style={{
          fontFamily: 'Orbitron, monospace',
          fontWeight: 900,
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          background: 'linear-gradient(135deg, #2a2a2a 0%, #0a0a0a 60%, #3a3a3a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.0,
          marginBottom: 28,
        }}
      >
        {t('pitch_s1_title')}
      </h1>

      <p
        style={{
          fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
          color: 'var(--text-secondary)',
          maxWidth: 580,
          margin: '0 auto 32px',
          lineHeight: 1.7,
        }}
      >
        {t('pitch_s1_sub')}
      </p>

      <div
        style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          color: 'var(--accent-teal)',
        }}
      >
        {t('pitch_s1_version')}
      </div>
    </SlideWrap>
  )
}

function Slide2({ t }: { t: TFunc }) {
  return (
    <SlideWrap>
      <SLabel>{t('pitch_s2_section')}</SLabel>
      <STitle gradient="purple">{t('pitch_s2_title')}</STitle>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          maxWidth: 900,
          margin: '0 auto 36px',
          textAlign: 'left',
        }}
      >
        {[
          { title: t('pitch_s2_p1_title'), text: t('pitch_s2_p1_text'), accent: '#5a5a5a' },
          { title: t('pitch_s2_p2_title'), text: t('pitch_s2_p2_text'), accent: '#5a5a5a' },
          { title: t('pitch_s2_p3_title'), text: t('pitch_s2_p3_text'), accent: '#0a0a0a' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              padding: '20px',
              border: `1px solid ${item.accent}33`,
              borderRadius: 'var(--radius-md)',
              background: `rgba(255,255,255,0.02)`,
            }}
          >
            <div
              style={{
                fontFamily: 'Orbitron, monospace',
                fontWeight: 700,
                fontSize: '0.75rem',
                color: item.accent,
                marginBottom: 10,
                letterSpacing: '0.05em',
              }}
            >
              {item.title}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 24,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <StatBox value={t('pitch_s2_stat1')} label={t('pitch_s2_stat1_l')} accent="#0a0a0a" />
        <StatBox value={t('pitch_s2_stat2')} label={t('pitch_s2_stat2_l')} accent="#5a5a5a" />
        <StatBox value={t('pitch_s2_stat3')} label={t('pitch_s2_stat3_l')} accent="#5a5a5a" />
      </div>
    </SlideWrap>
  )
}

function Slide3({ t }: { t: TFunc }) {
  return (
    <SlideWrap>
      <SLabel>{t('pitch_s3_section')}</SLabel>
      <STitle gradient="cyan">{t('pitch_s3_title')}</STitle>

      <p
        style={{
          fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
          color: 'var(--text-secondary)',
          maxWidth: 680,
          margin: '0 auto 36px',
          lineHeight: 1.7,
        }}
      >
        {t('pitch_s3_text')}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        {[
          { text: t('pitch_s3_f1'), icon: 'в¬Ў' },
          { text: t('pitch_s3_f2'), icon: 'вљЎ' },
          { text: t('pitch_s3_f3'), icon: 'в—€' },
          { text: t('pitch_s3_f4'), icon: 'вњ¦' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              padding: '20px 16px',
              border: '1px solid rgba(0,0,0,0.2)',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0,0,0,0.04)',
              textAlign: 'left',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            <span style={{ color: 'var(--accent-cyan)', fontSize: '1rem', flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{item.text}</span>
          </div>
        ))}
      </div>
    </SlideWrap>
  )
}

function Slide4({ t }: { t: TFunc }) {
  return (
    <SlideWrap>
      <SLabel>{t('pitch_s4_section')}</SLabel>
      <STitle gradient="purple">{t('pitch_s4_title')}</STitle>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          maxWidth: 900,
          margin: '0 auto',
        }}
      >
        {[
          { name: 'ARGUS', color: '#2a2a2a', icon: 'в—€', desc: t('pitch_s4_argus_desc') },
          { name: 'NEXUS', color: '#0a0a0a', icon: 'в¬Ў', desc: t('pitch_s4_nexus_desc') },
          { name: 'AURORA', color: '#3a3a3a', icon: 'вњ¦', desc: t('pitch_s4_aurora_desc') },
        ].map(item => (
          <div
            key={item.name}
            style={{
              padding: '28px 24px',
              border: `1px solid ${item.color}44`,
              borderRadius: 'var(--radius-lg)',
              background: `linear-gradient(160deg, ${item.color}0a 0%, rgba(0,0,0,0.4) 100%)`,
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ color: item.color, fontSize: '1.3rem' }}>{item.icon}</span>
              <span
                style={{
                  fontFamily: 'Orbitron, monospace',
                  fontWeight: 900,
                  fontSize: '1rem',
                  color: item.color,
                  textShadow: 'none',
                }}
              >
                {item.name}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </SlideWrap>
  )
}

function Slide5({ t }: { t: TFunc }) {
  return (
    <SlideWrap>
      <SLabel>{t('pitch_s5_section')}</SLabel>
      <STitle gradient="green">{t('pitch_s5_title')}</STitle>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 16,
          maxWidth: 900,
          margin: '0 auto 28px',
        }}
      >
        <StatBox value={t('pitch_s5_gdp')} label={t('pitch_s5_gdp_l')} accent="#3a3a3a" />
        <StatBox value={t('pitch_s5_pop')} label={t('pitch_s5_pop_l')} accent="#3a3a3a" />
        <StatBox value={t('pitch_s5_it')} label={t('pitch_s5_it_l')} accent="#0a0a0a" />
        <StatBox value={t('pitch_s5_growth')} label={t('pitch_s5_growth_l')} accent="#0a0a0a" />
        <StatBox value={t('pitch_s5_gov')} label={t('pitch_s5_gov_l')} accent="#2a2a2a" />
        <StatBox value={t('pitch_s5_prog')} label={t('pitch_s5_prog_l')} accent="#2a2a2a" />
      </div>

      <div
        style={{
          display: 'flex',
          gap: 20,
          justifyContent: 'center',
          flexWrap: 'wrap',
          maxWidth: 700,
          margin: '0 auto',
        }}
      >
        {[
          { value: t('pitch_s5_tam'), label: t('pitch_s5_tam_l'), accent: '#5a5a5a' },
          { value: t('pitch_s5_sam'), label: t('pitch_s5_sam_l'), accent: '#0a0a0a' },
          { value: t('pitch_s5_som'), label: t('pitch_s5_som_l'), accent: '#3a3a3a' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              flex: '1 1 160px',
              padding: '16px',
              border: `1px solid ${item.accent}44`,
              borderRadius: 'var(--radius-md)',
              background: `${item.accent}08`,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'Orbitron, monospace',
                fontWeight: 900,
                fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                color: item.accent,
                textShadow: 'none',
                marginBottom: 6,
              }}
            >
              {item.value}
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </SlideWrap>
  )
}

function Slide6({ t }: { t: TFunc }) {
  return (
    <SlideWrap>
      <SLabel>{t('pitch_s6_section')}</SLabel>
      <STitle gradient="cyan">{t('pitch_s6_title')}</STitle>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          maxWidth: 900,
          margin: '0 auto',
        }}
      >
        {[
          {
            title: t('pitch_s6_uc1_title'),
            text: t('pitch_s6_uc1_text'),
            stat: t('pitch_s6_uc1_stat'),
            statL: t('pitch_s6_uc1_stat_l'),
            accent: '#0a0a0a',
          },
          {
            title: t('pitch_s6_uc2_title'),
            text: t('pitch_s6_uc2_text'),
            stat: t('pitch_s6_uc2_stat'),
            statL: t('pitch_s6_uc2_stat_l'),
            accent: '#3a3a3a',
          },
          {
            title: t('pitch_s6_uc3_title'),
            text: t('pitch_s6_uc3_text'),
            stat: t('pitch_s6_uc3_stat'),
            statL: t('pitch_s6_uc3_stat_l'),
            accent: '#2a2a2a',
          },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              padding: '24px',
              border: `1px solid ${item.accent}33`,
              borderRadius: 'var(--radius-lg)',
              background: `${item.accent}08`,
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: 'Orbitron, monospace',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: item.accent,
                letterSpacing: '0.05em',
              }}
            >
              {item.title}
            </div>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, flex: 1 }}>
              {item.text}
            </p>
            <div style={{ borderTop: `1px solid ${item.accent}22`, paddingTop: 12 }}>
              <div
                style={{
                  fontFamily: 'Orbitron, monospace',
                  fontWeight: 900,
                  fontSize: '1.4rem',
                  color: item.accent,
                  textShadow: 'none',
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {item.stat}
              </div>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {item.statL}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SlideWrap>
  )
}

function Slide7({ t }: { t: TFunc }) {
  return (
    <SlideWrap>
      <SLabel>{t('pitch_s7_section')}</SLabel>
      <STitle gradient="green">{t('pitch_s7_title')}</STitle>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
          maxWidth: 800,
          margin: '0 auto 32px',
          textAlign: 'left',
        }}
      >
        {[
          { title: t('pitch_s7_r1_title'), text: t('pitch_s7_r1_text'), accent: '#0a0a0a' },
          { title: t('pitch_s7_r2_title'), text: t('pitch_s7_r2_text'), accent: '#2a2a2a' },
          { title: t('pitch_s7_r3_title'), text: t('pitch_s7_r3_text'), accent: '#3a3a3a' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              padding: '20px',
              border: `1px solid ${item.accent}33`,
              borderRadius: 'var(--radius-md)',
              background: `${item.accent}06`,
            }}
          >
            <div
              style={{
                fontFamily: 'Orbitron, monospace',
                fontWeight: 700,
                fontSize: '0.75rem',
                color: item.accent,
                marginBottom: 10,
                letterSpacing: '0.05em',
              }}
            >
              {item.title}
            </div>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
        <StatBox value={t('pitch_s7_acv')} label={t('pitch_s7_acv_l')} accent="#0a0a0a" />
        <StatBox value={t('pitch_s7_margin')} label={t('pitch_s7_margin_l')} accent="#3a3a3a" />
        <StatBox value={t('pitch_s7_contract')} label={t('pitch_s7_contract_l')} accent="#2a2a2a" />
      </div>
    </SlideWrap>
  )
}

function Slide8({ t, openAccess, openDemo }: { t: TFunc; openAccess: () => void; openDemo: () => void }) {
  return (
    <SlideWrap>
      <SLabel>{t('pitch_s8_section')}</SLabel>

      <h2
        style={{
          fontFamily: 'Orbitron, monospace',
          fontWeight: 900,
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          background: 'linear-gradient(135deg, #2a2a2a 0%, #0a0a0a 60%, #3a3a3a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.1,
          marginBottom: 16,
        }}
      >
        {t('pitch_s8_title')}
      </h2>

      <p
        style={{
          fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
          color: 'var(--text-secondary)',
          marginBottom: 36,
          lineHeight: 1.7,
        }}
      >
        {t('pitch_s8_sub')}
      </p>

      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
        <button onClick={openAccess} className="btn-primary" style={{ fontSize: '0.75rem', padding: '13px 32px' }}>
          <span>в—€</span> {t('pitch_s8_cta')}
        </button>
        <button onClick={openDemo} className="btn-ghost" style={{ fontSize: '0.75rem', padding: '12px 32px' }}>
          <span>в–¶</span> {t('pitch_s8_demo')}
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 32,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 32,
        }}
      >
        {[
          { icon: 'вњ‰', label: t('pitch_s8_email') },
          { icon: 'в—‰', label: t('pitch_s8_location') },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
            }}
          >
            <span style={{ color: 'var(--accent-cyan)' }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      <div
        style={{
          fontFamily: 'Orbitron, monospace',
          fontWeight: 700,
          fontSize: '0.65rem',
          letterSpacing: '0.3em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }}
      >
        {t('pitch_s8_tagline')}
      </div>
    </SlideWrap>
  )
}


