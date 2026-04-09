import { useState } from 'react'
import { useModal } from '../context/ModalContext'
import { useLanguage } from '../context/LanguageContext'
import { Link, useNavigate } from 'react-router-dom'

function DashboardWidget() {
  const bars = [42, 67, 35, 88, 52, 74, 29, 91, 61, 45, 78, 55]
  const riskItems = [
    { name: 'Global Trade Solutions', risk: 92, color: '#D94040' },
    { name: 'Invest Capital UZ', risk: 88, color: '#D94040' },
    { name: 'Fergana Chemicals', risk: 38, color: '#E07B39' },
    { name: 'Qurilish Invest', risk: 35, color: '#E07B39' },
    { name: 'Uzbekneftegaz', risk: 25, color: '#C9A84C' },
    { name: 'UzAuto Motors', risk: 15, color: '#2EAEE8' },
  ]
  return (
    <div style={{ background: 'rgba(12,20,40,0.95)', border: '1px solid rgba(46,174,232,0.18)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.5)', fontFamily: 'Share Tech Mono, monospace' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(46,174,232,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(7,12,24,0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="status-dot" />
          <span style={{ fontSize: '0.6rem', color: '#2EAEE8', letterSpacing: '0.15em' }}>ARGUS — RISK ANALYTICS</span>
        </div>
        <span style={{ fontSize: '0.55rem', color: '#526080' }}>50 ENTITIES · LIVE</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ padding: '14px 16px', borderRight: '1px solid rgba(46,174,232,0.08)' }}>
          <div style={{ fontSize: '0.55rem', color: '#526080', marginBottom: 10, letterSpacing: '0.1em' }}>RISK SCORE DISTRIBUTION</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 70 }}>
            {bars.map((h, i) => (<div key={i} style={{ flex: 1, borderRadius: '2px 2px 0 0', height: h + '%', background: h > 75 ? '#D94040' : h > 50 ? '#E07B39' : h > 35 ? '#C9A84C' : '#2EAEE8', opacity: 0.85 }} />))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: '0.5rem', color: '#526080' }}>LOW</span>
            <span style={{ fontSize: '0.5rem', color: '#526080' }}>HIGH</span>
          </div>
        </div>
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '0.55rem', color: '#526080', marginBottom: 10, letterSpacing: '0.1em' }}>KEY METRICS</div>
          {[{label:'Companies',value:'50',color:'#2EAEE8'},{label:'Connections',value:'24',color:'#1A6DB5'},{label:'Anomalies',value:'2 ⚠',color:'#D94040'},{label:'Avg Risk',value:'21%',color:'#C9A84C'}].map(m => (
            <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.55rem', color: '#526080' }}>{m.label}</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: m.color }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(46,174,232,0.08)', padding: '12px 16px' }}>
        <div style={{ fontSize: '0.55rem', color: '#526080', marginBottom: 8, letterSpacing: '0.1em' }}>TOP RISK ENTITIES</div>
        {riskItems.map(item => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.58rem', color: '#8A9BBF', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
            <div style={{ width: 80, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ width: item.risk + '%', height: '100%', background: item.color, borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: item.color, width: 22, textAlign: 'right', flexShrink: 0 }}>{item.risk}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const MODULES = [
  { id: 'argus', name: 'ARGUS', status: 'LIVE', link: '/argus', color: '#2EAEE8', desc: { en: 'Enterprise graph analytics. Map company connections, ownership chains, and anomalies across 50+ Uzbek entities.', ru: 'Корпоративная граф-аналитика. Карта связей, цепочки собственности, аномалии по 50+ предприятиям.', uz: 'Korporativ grafik tahlil. 50+ korxona aloqalari va anomaliyalarni xaritalash.' } },
  { id: 'nexus', name: 'NEXUS', status: 'LIVE', link: '/nexus', color: '#1B9AAA', desc: { en: 'Government intelligence. Monitor 25 state structures, track tenders and detect conflicts of interest.', ru: 'Государственная разведка. Мониторинг 25 госструктур, тендеры, конфликты интересов.', uz: 'Davlat razvedkasi. 25 tuzilma, tenderlar, manfaatlar toʻnashuvi.' } },
  { id: 'aurora', name: 'AURORA', status: 'SOON', link: '/aurora', color: '#C9A84C', desc: { en: 'AI layer powered by Claude API. Ask questions in Russian or Uzbek, get instant risk reports.', ru: 'AI-слой на Claude API. Вопросы на русском или узбекском, мгновенные риск-отчёты.', uz: 'Claude API AI qatlami. Rus yoki oʻzbek tilida tezkor tahlil.' } },
]

const STATS = [
  { value: '600K+', label: { en: 'Companies in UZ registry', ru: 'Компаний в реестре', uz: 'Reestrdagi kompaniyalar' } },
  { value: '$8B',   label: { en: 'Annual gov procurement', ru: 'Госзакупок в год', uz: 'Yillik davlat xaridlari' } },
  { value: '2 sec', label: { en: 'Analysis time', ru: 'Время анализа', uz: 'Tahlil vaqti' } },
  { value: '0',     label: { en: 'Local competitors', ru: 'Местных конкурентов', uz: 'Mahalliy raqobatchilar' } },
]

export default function Home() {
  const { openAccess } = useModal()
  const { language } = useLanguage()
  const lang = (language as 'en' | 'ru' | 'uz')
  const navigate = useNavigate()
  const [moduleModal, setModuleModal] = useState<string | null>(null)

  const hero = {
    en: { tag: 'Decision Intelligence Platform', h1a: 'INTELLIGENCE', h1b: 'THAT DECIDES.', sub: 'OMNIQ gives banks, enterprises and government agencies the power to see what is hidden — corporate graphs, risk scoring, fraud detection, AI analysis for Uzbekistan.', cta1: 'Explore ARGUS', cta2: 'Request Access' },
    ru: { tag: 'Платформа разведки данных', h1a: 'ИНТЕЛЛЕКТ,', h1b: 'КОТОРЫЙ РЕШАЕТ.', sub: 'OMNIQ даёт банкам, предприятиям и госорганам видеть скрытое — графы, риск-скоринг, мошенничество, AI-анализ.', cta1: 'Открыть ARGUS', cta2: 'Запросить доступ' },
    uz: { tag: 'Qaror razvedkasi platformasi', h1a: 'YASHIRINNI', h1b: "KO'RADIGAN AI.", sub: 'OMNIQ banklarga, korxonalarga va davlat idoralariga yashirinni koʻrishga yordam beradi.', cta1: 'ARGUS ni ochish', cta2: 'Kirish' },
  }
  const h = hero[lang]

  const badges = {
    en: ['Soliq + Bojxona integrated', 'On-premise for gov', '2-second analysis'],
    ru: ['Солиқ + Божхона интеграция', 'On-premise для госорганов', 'Анализ за 2 секунды'],
    uz: ['Soliq + Bojxona', 'Davlat organlari uchun', '2 soniyada tahlil'],
  }

  const why = {
    en: { label: 'COMPETITIVE EDGE', h: 'Palantir for Central Asia', p: 'The only platform with deep integration into Uzbekistan state systems. Where Deloitte charges $200K, OMNIQ delivers for $2K/month.', items: ['Soliq + Bojxona + my.gov.uz + zakupki.uz', 'AI in Russian and Uzbek language', 'On-premise for government clients', 'Zero strong local competitors'] },
    ru: { label: 'КОНКУРЕНТНОЕ ПРЕИМУЩЕСТВО', h: 'Palantir для Центральной Азии', p: 'Единственная платформа с глубокой интеграцией в госсистемы. Deloitte берёт $200K — OMNIQ даёт результат за $2K/мес.', items: ['Солиқ + Божхона + my.gov.uz + zakupki.uz', 'AI на русском и узбекском', 'On-premise для госклиентов', 'Ноль сильных конкурентов'] },
    uz: { label: 'RAQOBAT USTUNLIGI', h: 'Markaziy Osiyo uchun Palantir', p: 'Oʻzbekiston davlat tizimlariga chuqur integratsiya. Deloitte $200K oladi, OMNIQ $2K/oyga beradi.', items: ['Soliq + Bojxona + my.gov.uz', 'Rus va oʻzbek tilida AI', 'Davlat mijozlari uchun', 'Bozorda raqobatchi yoʻq'] },
  }
  const w = why[lang]

  const cta = {
    en: { h: 'Ready to see what is hidden?', p: 'Platform is live. Demo takes 30 minutes.', btn1: 'Open platform', btn2: 'Contact us' },
    ru: { h: 'Готовы увидеть скрытое?', p: 'Платформа уже работает. Демо займёт 30 минут.', btn1: 'Открыть платформу', btn2: 'Связаться' },
    uz: { h: 'Yashirinni koʻrishga tayyormisiz?', p: 'Platforma ishlaydi. Demo 30 daqiqa.', btn1: 'Platformani ochish', btn2: 'Bogʻlaning' },
  }
  const c = cta[lang]

  const comparRows = [
    ['', 'OMNIQ', 'Palantir', 'Tableau'],
    [lang === 'ru' ? 'Интеграция Солиқ' : 'Soliq integration', '✓', '✗', '✗'],
    [lang === 'ru' ? 'Тендеры zakupki.uz' : 'zakupki.uz', '✓', '✗', '✗'],
    [lang === 'ru' ? 'AI на RU/UZ' : 'AI in RU/UZ', '✓', '✗', '✗'],
    [lang === 'ru' ? 'Граф связей' : 'Graph', '✓', '✓', '✗'],
    [lang === 'ru' ? 'Антифрод' : 'Antifraud', '✓', '✓', '✗'],
    [lang === 'ru' ? 'Цена/мес' : 'Price/mo', '$500+', '$100K+', '$3K+'],
  ]

  const btnPrimary: React.CSSProperties = { padding: '11px 24px', background: '#1A6DB5', color: '#fff', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9rem', border: '1px solid rgba(46,174,232,0.3)', cursor: 'pointer', transition: 'all 200ms' }
  const btnGhost: React.CSSProperties  = { padding: '11px 24px', background: 'transparent', color: '#2EAEE8', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.9rem', border: '1px solid rgba(46,174,232,0.3)', cursor: 'pointer', transition: 'all 200ms' }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 64 }}>

      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <span className="status-dot" />
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: '#2EAEE8', letterSpacing: '0.18em' }}>{h.tag.toUpperCase()}</span>
          </div>
          <h1 style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, lineHeight: 1.05, marginBottom: 24 }}>
            <span style={{ display: 'block', fontSize: 'clamp(2.4rem,5vw,4rem)', color: '#E8EDF5' }}>{h.h1a}</span>
            <span style={{ display: 'block', fontSize: 'clamp(2.4rem,5vw,4rem)', background: 'linear-gradient(135deg,#2EAEE8,#1B9AAA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{h.h1b}</span>
          </h1>
          <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#8A9BBF', marginBottom: 36, maxWidth: 480 }}>{h.sub}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/argus" style={{ ...btnPrimary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background='#2EAEE8';el.style.boxShadow='0 0 24px rgba(46,174,232,0.3)';}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background='#1A6DB5';el.style.boxShadow='none';}}
            >{h.cta1} →</Link>
            <button onClick={openAccess} style={btnGhost}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(46,174,232,0.08)';}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';}}
            >{h.cta2}</button>
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(46,174,232,0.08)' }}>
            {badges[lang].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.85rem' }}>{['\uD83D\uDEE1','\uD83D\uDD12','\u26A1'][i]}</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#526080' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -40, background: 'radial-gradient(ellipse at center,rgba(26,109,181,0.12),transparent 70%)', pointerEvents: 'none' }} />
          <DashboardWidget />
        </div>
      </section>

      <div style={{ borderTop: '1px solid rgba(46,174,232,0.08)', borderBottom: '1px solid rgba(46,174,232,0.08)', background: 'rgba(12,20,40,0.5)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(46,174,232,0.08)' : 'none', padding: '8px 0' }}>
              <div style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.8rem', color: '#2EAEE8', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: '#526080', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label[lang]}</div>
            </div>
          ))}
        </div>
      </div>

      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span className="status-dot" />
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: '#2EAEE8', letterSpacing: '0.18em' }}>{lang==='ru'?'МОДУЛИ ПЛАТФОРМЫ':lang==='uz'?'PLATFORMA MODULLARI':'PLATFORM MODULES'}</span>
          </div>
          <h2 style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#E8EDF5' }}>{lang==='ru'?'Три слоя аналитики':lang==='uz'?'Tahlilning uch qatlami':'Three Layers of Intelligence'}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {MODULES.map(mod => (
            <div key={mod.id} style={{ background: 'var(--bg-card)', border: '1px solid rgba(46,174,232,0.1)', borderRadius: 8, padding: '28px 24px', transition: 'all 200ms', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='rgba(46,174,232,0.3)';el.style.transform='translateY(-3px)';}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='rgba(46,174,232,0.1)';el.style.transform='none';}}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: mod.color }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.2rem', color: mod.color, letterSpacing: '0.08em' }}>{mod.name}</span>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.55rem', padding: '3px 8px', borderRadius: 4, background: mod.status==='LIVE'?'rgba(46,174,232,0.12)':'rgba(201,168,76,0.12)', color: mod.status==='LIVE'?'#2EAEE8':'#C9A84C', border: mod.status==='LIVE'?'1px solid rgba(46,174,232,0.2)':'1px solid rgba(201,168,76,0.2)' }}>{mod.status==='LIVE'?'● LIVE':'○ SOON'}</span>
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.65, color: '#8A9BBF', marginBottom: 24, minHeight: 72 }}>{mod.desc[lang]}</p>
              {mod.status==='LIVE'?(
                <button onClick={() => setModuleModal(mod.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 500, color: mod.color, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', padding: 0 }}>{lang==='ru'?'Открыть':lang==='uz'?'Ochish':'Open module'} →</button>
              ):(
                <button onClick={openAccess} style={{ fontSize: '0.82rem', fontWeight: 500, color: '#526080', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', padding: 0 }}>{lang==='ru'?'Ранний доступ':lang==='uz'?'Erta kirish':'Early access'} →</button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'rgba(12,20,40,0.5)', borderTop: '1px solid rgba(46,174,232,0.08)', borderBottom: '1px solid rgba(46,174,232,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span className="status-dot" />
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: '#2EAEE8', letterSpacing: '0.18em' }}>{w.label}</span>
              </div>
              <h2 style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: 'clamp(1.4rem,2.5vw,1.9rem)', color: '#E8EDF5', marginBottom: 20, lineHeight: 1.2 }}>{w.h}</h2>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: '#8A9BBF', marginBottom: 28 }}>{w.p}</p>
              {w.items.map(item => (
                <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                  <span style={{ color: '#2EAEE8', fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '0.88rem', color: '#8A9BBF' }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(46,174,232,0.12)', borderRadius: 8, overflow: 'hidden' }}>
              {comparRows.map((row, ri) => (
                <div key={ri} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: ri<comparRows.length-1?'1px solid rgba(46,174,232,0.06)':'none', background: ri===0?'rgba(7,12,24,0.8)':ri%2===0?'transparent':'rgba(255,255,255,0.01)' }}>
                  {row.map((cell, ci) => (
                    <div key={ci} style={{ padding: '10px 14px', fontFamily: ci===0?'Inter, sans-serif':'Share Tech Mono, monospace', fontSize: ri===0?'0.6rem':'0.75rem', fontWeight: ri===0||ci===1?700:400, color: ri===0?'#526080':ci===1&&cell==='✓'?'#2EAEE8':ci===1&&cell==='✗'?'#D94040':cell==='✓'?'#526080':cell==='✗'?'#2A3547':ci===1?'#2EAEE8':'#526080', textAlign: ci>0?'center':'left', letterSpacing: ri===0?'0.1em':0 }}>{cell}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: 'clamp(1.4rem,2.5vw,2rem)', color: '#E8EDF5', marginBottom: 16 }}>{c.h}</h2>
          <p style={{ fontSize: '0.95rem', color: '#8A9BBF', marginBottom: 32, lineHeight: 1.7 }}>{c.p}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/argus" style={{ ...btnPrimary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background='#2EAEE8';el.style.boxShadow='0 0 28px rgba(46,174,232,0.3)';}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background='#1A6DB5';el.style.boxShadow='none';}}
            >{c.btn1} →</Link>
            <button onClick={openAccess} style={{ ...btnGhost }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(46,174,232,0.08)';}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';}}
            >{c.btn2}</button>
          </div>
        </div>
      </section>

      {/* Module detail modal */}
      {moduleModal && (() => {
        const mod = MODULES.find(m => m.id === moduleModal)
        if (!mod) return null
        const isHex = mod.color.startsWith('#')
        const rgb = isHex ? `${parseInt(mod.color.slice(1,3),16)}, ${parseInt(mod.color.slice(3,5),16)}, ${parseInt(mod.color.slice(5,7),16)}` : '46,174,232'
        return (
          <div onClick={e => { if (e.target === e.currentTarget) setModuleModal(null) }}
            style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(5,5,8,0.88)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'fadeIn 180ms ease' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-card)', border: `1px solid rgba(${rgb}, 0.4)`, borderRadius: 16, boxShadow: `0 0 80px rgba(${rgb}, 0.15), 0 24px 60px rgba(0,0,0,0.6)`, animation: 'slideUp 220ms cubic-bezier(0.22,1,0.36,1)' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${mod.color}, transparent)`, borderRadius: '16px 16px 0 0' }} />
              <div style={{ padding: '28px 28px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span className="status-dot" />
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.18em', color: mod.color }}>OMNIQ MODULE</span>
                  </div>
                  <h2 style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: 'clamp(1.4rem,3vw,1.9rem)', letterSpacing: '0.08em', color: mod.color, textShadow: `0 0 24px rgba(${rgb}, 0.5)`, marginBottom: 4 }}>{mod.name}</h2>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', color: `rgba(${rgb}, 0.7)`, textTransform: 'uppercase' }}>{mod.status === 'LIVE' ? '● LIVE' : '○ COMING SOON'}</div>
                </div>
                <button onClick={() => setModuleModal(null)} aria-label="Close" style={{ flexShrink: 0, width: 36, height: 36, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#526080', fontSize: '1.1rem', lineHeight: 1, transition: 'all 150ms ease' }} onMouseEnter={e => { e.currentTarget.style.borderColor = mod.color; e.currentTarget.style.color = mod.color }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#526080' }}>✕</button>
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '20px 28px' }} />
              <div style={{ padding: '0 28px 28px' }}>
                <p style={{ fontSize: '0.9rem', color: '#8A9BBF', lineHeight: 1.75, marginBottom: 28 }}>{mod.desc[lang]}</p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {mod.status === 'LIVE' ? (
                    <button onClick={() => { setModuleModal(null); navigate(mod.link) }}
                      style={{ flex: 1, minWidth: 160, padding: '13px 24px', fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.14em', cursor: 'pointer', border: 'none', borderRadius: 6, background: `linear-gradient(135deg, ${mod.color}, rgba(${rgb},0.7))`, color: '#050508', boxShadow: `0 4px 24px rgba(${rgb},0.4)`, transition: 'all 200ms ease' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 32px rgba(${rgb},0.6)` }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 24px rgba(${rgb},0.4)` }}
                    >{lang === 'ru' ? 'ОТКРЫТЬ' : lang === 'uz' ? 'OCHISH' : 'OPEN'} {mod.name} →</button>
                  ) : (
                    <button onClick={() => { setModuleModal(null); openAccess() }}
                      style={{ flex: 1, minWidth: 160, padding: '13px 24px', fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.14em', cursor: 'pointer', border: `1px solid rgba(${rgb},0.4)`, borderRadius: 6, background: `rgba(${rgb},0.08)`, color: mod.color, transition: 'all 200ms ease' }}
                    >{lang === 'ru' ? 'РАННИЙ ДОСТУП' : lang === 'uz' ? 'ERTA KIRISH' : 'EARLY ACCESS'} →</button>
                  )}
                  <button onClick={() => setModuleModal(null)}
                    style={{ padding: '12px 24px', fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.12em', cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#526080', transition: 'all 200ms ease' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = mod.color; e.currentTarget.style.color = mod.color }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#526080' }}
                  >{lang === 'ru' ? 'ЗАКРЫТЬ' : lang === 'uz' ? 'YOPISH' : 'CLOSE'}</button>
                </div>
              </div>
            </div>
            <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(24px) scale(0.97)}to{opacity:1;transform:none}}`}</style>
          </div>
        )
      })()}
    </main>
  )
}
