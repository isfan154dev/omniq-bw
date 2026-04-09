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
    <div style={{ paddingTop: 100, paddingBottom: 80, minHeight: '100vh', background: '#ffffff' }}>
      <AnimateIn direction="up" style={{ textAlign: 'center', marginBottom: 64 }} className="container">
        <div className="section-label" style={{ justifyContent: 'center', marginBottom: 20 }}>
          {t('pricing_label')}
        </div>
        <h1
          style={{
            fontFamily: 'Orbitron, monospace',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: '#0a0a0a',
            marginBottom: 16,
          }}
        >
          {t('pricing_title')}
        </h1>
        <p
          style={{
            fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
            color: '#3a3a3a',
            maxWidth: 620,
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          {t('pricing_subtitle')}
        </p>
      </AnimateIn>

      <div
        className="container pricing-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          maxWidth: 1100,
          alignItems: 'start',
        }}
      >
        <AnimateIn direction="up" delay={0}>
          <PricingCard
            name={t('pricing_starter_name')}
            price={t('pricing_starter_price')}
            perYear={t('pricing_per_year')}
            target={t('pricing_starter_target')}
            features={starterFeatures}
            ctaLabel={t('pricing_cta_starter')}
            onCta={openAccess}
            accent="#0a0a0a"
            featured={false}
          />
        </AnimateIn>

        <AnimateIn direction="up" delay={120}>
          <PricingCard
            name={t('pricing_growth_name')}
            price={t('pricing_growth_price')}
            perYear={t('pricing_per_year')}
            target={t('pricing_growth_target')}
            features={growthFeatures}
            ctaLabel={t('pricing_cta_growth')}
            onCta={openAccess}
            accent="#2a2a2a"
            featured
            popularLabel={t('pricing_popular')}
          />
        </AnimateIn>

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
            accent="#3a3a3a"
            featured={false}
          />
        </AnimateIn>
      </div>

      <div className="container" style={{ textAlign: 'center', marginTop: 40 }}>
        <p
          style={{
            fontFamily: 'Courier New, monospace',
            fontSize: '0.7rem',
            color: '#8a8a8a',
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
        background: '#ffffff',
        border: '1px solid #d4d4d0',
        borderRadius: 'var(--radius-lg)',
        padding: '32px 28px',
        transform: featured ? 'scale(1.02)' : 'scale(1)',
        boxShadow: featured ? '0 16px 32px rgba(0,0,0,0.08)' : '0 8px 20px rgba(0,0,0,0.04)',
      }}
    >
      {featured && popularLabel && (
        <div
          style={{
            position: 'absolute',
            top: -14,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#0a0a0a',
            color: '#ffffff',
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

      <div
        style={{
          fontFamily: 'Orbitron, monospace',
          fontWeight: 700,
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          color: featured ? '#0a0a0a' : accent,
          marginBottom: 16,
        }}
      >
        {name}
      </div>

      <div style={{ marginBottom: 8 }}>
        <span
          style={{
            fontFamily: 'Orbitron, monospace',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            color: '#0a0a0a',
            lineHeight: 1,
          }}
        >
          {price}
        </span>
        {price !== 'CUSTOM' && price !== 'INDIVIDUAL' && (
          <span
            style={{
              fontFamily: 'Courier New, monospace',
              fontSize: '0.85rem',
              color: '#8a8a8a',
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
            fontFamily: 'Courier New, monospace',
            fontSize: '0.75rem',
            color: '#3a3a3a',
            marginBottom: 8,
            letterSpacing: '0.05em',
          }}
        >
          {priceFrom}
        </div>
      )}

      <p
        style={{
          fontSize: '0.85rem',
          color: '#3a3a3a',
          lineHeight: 1.5,
          marginBottom: 28,
          minHeight: 48,
        }}
      >
        {target}
      </p>

      <div
        style={{
          height: 1,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.12), transparent)',
          marginBottom: 24,
        }}
      />

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
        {features.map((feature, index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              marginBottom: 10,
              fontSize: '0.85rem',
              color: '#3a3a3a',
              lineHeight: 1.4,
            }}
          >
            <span style={{ color: '#0a0a0a', flexShrink: 0, marginTop: 1, fontSize: '0.9rem' }}>вњ“</span>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={onCta}
        style={{
          width: '100%',
          padding: '13px 24px',
          background: featured ? '#0a0a0a' : 'transparent',
          border: `1px solid ${featured ? '#0a0a0a' : '#d4d4d0'}`,
          borderRadius: 'var(--radius-sm)',
          color: featured ? '#ffffff' : '#0a0a0a',
          fontFamily: 'Orbitron, monospace',
          fontWeight: 700,
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          if (!featured) {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#0a0a0a'
          }
        }}
        onMouseLeave={e => {
          if (!featured) {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#d4d4d0'
          }
        }}
      >
        {ctaLabel}
      </button>
    </div>
  )
}
