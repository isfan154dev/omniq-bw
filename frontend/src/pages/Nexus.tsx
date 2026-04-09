import { useState, useRef, useCallback } from 'react'

const GOV_ENTITIES = [
  { id:'g001', name:'Министерство финансов', type:'Министерство', city:'Ташкент', budget:45000, employees:3200, risk:22, sector:'Финансы', head:'Джамшид Кучкаров', founded:1991 },
  { id:'g002', name:'Министерство экономики', type:'Министерство', city:'Ташкент', budget:12000, employees:1800, risk:18, sector:'Экономика', head:'Лазиз Кудратов', founded:1991 },
  { id:'g003', name:'Министерство здравоохранения', type:'Министерство', city:'Ташкент', budget:28000, employees:4500, risk:35, sector:'Здравоохранение', head:'Амрилло Иноятов', founded:1991 },
  { id:'g004', name:'Министерство народного образования', type:'Министерство', city:'Ташкент', budget:32000, employees:5200, risk:28, sector:'Образование', head:'Исмоил Джуразода', founded:1991 },
  { id:'g005', name:'Министерство высшего образования', type:'Министерство', city:'Ташкент', budget:18000, employees:2400, risk:20, sector:'Образование', head:'Конгратбой Шарипов', founded:2017 },
  { id:'g006', name:'Министерство энергетики', type:'Министерство', city:'Ташкент', budget:85000, employees:6800, risk:42, sector:'Энергетика', head:'Жорабек Мирзамахмудов', founded:2019 },
  { id:'g007', name:'Министерство транспорта', type:'Министерство', city:'Ташкент', budget:24000, employees:3100, risk:30, sector:'Транспорт', head:'Илхом Махкамов', founded:1991 },
  { id:'g008', name:'Министерство сельского хозяйства', type:'Министерство', city:'Ташкент', budget:15000, employees:2800, risk:38, sector:'Агро', head:'Азиз Воитов', founded:1991 },
  { id:'g009', name:'Министерство цифровых технологий', type:'Министерство', city:'Ташкент', budget:8500, employees:1200, risk:12, sector:'IT', head:'Шерзод Шерматов', founded:2019 },
  { id:'g010', name:'Министерство юстиции', type:'Министерство', city:'Ташкент', budget:6200, employees:2100, risk:25, sector:'Юстиция', head:'Ёкутхон Сагдуллаева', founded:1991 },
  { id:'g011', name:'Центральный банк Узбекистана', type:'Регулятор', city:'Ташкент', budget:0, employees:2800, risk:15, sector:'Финансы', head:'Мамаризо Нурмуродов', founded:1991 },
  { id:'g012', name:'Государственная налоговая служба', type:'Регулятор', city:'Ташкент', budget:0, employees:18000, risk:20, sector:'Налоги', head:'Шерзод Кудбиев', founded:1991 },
  { id:'g013', name:'Таможенный комитет', type:'Регулятор', city:'Ташкент', budget:0, employees:9500, risk:45, sector:'Таможня', head:'Баходир Жалолов', founded:1991 },
  { id:'g014', name:'Антимонопольный комитет', type:'Регулятор', city:'Ташкент', budget:2800, employees:580, risk:18, sector:'Конкуренция', head:'Комилжон Кабилов', founded:1992 },
  { id:'g015', name:'Счётная палата', type:'Регулятор', city:'Ташкент', budget:1500, employees:420, risk:10, sector:'Аудит', head:'Улугбек Мухитдинов', founded:1994 },
  { id:'g016', name:'IT Park Uzbekistan', type:'Госпрограмма', city:'Ташкент', budget:3500, employees:450, risk:8, sector:'IT', head:'Фарход Ибрагимов', founded:2019 },
  { id:'g017', name:'Агентство стратегических реформ', type:'Агентство', city:'Ташкент', budget:4200, employees:320, risk:12, sector:'Реформы', head:'Иброхим Юсупов', founded:2021 },
  { id:'g018', name:'Фонд реконструкции и развития', type:'Фонд', city:'Ташкент', budget:120000, employees:680, risk:25, sector:'Финансы', head:'Элор Ганиев', founded:2006 },
  { id:'g019', name:'Агентство по развитию рынка капитала', type:'Агентство', city:'Ташкент', budget:2100, employees:280, risk:15, sector:'Финансы', head:'Отабек Назаров', founded:2019 },
  { id:'g020', name:'Узбекнефтегаз', type:'ГП', city:'Ташкент', budget:0, employees:42000, risk:25, sector:'Нефть и газ', head:'Баходир Сидиков', founded:1992 },
  { id:'g021', name:'Хокимият Ташкента', type:'Хокимият', city:'Ташкент', budget:18000, employees:8500, risk:32, sector:'Самоуправление', head:'Шавкат Умурзаков', founded:1991 },
  { id:'g022', name:'Хокимият Самаркандской области', type:'Хокимият', city:'Самарканд', budget:8500, employees:4200, risk:28, sector:'Самоуправление', head:'Эркин Турдимов', founded:1991 },
  { id:'g023', name:'Хокимият Ферганской области', type:'Хокимият', city:'Фергана', budget:7200, employees:3800, risk:30, sector:'Самоуправление', head:'Хайридин Султонов', founded:1991 },
  { id:'g024', name:'Хокимият Андижанской области', type:'Хокимият', city:'Андижан', budget:6800, employees:3500, risk:35, sector:'Самоуправление', head:'Шухрат Абдурахмонов', founded:1991 },
  { id:'g025', name:'Хокимият Бухарской области', type:'Хокимият', city:'Бухара', budget:5500, employees:2900, risk:28, sector:'Самоуправление', head:'Ботир Зарипов', founded:1991 },
]

const TENDERS = [
  { id:'t001', entity:'g003', title:'Закупка медоборудования для районных больниц', amount:4500, company:'Global Trade Solutions', status:'Завершён', risk:85, year:2024, suspicious:true },
  { id:'t002', entity:'g004', title:'Строительство школ в Ташкентской области', amount:12000, company:'Qurilish Invest', status:'Активный', risk:35, year:2025, suspicious:false },
  { id:'t003', entity:'g001', title:'Разработка налоговой информационной системы', amount:3200, company:'Infocom.uz', status:'Завершён', risk:12, year:2023, suspicious:false },
  { id:'t004', entity:'g009', title:'Инфраструктура ЕИСУРН', amount:8900, company:'EPAM Uzbekistan', status:'Активный', risk:8, year:2025, suspicious:false },
  { id:'t005', entity:'g006', title:'Реконструкция электросетей Ферганской долины', amount:28000, company:'Узбекэнерго', status:'Завершён', risk:30, year:2023, suspicious:false },
  { id:'t006', entity:'g013', title:'Поставка досмотрового оборудования', amount:6700, company:'Invest Capital UZ', status:'Завершён', risk:88, year:2024, suspicious:true },
  { id:'t007', entity:'g021', title:'Благоустройство улиц Ташкента', amount:15000, company:'Tashkent City Development', status:'Активный', risk:28, year:2025, suspicious:false },
  { id:'t008', entity:'g008', title:'Поставка агротехники для фермеров', amount:9500, company:'Узагроэкспорт', status:'Завершён', risk:25, year:2024, suspicious:false },
  { id:'t009', entity:'g022', title:'Реставрация исторических памятников', amount:5200, company:'Silk Road Hotels', status:'Активный', risk:12, year:2025, suspicious:false },
  { id:'t010', entity:'g016', title:'Строительство IT-кампуса Samarkand IT Park', amount:11000, company:'Samarkand IT Park', status:'Активный', risk:10, year:2025, suspicious:false },
]
function riskColor(s: number) {
  if (s >= 70) return '#D94040'
  if (s >= 40) return '#E07B39'
  if (s >= 20) return '#C9A84C'
  return '#2EAEE8'
}
function riskLabel(s: number) {
  if (s >= 70) return 'КРИТИЧНЫЙ'
  if (s >= 40) return 'ВЫСОКИЙ'
  if (s >= 20) return 'СРЕДНИЙ'
  return 'НИЗКИЙ'
}
const TYPE_COLORS: Record<string,string> = {
  'Министерство':'#2EAEE8','Регулятор':'#1B9AAA','Хокимият':'#8A9BBF',
  'Агентство':'#526080','Фонд':'#526080','ГП':'#526080','Госпрограмма':'#526080',
}
const TYPES = ['Все', ...[...new Set(GOV_ENTITIES.map(e => e.type))]]

// Logical connections between government entities for graph view
const GOV_CONNECTIONS: [string, string][] = [
  ['g001','g011'], // МинФин ↔ ЦБ
  ['g001','g002'], // МинФин ↔ МинЭком
  ['g001','g012'], // МинФин ↔ Налоговая
  ['g001','g018'], // МинФин ↔ Фонд реконстр.
  ['g002','g017'], // МинЭком ↔ Агентство реформ
  ['g002','g019'], // МинЭком ↔ Агентство рынка
  ['g011','g019'], // ЦБ ↔ Агентство рынка
  ['g012','g013'], // Налоговая ↔ Таможня
  ['g012','g014'], // Налоговая ↔ Антимонополия
  ['g015','g018'], // Счётная палата ↔ Фонд
  ['g006','g020'], // МинЭнергетики ↔ Узбекнефтегаз
  ['g009','g016'], // МинЦифра ↔ IT Park
  ['g021','g022'], // Хоким Ташкента ↔ Хоким Самарканда
  ['g022','g023'], // Хоким Самарканда ↔ Хоким Ферганы
  ['g023','g024'], // Хоким Ферганы ↔ Хоким Андижана
  ['g024','g025'], // Хоким Андижана ↔ Хоким Бухары
]

// Initial graph positions (5-column grid)
const GOV_INIT_POS: Record<string, {x:number;y:number}> = Object.fromEntries(
  GOV_ENTITIES.map((e, i) => {
    const cols = 5
    const col = i % cols
    const row = Math.floor(i / cols)
    return [e.id, { x: 90 + col * 155, y: 60 + row * 110 }]
  })
)

export default function Nexus() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('Все')
  const [tab, setTab] = useState<'entities'|'tenders'|'graph'>('entities')
  const [selectedId, setSelectedId] = useState<string|null>(null)
  const [suspiciousOnly, setSuspiciousOnly] = useState(false)
  const [govNodePos, setGovNodePos] = useState<Record<string,{x:number;y:number}>>(GOV_INIT_POS)
  const [govZoom, setGovZoom] = useState(1)
  const [govDragId, setGovDragId] = useState<string|null>(null)
  const [govLastMouse, setGovLastMouse] = useState({ x:0, y:0 })
  const [govSelected, setGovSelected] = useState<string|null>(null)
  const govSvgRef = useRef<SVGSVGElement>(null)

  const handleGovNodeDown = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setGovDragId(id)
    setGovLastMouse({ x: e.clientX, y: e.clientY })
    setGovSelected(id)
  }, [])

  const handleGovSvgMove = useCallback((e: React.MouseEvent) => {
    if (!govDragId || !govSvgRef.current) return
    const rect = govSvgRef.current.getBoundingClientRect()
    const vbW = 900, vbH = 580
    const dx = (e.clientX - govLastMouse.x) * (vbW / rect.width) / govZoom
    const dy = (e.clientY - govLastMouse.y) * (vbH / rect.height) / govZoom
    setGovNodePos(pos => ({ ...pos, [govDragId]: { x: pos[govDragId].x + dx, y: pos[govDragId].y + dy } }))
    setGovLastMouse({ x: e.clientX, y: e.clientY })
  }, [govDragId, govLastMouse, govZoom])

  const handleGovSvgUp = useCallback(() => setGovDragId(null), [])

  const handleGovWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setGovZoom(z => Math.min(3, Math.max(0.3, z * (e.deltaY < 0 ? 1.1 : 0.9))))
  }, [])

  const filteredEntities = GOV_ENTITIES.filter(e => {
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter !== 'Все' && e.type !== typeFilter) return false
    return true
  }).sort((a,b) => b.risk - a.risk)

  const filteredTenders = TENDERS.filter(t => {
    if (suspiciousOnly && !t.suspicious) return false
    if (search) {
      const ent = GOV_ENTITIES.find(e => e.id === t.entity)
      if (!t.title.toLowerCase().includes(search.toLowerCase()) && !ent?.name.toLowerCase().includes(search.toLowerCase())) return false
    }
    return true
  }).sort((a,b) => b.risk - a.risk)

  const selected = GOV_ENTITIES.find(e => e.id === selectedId)
  const entityTenders = selectedId ? TENDERS.filter(t => t.entity === selectedId) : []
  const suspicious = TENDERS.filter(t => t.suspicious).length
  const highRisk = GOV_ENTITIES.filter(e => e.risk >= 40).length

  const inp: React.CSSProperties = {
    background: 'rgba(46,174,232,0.05)', border: '1px solid rgba(46,174,232,0.15)',
    borderRadius: 6, padding: '8px 12px', color: '#E8EDF5',
    fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', outline: 'none', cursor: 'pointer',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 64 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>

        <div style={{ padding: '28px 0 20px', borderBottom: '1px solid rgba(46,174,232,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span className="status-dot" />
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: '#1B9AAA', letterSpacing: '0.18em' }}>NEXUS — GOVERNMENT INTELLIGENCE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <h1 style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.6rem', color: '#E8EDF5', letterSpacing: '0.06em' }}>ГОСУДАРСТВЕННЫЕ СТРУКТУРЫ</h1>
            <div style={{ display: 'flex', gap: 24 }}>
              {[
                { label: 'СТРУКТУР', value: GOV_ENTITIES.length, color: '#1B9AAA' },
                { label: 'ТЕНДЕРОВ', value: TENDERS.length, color: '#2EAEE8' },
                { label: 'АНОМАЛИЙ', value: suspicious, color: '#D94040' },
                { label: 'ВЫСОКИЙ РИСК', value: highRisk, color: '#E07B39' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.4rem', color: s.color }}>{s.value}</div>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#526080', letterSpacing: '0.1em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 0, margin: '16px 0', border: '1px solid rgba(46,174,232,0.12)', borderRadius: 7, overflow: 'hidden', width: 'fit-content' }}>
          {(['entities','tenders','graph'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '9px 24px', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.1em', cursor: 'pointer', border: 'none', transition: 'all 180ms', background: tab === t ? 'rgba(46,174,232,0.12)' : 'transparent', color: tab === t ? '#2EAEE8' : '#526080' }}>
              {t === 'entities' ? '◈ ГОССТРУКТУРЫ' : t === 'tenders' ? '≡ ТЕНДЕРЫ' : '◎ ГРАФ'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="text" value={search} placeholder="Поиск..." onChange={e => setSearch(e.target.value)} style={{ ...inp, flex: '1 1 200px', minWidth: 160 }} />
          {tab === 'entities' && (
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={inp}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
          {tab === 'tenders' && (
            <button onClick={() => setSuspiciousOnly(v => !v)} style={{ padding: '8px 14px', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.65rem', cursor: 'pointer', border: '1px solid ' + (suspiciousOnly ? '#D94040' : 'rgba(46,174,232,0.15)'), borderRadius: 6, background: suspiciousOnly ? 'rgba(217,64,64,0.1)' : 'transparent', color: suspiciousOnly ? '#D94040' : '#526080', transition: 'all 180ms' }}>
              ⚠ ТОЛЬКО АНОМАЛИИ
            </button>
          )}
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: '#526080', marginLeft: 'auto' }}>{tab === 'entities' ? filteredEntities.length + ' / ' + GOV_ENTITIES.length : filteredTenders.length + ' / ' + TENDERS.length} записей</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected && tab === 'entities' ? '1fr 360px' : '1fr', gap: 16, paddingBottom: 40 }}>

          {tab === 'entities' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(46,174,232,0.1)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.2fr 1fr 1.2fr', padding: '0 16px', background: 'rgba(7,12,24,0.8)', borderBottom: '1px solid rgba(46,174,232,0.12)' }}>
                {['СТРУКТУРА','ТИП','БЮДЖЕТ $М','СОТРУДН.','РИСК'].map((col,i) => (
                  <div key={i} style={{ padding: '11px 0', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', color: '#526080', letterSpacing: '0.1em' }}>{col}</div>
                ))}
              </div>
              <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 340px)' }}>
                {filteredEntities.map((entity, idx) => (
                  <div key={entity.id} onClick={() => setSelectedId(selectedId === entity.id ? null : entity.id)}
                    style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.2fr 1fr 1.2fr', padding: '0 16px', borderBottom: '1px solid rgba(46,174,232,0.05)', cursor: 'pointer', transition: 'background 150ms', background: selectedId === entity.id ? 'rgba(46,174,232,0.07)' : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)' }}
                    onMouseEnter={e => { if (selectedId !== entity.id) (e.currentTarget as HTMLElement).style.background = 'rgba(46,174,232,0.04)' }}
                    onMouseLeave={e => { if (selectedId !== entity.id) (e.currentTarget as HTMLElement).style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)' }}
                  >
                    <div style={{ padding: '11px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: entity.risk >= 40 ? riskColor(entity.risk) : 'transparent', flexShrink: 0, boxShadow: entity.risk >= 70 ? '0 0 5px ' + riskColor(entity.risk) : 'none' }} />
                      <div>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#E8EDF5', lineHeight: 1.2 }}>{entity.name}</div>
                        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: '#526080', marginTop: 2 }}>{entity.city} · {entity.sector}</div>
                      </div>
                    </div>
                    <div style={{ padding: '11px 0', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: TYPE_COLORS[entity.type] || '#526080', background: (TYPE_COLORS[entity.type] || '#526080') + '14', padding: '2px 8px', borderRadius: 4 }}>{entity.type}</span>
                    </div>
                    <div style={{ padding: '11px 0', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.8rem', color: entity.budget > 0 ? '#E8EDF5' : '#526080' }}>{entity.budget > 0 ? '$' + entity.budget.toLocaleString() : '—'}</span>
                    </div>
                    <div style={{ padding: '11px 0', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.8rem', color: '#8A9BBF' }}>{entity.employees.toLocaleString()}</span>
                    </div>
                    <div style={{ padding: '11px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: entity.risk + '%', height: '100%', background: riskColor(entity.risk), borderRadius: 2 }} />
                      </div>
                      <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.75rem', fontWeight: 700, color: riskColor(entity.risk), width: 24, textAlign: 'right', flexShrink: 0 }}>{entity.risk}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'tenders' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(46,174,232,0.1)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr 1fr 0.8fr 1fr', padding: '0 16px', background: 'rgba(7,12,24,0.8)', borderBottom: '1px solid rgba(46,174,232,0.12)' }}>
                {['ТЕНДЕР','ИСПОЛНИТЕЛЬ','СУММА $М','ГОД','РИСК'].map((col,i) => (
                  <div key={i} style={{ padding: '11px 0', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', color: '#526080', letterSpacing: '0.1em' }}>{col}</div>
                ))}
              </div>
              <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 340px)' }}>
                {filteredTenders.map((tender, idx) => {
                  const entity = GOV_ENTITIES.find(e => e.id === tender.entity)
                  return (
                    <div key={tender.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr 1fr 0.8fr 1fr', padding: '0 16px', borderBottom: '1px solid rgba(46,174,232,0.05)', background: tender.suspicious ? 'rgba(217,64,64,0.04)' : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)', borderLeft: tender.suspicious ? '2px solid #D94040' : '2px solid transparent' }}>
                      <div style={{ padding: '12px 0 12px 8px' }}>
                        {tender.suspicious && <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#D94040', marginBottom: 3, letterSpacing: '0.08em' }}>⚠ АНОМАЛИЯ</div>}
                        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.86rem', color: '#E8EDF5', lineHeight: 1.3, marginBottom: 3 }}>{tender.title}</div>
                        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: '#526080' }}>{entity?.name}</div>
                      </div>
                      <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: tender.suspicious ? '#E07B39' : '#8A9BBF' }}>{tender.company}</span>
                      </div>
                      <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.82rem', fontWeight: 600, color: '#E8EDF5' }}>{tender.amount.toLocaleString()}</span>
                      </div>
                      <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.78rem', color: '#526080' }}>{tender.year}</span>
                      </div>
                      <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: tender.risk + '%', height: '100%', background: riskColor(tender.risk), borderRadius: 2 }} />
                        </div>
                        <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.75rem', fontWeight: 700, color: riskColor(tender.risk), width: 24, textAlign: 'right', flexShrink: 0 }}>{tender.risk}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {selected && tab === 'entities' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(46,174,232,0.15)', borderRadius: 8, padding: 20, alignSelf: 'start', position: 'sticky', top: 84 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', color: '#1B9AAA', letterSpacing: '0.15em' }}>ДОСЬЕ СТРУКТУРЫ</span>
                <button onClick={() => setSelectedId(null)} style={{ background: 'none', border: 'none', color: '#526080', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
              </div>
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: TYPE_COLORS[selected.type] || '#526080', background: (TYPE_COLORS[selected.type] || '#526080') + '14', padding: '2px 8px', borderRadius: 4, display: 'inline-block', marginBottom: 10 }}>{selected.type}</span>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#E8EDF5', marginBottom: 4, lineHeight: 1.3 }}>{selected.name}</h3>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: '#526080', marginBottom: 16 }}>{selected.city} · Осн. {selected.founded}</div>
              <div style={{ background: riskColor(selected.risk) + '0E', border: '1px solid ' + riskColor(selected.risk) + '28', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: '#526080', letterSpacing: '0.1em' }}>РИСК-ИНДЕКС</span>
                  <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.5rem', color: riskColor(selected.risk) }}>{selected.risk}</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', marginBottom: 5 }}>
                  <div style={{ width: selected.risk + '%', height: '100%', background: riskColor(selected.risk), borderRadius: 3 }} />
                </div>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', color: riskColor(selected.risk) }}>{riskLabel(selected.risk)}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                {[
                  { k:'БЮДЖЕТ', v: selected.budget > 0 ? '$' + selected.budget.toLocaleString() + 'М' : 'Н/Д' },
                  { k:'СОТРУДНИКИ', v: selected.employees.toLocaleString() },
                  { k:'СЕКТОР', v: selected.sector },
                  { k:'РУКОВОДИТЕЛЬ', v: selected.head },
                ].map(m => (
                  <div key={m.k} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '9px 11px' }}>
                    <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#526080', letterSpacing: '0.08em', marginBottom: 4 }}>{m.k}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.82rem', color: '#E8EDF5' }}>{m.v}</div>
                  </div>
                ))}
              </div>
              {entityTenders.length > 0 && (
                <div>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: '#526080', letterSpacing: '0.1em', marginBottom: 8 }}>ТЕНДЕРЫ ({entityTenders.length})</div>
                  {entityTenders.map(t => (
                    <div key={t.id} style={{ padding: '9px 10px', background: t.suspicious ? 'rgba(217,64,64,0.07)' : 'rgba(255,255,255,0.03)', borderRadius: 6, marginBottom: 6, borderLeft: t.suspicious ? '2px solid #D94040' : '2px solid transparent' }}>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#E8EDF5', marginBottom: 5, lineHeight: 1.3 }}>{t.title}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: '#2EAEE8' }}>${t.amount.toLocaleString()}М</span>
                        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: riskColor(t.risk), fontWeight: 700 }}>риск {t.risk}{t.suspicious ? ' ⚠' : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'graph' && (() => {
            const selEnt = govSelected ? GOV_ENTITIES.find(e => e.id === govSelected) : null
            const vbW = 900, vbH = 580, cx = vbW / 2, cy = vbH / 2
            return (
              <div style={{ display: 'grid', gridTemplateColumns: selEnt ? '1fr 300px' : '1fr', gap: 16 }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(46,174,232,0.1)', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                  {/* Legend */}
                  <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, background: 'rgba(7,12,24,0.85)', border: '1px solid rgba(46,174,232,0.12)', borderRadius: 6, padding: '8px 12px' }}>
                    {[['#2EAEE8','Министерство'],['#1B9AAA','Регулятор'],['#8A9BBF','Хокимият'],['#526080','Прочие']].map(([c,l]) => (
                      <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.55rem', color: '#8A9BBF' }}>{l}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 6, fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#526080' }}>Scroll: zoom · Drag: move</div>
                  </div>
                  <svg ref={govSvgRef} width="100%" viewBox={`0 0 ${vbW} ${vbH}`} style={{ display: 'block', cursor: govDragId ? 'grabbing' : 'default' }}
                    onMouseMove={handleGovSvgMove} onMouseUp={handleGovSvgUp} onMouseLeave={handleGovSvgUp}
                    onWheel={handleGovWheel}>
                    <g transform={`translate(${cx},${cy}) scale(${govZoom}) translate(${-cx},${-cy})`}>
                      {/* Edges */}
                      {GOV_CONNECTIONS.map(([aid, bid]) => {
                        const a = govNodePos[aid], b = govNodePos[bid]
                        if (!a || !b) return null
                        return <line key={aid+'-'+bid} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(46,174,232,0.18)" strokeWidth="1.5" />
                      })}
                      {/* Nodes */}
                      {GOV_ENTITIES.map(e => {
                        const p = govNodePos[e.id]
                        if (!p) return null
                        const col = TYPE_COLORS[e.type] || '#526080'
                        const isSel = govSelected === e.id
                        return (
                          <g key={e.id} onMouseDown={ev => handleGovNodeDown(ev, e.id)} style={{ cursor: 'grab' }}>
                            <circle cx={p.x} cy={p.y} r={isSel ? 14 : 10} fill={col} opacity={0.9} stroke={isSel ? '#fff' : col} strokeWidth={isSel ? 2 : 1} filter={e.risk >= 40 ? `drop-shadow(0 0 5px ${riskColor(e.risk)})` : undefined} />
                            <text x={p.x} y={p.y + 22} textAnchor="middle" style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, fill: '#8A9BBF', pointerEvents: 'none' }}>{e.name.split(' ').slice(-1)[0].slice(0, 12)}</text>
                          </g>
                        )
                      })}
                    </g>
                  </svg>
                </div>
                {selEnt && (
                  <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(46,174,232,0.15)', borderRadius: 8, padding: 20, alignSelf: 'start' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: '#1B9AAA', letterSpacing: '0.15em' }}>ДОСЬЕ СТРУКТУРЫ</span>
                      <button onClick={() => setGovSelected(null)} style={{ background: 'none', border: 'none', color: '#526080', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                    </div>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: TYPE_COLORS[selEnt.type] || '#526080', background: (TYPE_COLORS[selEnt.type] || '#526080') + '14', padding: '2px 8px', borderRadius: 4, display: 'inline-block', marginBottom: 10 }}>{selEnt.type}</span>
                    <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#E8EDF5', marginBottom: 4, lineHeight: 1.3 }}>{selEnt.name}</h3>
                    <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', color: '#526080', marginBottom: 14 }}>{selEnt.city} · Осн. {selEnt.founded}</div>
                    <div style={{ background: riskColor(selEnt.risk) + '0E', border: '1px solid ' + riskColor(selEnt.risk) + '28', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: '#526080' }}>РИСК-ИНДЕКС</span>
                        <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.4rem', color: riskColor(selEnt.risk) }}>{selEnt.risk}</span>
                      </div>
                      <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: selEnt.risk + '%', height: '100%', background: riskColor(selEnt.risk), borderRadius: 3 }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                      {[{ k:'БЮДЖЕТ', v: selEnt.budget > 0 ? '$'+selEnt.budget.toLocaleString()+'М' : 'Н/Д' }, { k:'СОТРУДНИКИ', v: selEnt.employees.toLocaleString() }].map(m => (
                        <div key={m.k} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '9px 11px' }}>
                          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#526080', marginBottom: 4 }}>{m.k}</div>
                          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.82rem', color: '#E8EDF5' }}>{m.v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#526080', marginBottom: 4 }}>РУКОВОДИТЕЛЬ</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#E8EDF5', marginBottom: 14 }}>{selEnt.head}</div>
                    {(() => {
                      const conns = GOV_CONNECTIONS.filter(([a,b]) => a === govSelected || b === govSelected).map(([a,b]) => a === govSelected ? b : a)
                      return conns.length > 0 ? (
                        <div>
                          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#526080', marginBottom: 8 }}>СВЯЗИ ({conns.length})</div>
                          {conns.map(tid => {
                            const t = GOV_ENTITIES.find(x => x.id === tid)
                            return t ? (
                              <div key={tid} onClick={() => setGovSelected(tid)} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', marginBottom: 4, background: 'rgba(255,255,255,0.03)', borderRadius: 6, cursor: 'pointer' }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(46,174,232,0.08)'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#E8EDF5' }}>{t.name.split(' ').slice(0,3).join(' ')}</span>
                                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: TYPE_COLORS[t.type] || '#526080' }}>{t.type.slice(0,4)}</span>
                              </div>
                            ) : null
                          })}
                        </div>
                      ) : null
                    })()}
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
