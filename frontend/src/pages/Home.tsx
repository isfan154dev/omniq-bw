import { useState } from 'react'
import { useModal } from '../context/ModalContext'
import { useLanguage } from '../context/LanguageContext'
import { Link, useNavigate } from 'react-router-dom'

function DashboardWidget() {
  const bars = [42, 67, 35, 88, 52, 74, 29, 91, 61, 45, 78, 55]
  const riskItems = [
    { name: 'Global Trade Solutions', risk: 92, color: '#0a0a0a' },
    { name: 'Invest Capital UZ', risk: 88, color: '#0a0a0a' },
    { name: 'Fergana Chemicals', risk: 38, color: '#888888' },
    { name: 'Qurilish Invest', risk: 35, color: '#888888' },
    { name: 'Uzbekneftegaz', risk: 25, color: '#5a5a5a' },
    { name: 'UzAuto Motors', risk: 15, color: '#0a0a0a' },
  ]
  return (
    <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.18)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.5)', fontFamily: 'Share Tech Mono, monospace' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f5f5f3' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="status-dot" />
          <span style={{ fontSize: '0.6rem', color: '#0a0a0a', letterSpacing: '0.15em' }}>ARGUS вЂ” RISK ANALYTICS</span>
        </div>
        <span style={{ fontSize: '0.55rem', color: '#8a8a8a' }}>50 ENTITIES В· LIVE</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ padding: '14px 16px', borderRight: '1px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '0.55rem', color: '#8a8a8a', marginBottom: 10, letterSpacing: '0.1em' }}>RISK SCORE DISTRIBUTION</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 70 }}>
            {bars.map((h, i) => (<div key={i} style={{ flex: 1, borderRadius: '2px 2px 0 0', height: h + '%', background: h > 75 ? '#0a0a0a' : h > 50 ? '#888888' : h > 35 ? '#5a5a5a' : '#0a0a0a', opacity: 0.85 }} />))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: '0.5rem', color: '#8a8a8a' }}>LOW</span>
            <span style={{ fontSize: '0.5rem', color: '#8a8a8a' }}>HIGH</span>
          </div>
        </div>
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '0.55rem', color: '#8a8a8a', marginBottom: 10, letterSpacing: '0.1em' }}>KEY METRICS</div>
          {[{label:'Companies',value:'50',color:'#0a0a0a'},{label:'Connections',value:'24',color:'#2a2a2a'},{label:'Anomalies',value:'2 вљ ',color:'#0a0a0a'},{label:'Avg Risk',value:'21%',color:'#5a5a5a'}].map(m => (
            <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.55rem', color: '#8a8a8a' }}>{m.label}</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: m.color }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '12px 16px' }}>
        <div style={{ fontSize: '0.55rem', color: '#8a8a8a', marginBottom: 8, letterSpacing: '0.1em' }}>TOP RISK ENTITIES</div>
        {riskItems.map(item => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.58rem', color: '#3a3a3a', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
            <div style={{ width: 80, height: 4, background: 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
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
  { id: 'argus', name: 'ARGUS', status: 'LIVE', link: '/argus', color: '#0a0a0a', desc: { en: 'Enterprise graph analytics. Map company connections, ownership chains, and anomalies across 50+ Uzbek entities.', ru: 'РљРѕСЂРїРѕСЂР°С‚РёРІРЅР°СЏ РіСЂР°С„-Р°РЅР°Р»РёС‚РёРєР°. РљР°СЂС‚Р° СЃРІСЏР·РµР№, С†РµРїРѕС‡РєРё СЃРѕР±СЃС‚РІРµРЅРЅРѕСЃС‚Рё, Р°РЅРѕРјР°Р»РёРё РїРѕ 50+ РїСЂРµРґРїСЂРёСЏС‚РёСЏРј.', uz: 'Korporativ grafik tahlil. 50+ korxona aloqalari va anomaliyalarni xaritalash.' } },
  { id: 'nexus', name: 'NEXUS', status: 'LIVE', link: '/nexus', color: '#3a3a3a', desc: { en: 'Government intelligence. Monitor 25 state structures, track tenders and detect conflicts of interest.', ru: 'Р“РѕСЃСѓРґР°СЂСЃС‚РІРµРЅРЅР°СЏ СЂР°Р·РІРµРґРєР°. РњРѕРЅРёС‚РѕСЂРёРЅРі 25 РіРѕСЃСЃС‚СЂСѓРєС‚СѓСЂ, С‚РµРЅРґРµСЂС‹, РєРѕРЅС„Р»РёРєС‚С‹ РёРЅС‚РµСЂРµСЃРѕРІ.', uz: 'Davlat razvedkasi. 25 tuzilma, tenderlar, manfaatlar toК»nashuvi.' } },
  { id: 'aurora', name: 'AURORA', status: 'SOON', link: '/aurora', color: '#5a5a5a', desc: { en: 'AI layer powered by Claude API. Ask questions in Russian or Uzbek, get instant risk reports.', ru: 'AI-СЃР»РѕР№ РЅР° Claude API. Р’РѕРїСЂРѕСЃС‹ РЅР° СЂСѓСЃСЃРєРѕРј РёР»Рё СѓР·Р±РµРєСЃРєРѕРј, РјРіРЅРѕРІРµРЅРЅС‹Рµ СЂРёСЃРє-РѕС‚С‡С‘С‚С‹.', uz: 'Claude API AI qatlami. Rus yoki oК»zbek tilida tezkor tahlil.' } },
]

const STATS = [
  { value: '600K+', label: { en: 'Companies in UZ registry', ru: 'РљРѕРјРїР°РЅРёР№ РІ СЂРµРµСЃС‚СЂРµ', uz: 'Reestrdagi kompaniyalar' } },
  { value: '$8B',   label: { en: 'Annual gov procurement', ru: 'Р“РѕСЃР·Р°РєСѓРїРѕРє РІ РіРѕРґ', uz: 'Yillik davlat xaridlari' } },
  { value: '2 sec', label: { en: 'Analysis time', ru: 'Р’СЂРµРјСЏ Р°РЅР°Р»РёР·Р°', uz: 'Tahlil vaqti' } },
  { value: '0',     label: { en: 'Local competitors', ru: 'РњРµСЃС‚РЅС‹С… РєРѕРЅРєСѓСЂРµРЅС‚РѕРІ', uz: 'Mahalliy raqobatchilar' } },
]

export default function Home() {
  const { openAccess } = useModal()
  const { language } = useLanguage()
  const lang = (language as 'en' | 'ru' | 'uz')
  const navigate = useNavigate()
  const [moduleModal, setModuleModal] = useState<string | null>(null)

  const hero = {
    en: { tag: 'Decision Intelligence Platform', h1a: 'INTELLIGENCE', h1b: 'THAT DECIDES.', sub: 'OMNIQ gives banks, enterprises and government agencies the power to see what is hidden вЂ” corporate graphs, risk scoring, fraud detection, AI analysis for Uzbekistan.', cta1: 'Explore ARGUS', cta2: 'Request Access' },
    ru: { tag: 'РџР»Р°С‚С„РѕСЂРјР° СЂР°Р·РІРµРґРєРё РґР°РЅРЅС‹С…', h1a: 'РРќРўР•Р›Р›Р•РљРў,', h1b: 'РљРћРўРћР Р«Р™ Р Р•РЁРђР•Рў.', sub: 'OMNIQ РґР°С‘С‚ Р±Р°РЅРєР°Рј, РїСЂРµРґРїСЂРёСЏС‚РёСЏРј Рё РіРѕСЃРѕСЂРіР°РЅР°Рј РІРёРґРµС‚СЊ СЃРєСЂС‹С‚РѕРµ вЂ” РіСЂР°С„С‹, СЂРёСЃРє-СЃРєРѕСЂРёРЅРі, РјРѕС€РµРЅРЅРёС‡РµСЃС‚РІРѕ, AI-Р°РЅР°Р»РёР·.', cta1: 'РћС‚РєСЂС‹С‚СЊ ARGUS', cta2: 'Р—Р°РїСЂРѕСЃРёС‚СЊ РґРѕСЃС‚СѓРї' },
    uz: { tag: 'Qaror razvedkasi platformasi', h1a: 'YASHIRINNI', h1b: "KO'RADIGAN AI.", sub: 'OMNIQ banklarga, korxonalarga va davlat idoralariga yashirinni koК»rishga yordam beradi.', cta1: 'ARGUS ni ochish', cta2: 'Kirish' },
  }
  const h = hero[lang]

  const badges = {
    en: ['Soliq + Bojxona integrated', 'On-premise for gov', '2-second analysis'],
    ru: ['РЎРѕР»РёТ› + Р‘РѕР¶С…РѕРЅР° РёРЅС‚РµРіСЂР°С†РёСЏ', 'On-premise РґР»СЏ РіРѕСЃРѕСЂРіР°РЅРѕРІ', 'РђРЅР°Р»РёР· Р·Р° 2 СЃРµРєСѓРЅРґС‹'],
    uz: ['Soliq + Bojxona', 'Davlat organlari uchun', '2 soniyada tahlil'],
  }

  const why = {
    en: { label: 'COMPETITIVE EDGE', h: 'Palantir for Central Asia', p: 'The only platform with deep integration into Uzbekistan state systems. Where Deloitte charges $200K, OMNIQ delivers for $2K/month.', items: ['Soliq + Bojxona + my.gov.uz + zakupki.uz', 'AI in Russian and Uzbek language', 'On-premise for government clients', 'Zero strong local competitors'] },
    ru: { label: 'РљРћРќРљРЈР Р•РќРўРќРћР• РџР Р•РРњРЈР©Р•РЎРўР’Рћ', h: 'Palantir РґР»СЏ Р¦РµРЅС‚СЂР°Р»СЊРЅРѕР№ РђР·РёРё', p: 'Р•РґРёРЅСЃС‚РІРµРЅРЅР°СЏ РїР»Р°С‚С„РѕСЂРјР° СЃ РіР»СѓР±РѕРєРѕР№ РёРЅС‚РµРіСЂР°С†РёРµР№ РІ РіРѕСЃСЃРёСЃС‚РµРјС‹. Deloitte Р±РµСЂС‘С‚ $200K вЂ” OMNIQ РґР°С‘С‚ СЂРµР·СѓР»СЊС‚Р°С‚ Р·Р° $2K/РјРµСЃ.', items: ['РЎРѕР»РёТ› + Р‘РѕР¶С…РѕРЅР° + my.gov.uz + zakupki.uz', 'AI РЅР° СЂСѓСЃСЃРєРѕРј Рё СѓР·Р±РµРєСЃРєРѕРј', 'On-premise РґР»СЏ РіРѕСЃРєР»РёРµРЅС‚РѕРІ', 'РќРѕР»СЊ СЃРёР»СЊРЅС‹С… РєРѕРЅРєСѓСЂРµРЅС‚РѕРІ'] },
    uz: { label: 'RAQOBAT USTUNLIGI', h: 'Markaziy Osiyo uchun Palantir', p: 'OК»zbekiston davlat tizimlariga chuqur integratsiya. Deloitte $200K oladi, OMNIQ $2K/oyga beradi.', items: ['Soliq + Bojxona + my.gov.uz', 'Rus va oК»zbek tilida AI', 'Davlat mijozlari uchun', 'Bozorda raqobatchi yoК»q'] },
  }
  const w = why[lang]

  const cta = {
    en: { h: 'Ready to see what is hidden?', p: 'Platform is live. Demo takes 30 minutes.', btn1: 'Open platform', btn2: 'Contact us' },
    ru: { h: 'Р“РѕС‚РѕРІС‹ СѓРІРёРґРµС‚СЊ СЃРєСЂС‹С‚РѕРµ?', p: 'РџР»Р°С‚С„РѕСЂРјР° СѓР¶Рµ СЂР°Р±РѕС‚Р°РµС‚. Р”РµРјРѕ Р·Р°Р№РјС‘С‚ 30 РјРёРЅСѓС‚.', btn1: 'РћС‚РєСЂС‹С‚СЊ РїР»Р°С‚С„РѕСЂРјСѓ', btn2: 'РЎРІСЏР·Р°С‚СЊСЃСЏ' },
    uz: { h: 'Yashirinni koК»rishga tayyormisiz?', p: 'Platforma ishlaydi. Demo 30 daqiqa.', btn1: 'Platformani ochish', btn2: 'BogК»laning' },
  }
  const c = cta[lang]

  const comparRows = [
    ['', 'OMNIQ', 'Palantir', 'Tableau'],
    [lang === 'ru' ? 'РРЅС‚РµРіСЂР°С†РёСЏ РЎРѕР»РёТ›' : 'Soliq integration', 'вњ“', 'вњ—', 'вњ—'],
    [lang === 'ru' ? 'РўРµРЅРґРµСЂС‹ zakupki.uz' : 'zakupki.uz', 'вњ“', 'вњ—', 'вњ—'],
    [lang === 'ru' ? 'AI РЅР° RU/UZ' : 'AI in RU/UZ', 'вњ“', 'вњ—', 'вњ—'],
    [lang === 'ru' ? 'Р“СЂР°С„ СЃРІСЏР·РµР№' : 'Graph', 'вњ“', 'вњ“', 'вњ—'],
    [lang === 'ru' ? 'РђРЅС‚РёС„СЂРѕРґ' : 'Antifraud', 'вњ“', 'вњ“', 'вњ—'],
    [lang === 'ru' ? 'Р¦РµРЅР°/РјРµСЃ' : 'Price/mo', '$500+', '$100K+', '$3K+'],
  ]

  const btnPrimary: React.CSSProperties = { padding: '11px 24px', background: '#0a0a0a', color: '#ffffff', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9rem', border: '1px solid rgba(0,0,0,0.3)', cursor: 'pointer', transition: 'all 200ms' }
  const btnGhost: React.CSSProperties  = { padding: '11px 24px', background: 'transparent', color: '#0a0a0a', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.9rem', border: '1px solid rgba(0,0,0,0.3)', cursor: 'pointer', transition: 'all 200ms' }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 64 }}>

      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <span className="status-dot" />
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: '#0a0a0a', letterSpacing: '0.18em' }}>{h.tag.toUpperCase()}</span>
          </div>
          <h1 style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, lineHeight: 1.05, marginBottom: 24 }}>
            <span style={{ display: 'block', fontSize: 'clamp(2.4rem,5vw,4rem)', color: '#0a0a0a' }}>{h.h1a}</span>
            <span style={{ display: 'block', fontSize: 'clamp(2.4rem,5vw,4rem)', color: '#0a0a0a', WebkitTextStroke: '1px #d4d4d0', WebkitTextFillColor: 'transparent' }}>{h.h1b}</span>
          </h1>
          <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#3a3a3a', marginBottom: 36, maxWidth: 480 }}>{h.sub}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/argus" style={{ ...btnPrimary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background='#2a2a2a';}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background='#0a0a0a';}}
            >{h.cta1} в†’</Link>
            <button onClick={openAccess} style={btnGhost}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(0,0,0,0.08)';}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';}}
            >{h.cta2}</button>
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            {badges[lang].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.85rem' }}>{['\uD83D\uDEE1','\uD83D\uDD12','\u26A1'][i]}</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#8a8a8a' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -40, background: 'radial-gradient(ellipse at center,rgba(0,0,0,0.08),transparent 70%)', pointerEvents: 'none' }} />
          <DashboardWidget />
        </div>
      </section>

      <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)', background: '#f5f5f3' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(0,0,0,0.08)' : 'none', padding: '8px 0' }}>
              <div style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.8rem', color: '#0a0a0a', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: '#8a8a8a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label[lang]}</div>
            </div>
          ))}
        </div>
      </div>

      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span className="status-dot" />
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: '#0a0a0a', letterSpacing: '0.18em' }}>{lang==='ru'?'РњРћР”РЈР›Р РџР›РђРўР¤РћР РњР«':lang==='uz'?'PLATFORMA MODULLARI':'PLATFORM MODULES'}</span>
          </div>
          <h2 style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#0a0a0a' }}>{lang==='ru'?'РўСЂРё СЃР»РѕСЏ Р°РЅР°Р»РёС‚РёРєРё':lang==='uz'?'Tahlilning uch qatlami':'Three Layers of Intelligence'}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {MODULES.map(mod => (
            <div key={mod.id} style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '28px 24px', transition: 'all 200ms', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='rgba(0,0,0,0.3)';el.style.transform='translateY(-3px)';}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='rgba(0,0,0,0.1)';el.style.transform='none';}}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: mod.color }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.2rem', color: mod.color, letterSpacing: '0.08em' }}>{mod.name}</span>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.55rem', padding: '3px 8px', borderRadius: 4, background: mod.status==='LIVE' ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)', color: mod.status==='LIVE' ? '#0a0a0a' : '#5a5a5a', border: mod.status==='LIVE' ? '1px solid rgba(0,0,0,0.18)' : '1px solid rgba(0,0,0,0.12)' }}>{mod.status==='LIVE'?'в—Џ LIVE':'в—‹ SOON'}</span>
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.65, color: '#3a3a3a', marginBottom: 24, minHeight: 72 }}>{mod.desc[lang]}</p>
              {mod.status==='LIVE'?(
                <button onClick={() => setModuleModal(mod.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 500, color: mod.color, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', padding: 0 }}>{lang==='ru'?'РћС‚РєСЂС‹С‚СЊ':lang==='uz'?'Ochish':'Open module'} в†’</button>
              ):(
                <button onClick={openAccess} style={{ fontSize: '0.82rem', fontWeight: 500, color: '#8a8a8a', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', padding: 0 }}>{lang==='ru'?'Р Р°РЅРЅРёР№ РґРѕСЃС‚СѓРї':lang==='uz'?'Erta kirish':'Early access'} в†’</button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: '#f5f5f3', borderTop: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span className="status-dot" />
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: '#0a0a0a', letterSpacing: '0.18em' }}>{w.label}</span>
              </div>
              <h2 style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: 'clamp(1.4rem,2.5vw,1.9rem)', color: '#0a0a0a', marginBottom: 20, lineHeight: 1.2 }}>{w.h}</h2>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: '#3a3a3a', marginBottom: 28 }}>{w.p}</p>
              {w.items.map(item => (
                <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                  <span style={{ color: '#0a0a0a', fontWeight: 700, marginTop: 1, flexShrink: 0 }}>вњ“</span>
                  <span style={{ fontSize: '0.88rem', color: '#3a3a3a' }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8, overflow: 'hidden' }}>
              {comparRows.map((row, ri) => (
                <div key={ri} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: ri<comparRows.length-1?'1px solid rgba(0,0,0,0.06)':'none', background: ri===0?'#f5f5f3':ri%2===0?'transparent':'rgba(255,255,255,0.01)' }}>
                  {row.map((cell, ci) => (
                    <div key={ci} style={{ padding: '10px 14px', fontFamily: ci===0?'Inter, sans-serif':'Share Tech Mono, monospace', fontSize: ri===0?'0.6rem':'0.75rem', fontWeight: ri===0||ci===1?700:400, color: ri===0?'#8a8a8a':ci===1&&cell==='вњ“'?'#0a0a0a':ci===1&&cell==='вњ—'?'#0a0a0a':cell==='вњ“'?'#8a8a8a':cell==='вњ—'?'#3a3a3a':ci===1?'#0a0a0a':'#8a8a8a', textAlign: ci>0?'center':'left', letterSpacing: ri===0?'0.1em':0 }}>{cell}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: 'clamp(1.4rem,2.5vw,2rem)', color: '#0a0a0a', marginBottom: 16 }}>{c.h}</h2>
          <p style={{ fontSize: '0.95rem', color: '#3a3a3a', marginBottom: 32, lineHeight: 1.7 }}>{c.p}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/argus" style={{ ...btnPrimary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background='#2a2a2a';}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background='#0a0a0a';}}
            >{c.btn1} в†’</Link>
            <button onClick={openAccess} style={{ ...btnGhost }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(0,0,0,0.08)';}}
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
            <div style={{ position: 'relative', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-card)', border: `1px solid rgba(${rgb}, 0.4)`, borderRadius: 16, boxShadow: '0 24px 60px rgba(0,0,0,0.12)', animation: 'slideUp 220ms cubic-bezier(0.22,1,0.36,1)' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${mod.color}, transparent)`, borderRadius: '16px 16px 0 0' }} />
              <div style={{ padding: '28px 28px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span className="status-dot" />
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.18em', color: mod.color }}>OMNIQ MODULE</span>
                  </div>
                  <h2 style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: 'clamp(1.4rem,3vw,1.9rem)', letterSpacing: '0.08em', color: mod.color, marginBottom: 4 }}>{mod.name}</h2>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', color: `rgba(${rgb}, 0.7)`, textTransform: 'uppercase' }}>{mod.status === 'LIVE' ? 'в—Џ LIVE' : 'в—‹ COMING SOON'}</div>
                </div>
                <button onClick={() => setModuleModal(null)} aria-label="Close" style={{ flexShrink: 0, width: 36, height: 36, background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a8a8a', fontSize: '1.1rem', lineHeight: 1, transition: 'all 150ms ease' }} onMouseEnter={e => { e.currentTarget.style.borderColor = mod.color; e.currentTarget.style.color = mod.color }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = '#8a8a8a' }}>вњ•</button>
              </div>
              <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', margin: '20px 28px' }} />
              <div style={{ padding: '0 28px 28px' }}>
                <p style={{ fontSize: '0.9rem', color: '#3a3a3a', lineHeight: 1.75, marginBottom: 28 }}>{mod.desc[lang]}</p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {mod.status === 'LIVE' ? (
                    <button onClick={() => { setModuleModal(null); navigate(mod.link) }}
                      style={{ flex: 1, minWidth: 160, padding: '13px 24px', fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.14em', cursor: 'pointer', border: 'none', borderRadius: 6, background: `linear-gradient(135deg, ${mod.color}, rgba(${rgb},0.7))`, color: '#0a0a0a', boxShadow: `0 4px 24px rgba(${rgb},0.4)`, transition: 'all 200ms ease' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 32px rgba(${rgb},0.6)` }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 24px rgba(${rgb},0.4)` }}
                    >{lang === 'ru' ? 'РћРўРљР Р«РўР¬' : lang === 'uz' ? 'OCHISH' : 'OPEN'} {mod.name} в†’</button>
                  ) : (
                    <button onClick={() => { setModuleModal(null); openAccess() }}
                      style={{ flex: 1, minWidth: 160, padding: '13px 24px', fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.14em', cursor: 'pointer', border: `1px solid rgba(${rgb},0.4)`, borderRadius: 6, background: `rgba(${rgb},0.08)`, color: mod.color, transition: 'all 200ms ease' }}
                    >{lang === 'ru' ? 'Р РђРќРќРР™ Р”РћРЎРўРЈРџ' : lang === 'uz' ? 'ERTA KIRISH' : 'EARLY ACCESS'} в†’</button>
                  )}
                  <button onClick={() => setModuleModal(null)}
                    style={{ padding: '12px 24px', fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.12em', cursor: 'pointer', background: 'transparent', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 6, color: '#8a8a8a', transition: 'all 200ms ease' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = mod.color; e.currentTarget.style.color = mod.color }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = '#8a8a8a' }}
                  >{lang === 'ru' ? 'Р—РђРљР Р«РўР¬' : lang === 'uz' ? 'YOPISH' : 'CLOSE'}</button>
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



