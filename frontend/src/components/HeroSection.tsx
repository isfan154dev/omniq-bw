import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useModal } from '../context/ModalContext'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

const COLORS = ['#00d4ff', '#7b2fff', '#00ff88', '#00d4ff']

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number>(0)
  const [titleVisible, setTitleVisible] = useState(false)
  const { t } = useLanguage()
  const { openDemo } = useModal()

  function scrollToProducts(e: React.MouseEvent) {
    e.preventDefault()
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  const STATS = [
    { value: '500+', label: t('hero_stat_enterprises') },
    { value: '12', label: t('hero_stat_governments') },
    { value: '10B+', label: t('hero_stat_data') },
    { value: '99.99%', label: t('hero_stat_uptime') },
  ]

  useEffect(() => {
    const timer = setTimeout(() => setTitleVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const count = Math.floor((canvas.width * canvas.height) / 12000)
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0')
        ctx.fill()
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.12 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #050508 0%, #08081a 50%, #050508 100%)',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      <div className="scanline-overlay" />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '80vh',
          background: 'radial-gradient(ellipse at center, rgba(123, 47, 255, 0.08) 0%, rgba(0, 212, 255, 0.04) 40%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.15), transparent)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(123, 47, 255, 0.15), transparent)',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: 40, paddingBottom: 40 }}>
        <div style={{ maxWidth: 860 }}>
          {/* Pre-label */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 24,
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 600ms ease 100ms',
            }}
          >
            <span
              style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '0.7rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--accent-cyan)',
                padding: '4px 12px',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(0, 212, 255, 0.05)',
              }}
            >
              {t('hero_label')}
            </span>
            <span
              style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                color: 'var(--accent-green)',
              }}
            >
              v2.4 ACTIVE
            </span>
          </div>

          {/* Main headline */}
          <h1
            style={{
              fontFamily: 'Orbitron, monospace',
              fontWeight: 900,
              fontSize: 'clamp(2.8rem, 7vw, 6rem)',
              lineHeight: 1.0,
              letterSpacing: '-0.01em',
              marginBottom: 8,
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'all 700ms ease 200ms',
            }}
          >
            <span
              style={{
                display: 'block',
                background: 'linear-gradient(135deg, #ffffff 0%, #e8eaf6 40%, #00d4ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('hero_line1')}
            </span>
            <span
              style={{
                display: 'block',
                background: 'linear-gradient(135deg, #7b2fff 0%, #00d4ff 60%, #00ff88 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
              }}
            >
              {t('hero_line2')}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: 620,
              lineHeight: 1.7,
              marginBottom: 40,
              marginTop: 24,
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 700ms ease 350ms',
            }}
          >
            {t('hero_subtitle')}
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 14,
              marginBottom: 64,
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 700ms ease 450ms',
            }}
          >
            <a href="#products" onClick={scrollToProducts} className="btn-primary" style={{ fontSize: '0.78rem', padding: '13px 32px' }}>
              <span>◈</span> {t('hero_explore')}
            </a>
            <button onClick={openDemo} className="btn-ghost" style={{ fontSize: '0.78rem', padding: '12px 32px' }}>
              <span>▶</span> {t('hero_demo')}
            </button>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, auto)',
              gap: 0,
              maxWidth: 640,
              opacity: titleVisible ? 1 : 0,
              transition: 'all 700ms ease 600ms',
            }}
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  padding: '16px 24px',
                  borderLeft: i > 0 ? '1px solid var(--border-dim)' : 'none',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Orbitron, monospace',
                    fontWeight: 900,
                    fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
                    color: 'var(--accent-cyan)',
                    textShadow: 'var(--neon-cyan)',
                    lineHeight: 1.1,
                    marginBottom: 4,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: '0.7rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: 'linear-gradient(transparent, var(--bg-primary))',
          pointerEvents: 'none',
        }}
      />

      <style>{`
        @media (max-width: 640px) {
          .hero-stats { grid-template-columns: repeat(2, auto) !important; }
        }
      `}</style>
    </section>
  )
}
