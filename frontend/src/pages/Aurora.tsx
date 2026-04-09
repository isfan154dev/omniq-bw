import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { useLanguage } from '../context/LanguageContext'
import { useModal } from '../context/ModalContext'

const FORECAST_DATA = [
  { month: 'Jan', actual: 4.2, forecast: null,  lower: null,  upper: null  },
  { month: 'Feb', actual: 4.5, forecast: null,  lower: null,  upper: null  },
  { month: 'Mar', actual: 4.1, forecast: null,  lower: null,  upper: null  },
  { month: 'Apr', actual: 4.8, forecast: null,  lower: null,  upper: null  },
  { month: 'May', actual: 5.1, forecast: null,  lower: null,  upper: null  },
  { month: 'Jun', actual: 4.9, forecast: null,  lower: null,  upper: null  },
  { month: 'Jul', actual: 5.3, forecast: null,  lower: null,  upper: null  },
  { month: 'Aug', actual: 5.0, forecast: 5.0,   lower: 4.7,   upper: 5.3   },
  { month: 'Sep', actual: null, forecast: 5.4,  lower: 4.9,   upper: 5.9   },
  { month: 'Oct', actual: null, forecast: 5.7,  lower: 5.0,   upper: 6.4   },
  { month: 'Nov', actual: null, forecast: 5.5,  lower: 4.6,   upper: 6.4   },
  { month: 'Dec', actual: null, forecast: 6.0,  lower: 4.9,   upper: 7.1   },
]

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) => {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid rgba(0,0,0,0.3)',
        borderRadius: 8,
        padding: '10px 14px',
        fontFamily: 'Share Tech Mono, monospace',
        fontSize: '0.72rem',
        color: 'var(--text-secondary)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
      }}
    >
      <div style={{ color: 'var(--accent-teal)', marginBottom: 6, letterSpacing: '0.1em' }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: {p.value?.toFixed(1)}%
        </div>
      ))}
    </div>
  )
}

export default function Aurora() {
  const { t } = useLanguage()
  const { openAccess } = useModal()

  const FEATURES = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2 16L6 10l4 3 4-7 4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 10v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
          <circle cx="18" cy="9" r="1.5" fill="currentColor"/>
        </svg>
      ),
      title: t('aurora_feat1_title'),
      desc: t('aurora_feat1_desc'),
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 3v14M3 10h14M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      title: t('aurora_feat2_title'),
      desc: t('aurora_feat2_desc'),
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 16V10M8 16V7M12 16v-5M16 16V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M2 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: t('aurora_feat3_title'),
      desc: t('aurora_feat3_desc'),
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="4" r="2" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="4" cy="14" r="2" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="16" cy="14" r="2" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="10" y1="6" x2="7" y2="12" stroke="currentColor" strokeWidth="1.2"/>
          <line x1="10" y1="6" x2="13" y2="12" stroke="currentColor" strokeWidth="1.2"/>
          <line x1="7" y1="14" x2="13" y2="14" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      ),
      title: t('aurora_feat4_title'),
      desc: t('aurora_feat4_desc'),
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L13 8H19L14.5 11.5L16 17L10 14L4 17L5.5 11.5L1 8H7L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      ),
      title: t('aurora_feat5_title'),
      desc: t('aurora_feat5_desc'),
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 6h14M3 10h10M3 14h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="16" cy="14" r="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M15 14l1 1 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
      title: t('aurora_feat6_title'),
      desc: t('aurora_feat6_desc'),
    },
  ]

  const USE_CASES = [
    {
      title: t('aurora_uc1_title'),
      description: t('aurora_uc1_desc'),
      tags: ['GDP Forecasting', 'Inflation Modeling', 'FDI Analysis'],
      color: '#3a3a3a',
    },
    {
      title: t('aurora_uc2_title'),
      description: t('aurora_uc2_desc'),
      tags: ['Budget Optimization', 'Impact Modeling', 'Priority Scoring'],
      color: '#5a5a5a',
    },
    {
      title: t('aurora_uc3_title'),
      description: t('aurora_uc3_desc'),
      tags: ['Long-horizon Planning', 'Scenario Branching', 'Strategic Options'],
      color: '#0a0a0a',
    },
  ]

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero */}
      <section
        className="page-hero"
        style={{
          background: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '60vw',
            height: '60vh',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div className="scanline-overlay" />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span className="badge badge-green">{t('aurora_badge1')}</span>
            <span className="badge badge-cyan">{t('aurora_badge2')}</span>
          </div>

          <h1 className="page-hero-title">
            <span
              style={{
                background: 'linear-gradient(135deg, #3a3a3a 0%, #0a0a0a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'block',
              }}
            >
              AURORA
            </span>
            <span style={{ fontSize: '0.5em', color: 'var(--text-secondary)', fontWeight: 400, display: 'block', marginTop: 8 }}>
              {t('aurora_tagline')}
            </span>
          </h1>

          <p className="page-hero-subtitle">{t('aurora_hero_subtitle')}</p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button onClick={openAccess} className="btn-primary" style={{ background: '#0a0a0a', color: '#ffffff' }}>
              {t('aurora_btn_access')}
            </button>
            <button onClick={openAccess} className="btn-ghost" style={{ color: '#0a0a0a', borderColor: '#d4d4d0' }}>
              {t('aurora_btn_docs')}
            </button>
          </div>
        </div>
      </section>

      {/* Forecast chart */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ marginBottom: 36 }}>
            <div className="section-label">{t('aurora_chart_label')}</div>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}>
              {t('aurora_chart_title')}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'Share Tech Mono, monospace', letterSpacing: '0.06em' }}>
              {t('aurora_chart_subtitle')}
            </p>
          </div>

          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(0,0,0,0.2)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
            }}
          >
            {/* Chart header */}
            <div
              style={{
                padding: '14px 24px',
                borderBottom: '1px solid var(--border-dim)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <span className="status-dot" />
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.72rem', color: '#0a0a0a', letterSpacing: '0.1em' }}>
                AURORA FORECAST ENGINE v2.4
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
                {[
                  { color: '#3a3a3a', label: t('aurora_legend_actual') },
                  { color: '#5a5a5a', label: t('aurora_legend_forecast') },
                  { color: 'rgba(0,0,0,0.2)', label: t('aurora_legend_band') },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 16, height: 3, background: item.color, borderRadius: 2 }} />
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recharts */}
            <div style={{ padding: '24px 16px 16px', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={FORECAST_DATA} margin={{ top: 8, right: 20, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e6" vertical={false}/>
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'var(--text-muted)', fontFamily: 'Share Tech Mono', fontSize: 11 }}
                    axisLine={{ stroke: 'var(--border-dim)' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[3.5, 7.5]}
                    tick={{ fill: 'var(--text-muted)', fontFamily: 'Share Tech Mono', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => `${v}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine x="Aug" stroke="#d4d4d0" strokeDasharray="4 2" label={{ value: 'NOW', fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'Share Tech Mono' }}/>

                  <Line dataKey="upper" stroke="rgba(0,0,0,0.15)" strokeWidth={0} dot={false} name="Upper bound" connectNulls />
                  <Line dataKey="lower" stroke="rgba(0,0,0,0.15)" strokeWidth={0} dot={false} name="Lower bound" connectNulls />
                  <Line
                    dataKey="actual"
                    stroke="#3a3a3a"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#3a3a3a', strokeWidth: 0 }}
                    name={t('aurora_legend_actual')}
                    connectNulls
                  />
                  <Line
                    dataKey="forecast"
                    stroke="#5a5a5a"
                    strokeWidth={2}
                    strokeDasharray="5 3"
                    dot={{ r: 3, fill: '#5a5a5a', strokeWidth: 0 }}
                    name={t('aurora_legend_forecast')}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Model stats footer */}
            <div
              style={{
                padding: '12px 24px',
                borderTop: '1px solid var(--border-dim)',
                display: 'flex',
                gap: 24,
                flexWrap: 'wrap',
              }}
            >
              {[
                { label: t('aurora_stat_model'), value: 'LSTM + XGBoost Ensemble' },
                { label: t('aurora_stat_mape'), value: '1.3%' },
                { label: t('aurora_stat_conf'), value: '90%' },
                { label: t('aurora_stat_updated'), value: t('aurora_stat_updated_val') },
              ].map(s => (
                <div key={s.label}>
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{s.label}: </span>
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.65rem', color: '#0a0a0a' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: 40 }}>
            <div className="section-label">{t('aurora_feat_label')}</div>
            <h2 className="section-title">{t('aurora_feat_title')}</h2>
          </div>
          <div className="feature-grid">
            {FEATURES.map(feat => (
              <div key={feat.title} className="feature-item">
                <div className="feature-icon" style={{ background: 'rgba(0,0,0,0.08)', borderColor: 'rgba(0,0,0,0.25)', color: '#3a3a3a' }}>
                  {feat.icon}
                </div>
                <div className="feature-title">{feat.title}</div>
                <div className="feature-desc">{feat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ marginBottom: 40 }}>
            <div className="section-label">{t('aurora_uc_label')}</div>
            <h2 className="section-title">{t('aurora_uc_title')}</h2>
          </div>
          <div className="use-case-grid">
            {USE_CASES.map(uc => (
              <div
                key={uc.title}
                className="use-case-card"
                style={{ borderColor: `${uc.color}22` }}
              >
                <div
                  style={{
                    width: 6,
                    height: 40,
                    background: uc.color,
                    borderRadius: 3,
                    marginBottom: 20,
                    boxShadow: 'none',
                  }}
                />
                <h4 style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.9rem', letterSpacing: '0.05em', color: uc.color, marginBottom: 10 }}>
                  {uc.title}
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
                  {uc.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {uc.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: 'Share Tech Mono, monospace',
                        fontSize: '0.65rem',
                        padding: '3px 8px',
                        border: `1px solid ${uc.color}44`,
                        borderRadius: 'var(--radius-pill)',
                        color: uc.color,
                        opacity: 0.8,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
