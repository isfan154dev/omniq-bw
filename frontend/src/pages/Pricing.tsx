import { useLanguage } from '../context/LanguageContext'
import { useModal } from '../context/ModalContext'
import AnimateIn from '../components/AnimateIn'

export default function Pricing() {
  const { t } = useLanguage()
  const { openAccess } = useModal()

  const starterFeatures = [
    t('pricing_starter_f1'),
    t('pricing_starter_f2'),
    t('pricing_starter_f3'),
    t('pricing_starter_f4'),
    t('pricing_starter_f5'),
    t('pricing_starter_f6'),
    t('pricing_starter_f7'),
  ]

  const growthFeatures = [
    t('pricing_growth_f1'),
    t('pricing_growth_f2'),
    t('pricing_growth_f3'),
    t('pricing_growth_f4'),
    t('pricing_growth_f5'),
    t('pricing_growth_f6'),
    t('pricing_growth_f7'),
    t('pricing_growth_f8'),
    t('pricing_growth_f9'),
  ]

  const enterpriseFeatures = [
    t('pricing_enterprise_f1'),
    t('pricing_enterprise_f2'),
    t('pricing_enterprise_f3'),
    t('pricing_enterprise_f4'),
    t('pricing_enterprise_f5'),
    t('pricing_enterprise_f6'),
    t('pricing_enterprise_f7'),
    t('pricing_enterprise_f8'),
    t('pricing_enterprise_f9'),
  ]

  return (
    <div style={{ paddingTop: 100, paddingBottom: 80, minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="scanline-overlay" />

      {/* Hero */}
      <AnimateIn direction="up" style={{ textAlign: 'center', marginBottom: 64 }} className="container">
        <div className="section-label" style={{ justifyContent: 'center', marginBottom: 20 }}>
          {t('pricing_label')}
        </div>
        <h1
          style={{
            fontFamily: 'Orbitron, monospace',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            background: 'linear-gradient(135deg, #ffffff 0%, #e8eaf6 40%, #00d4ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 16,
          }}
        >
          {t('pricing_title')}
        </h1>
        <p
          style={{
            fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
            color: 'var(--text-secondary)',
            maxWidth: 620,
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          {t('pricing_subtitle')}
        </p>
      </AnimateIn>

      {/* Pricing cards */}
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          maxWidth: 1100,
          alignItems: 'start',
        }}
      >
        {/* Starter */}
        <AnimateIn direction="up" delay={0}>
          <PricingCard
            name={t('pricing_starter_name')}
            price={t('pricing_starter_price')}
            perYear={t('pricing_per_year')}
            target={t('pricing_starter_target')}
            features={starterFeatures}
            ctaLabel={t('pricing_cta_starter')}
            onCta={openAccess}
            accent="#00d4ff"
            featured={false}
          />
        </AnimateIn>

        {/* Growth (featured) */}
        <AnimateIn direction="up" delay={120}>
          <PricingCard
            name={t('pricing_growth_name')}
            price={t('pricing_growth_price')}
            perYear={t('pricing_per_year')}
            target={t('pricing_growth_target')}
            features={growthFeatures}
            ctaLabel={t('pricing_cta_growth')}
            onCta={openAccess}
            accent="#7b2fff"
            featured
            popularLabel={t('pricing_popular')}
          />
        </AnimateIn>

        {/* Enterprise */}
        <AnimateIn direction="up" delay={240}>
          <PricingCard
            name={t('pricing_enterprise_name')}
            price={t('pricing_enterprise_price')}
            perYear={t('pricing_per_year')}
            priceFrom={t('pricing_enterprise_from')}
            target={t('pricing_enterprise_target')}
            features={enterpriseFeatures}
            ctaLabel={t('pricing_cta_enterprise')}
            onCta={openAccess}
            accent="#00ff88"
            featured={false}
          />
        </AnimateIn>
      </div>

      {/* Note */}
      <div className="container" style={{ textAlign: 'center', marginTop: 40 }}>
        <p
          style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
          }}
        >
          {t('pricing_note')}
        </p>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pricing-grid { grid-template-columns: 1fr !important; max-width: 420px !important; margin: 0 auto; }
        }
      `}</style>
    </div>
  )
}

interface PricingCardProps {
  name: string
  price: string
  perYear: string
  priceFrom?: string
  target: string
  features: string[]
  ctaLabel: string
  onCta: () => void
  accent: string
  featured: boolean
  popularLabel?: string
}

function PricingCard({
  name,
  price,
  perYear,
  priceFrom,
  target,
  features,
  ctaLabel,
  onCta,
  accent,
  featured,
  popularLabel,
}: PricingCardProps) {
  return (
    <div
      style={{
        position: 'relative',
        background: featured
          ? `linear-gradient(160deg, rgba(${hexToRgb(accent)}, 0.12) 0%, rgba(0,0,0,0.6) 100%)`
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${featured ? accent + '55' : 'var(--border-dim)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '32px 28px',
        backdropFilter: 'blur(12px)',
        transform: featured ? 'scale(1.03)' : 'scale(1)',
        boxShadow: featured ? `0 0 40px ${accent}22` : 'none',
      }}
    >
      {featured && popularLabel && (
        <div
          style={{
            position: 'absolute',
            top: -14,
            left: '50%',
            transform: 'translateX(-50%)',
            background: accent,
            color: '#000',
            fontFamily: 'Orbitron, monospace',
            fontWeight: 700,
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            padding: '4px 16px',
            borderRadius: 'var(--radius-pill)',
            whiteSpace: 'nowrap',
          }}
        >
          {popularLabel}
        </div>
      )}

      {/* Tier name */}
      <div
        style={{
          fontFamily: 'Orbitron, monospace',
          fontWeight: 700,
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          color: accent,
          marginBottom: 16,
          textShadow: `0 0 12px ${accent}66`,
        }}
      >
        {name}
      </div>

      {/* Price */}
      <div style={{ marginBottom: 8 }}>
        <span
          style={{
            fontFamily: 'Orbitron, monospace',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            color: '#ffffff',
            lineHeight: 1,
          }}
        >
          {price}
        </span>
        {price !== 'CUSTOM' && price !== 'INDIVIDUAL' && (
          <span
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginLeft: 6,
            }}
          >
            {perYear}
          </span>
        )}
      </div>

      {priceFrom && (
        <div
          style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.75rem',
            color: accent,
            marginBottom: 8,
            letterSpacing: '0.05em',
          }}
        >
          {priceFrom}
        </div>
      )}

      {/* Target */}
      <p
        style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: 28,
          minHeight: 48,
        }}
      >
        {target}
      </p>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, ${accent}33, transparent)`,
          marginBottom: 24,
        }}
      />

      {/* Features */}
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
        {features.map((f, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              marginBottom: 10,
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
            }}
          >
            <span style={{ color: accent, flexShrink: 0, marginTop: 1, fontSize: '0.9rem' }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onCta}
        style={{
          width: '100%',
          padding: '13px 24px',
          background: featured ? accent : 'transparent',
          border: `1px solid ${accent}`,
          borderRadius: 'var(--radius-sm)',
          color: featured ? '#000' : accent,
          fontFamily: 'Orbitron, monospace',
          fontWeight: 700,
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          if (!featured) {
            ;(e.currentTarget as HTMLButtonElement).style.background = accent + '22'
          }
        }}
        onMouseLeave={e => {
          if (!featured) {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
          }
        }}
      >
        {ctaLabel}
      </button>
    </div>
  )
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
