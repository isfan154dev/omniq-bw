import { useCallback, useEffect, useRef, useState } from 'react'
import { getToken } from '../api/client'

type Company = {
  id: string
  name: string
  sector: string
  city: string
  revenue: number
  employees: number
  risk: number
  founded: number
  type: string
  description: string
  director: string
  connections: string[]
}

type ArgusStats = {
  total_companies: number
  total_relationships: number
  avg_risk_score: number
  critical_count: number
  high_risk_count: number
}

type CompaniesResponse = {
  companies?: Array<Partial<Company>>
  total?: number
}

type GraphNode = {
  id?: string
  label?: string
  sector?: string
  industry?: string
  city?: string
  type?: string
  revenue?: number
  employees?: number
  risk_score?: number
  founded?: number
}

type GraphEdge = {
  source?: string
  target?: string
}

type GraphResponse = {
  nodes?: GraphNode[]
  edges?: GraphEdge[]
  stats?: Partial<ArgusStats>
}

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''
const DEFAULT_ERROR_MESSAGE = 'Не удалось загрузить данные ARGUS.'
const POLL_INTERVAL_MS = 30000
const FLASH_DURATION_MS = 1600

const CRITICAL_RISK_THRESHOLD = 70
const HIGH_RISK_THRESHOLD = 40
const MEDIUM_RISK_THRESHOLD = 20

function riskColor(r: number) {
  if (r >= CRITICAL_RISK_THRESHOLD) return '#D94040'
  if (r >= HIGH_RISK_THRESHOLD) return '#E07B39'
  if (r >= MEDIUM_RISK_THRESHOLD) return '#C9A84C'
  return '#2EAEE8'
}
function riskLabel(r: number) {
  if (r >= 70) return 'КРИТИЧНЫЙ'
  if (r >= 40) return 'ВЫСОКИЙ'
  if (r >= 20) return 'СРЕДНИЙ'
  return 'НИЗКИЙ'
}
function toNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

function buildGraphInitialPositions(companies: Company[]): Record<string, {x: number; y: number}> {
  return Object.fromEntries(companies.map((c, i) => {
    const cols = 6
    const col = i % cols
    const row = Math.floor(i / cols)
    return [c.id, { x: 80 + col * 135, y: 60 + row * 100 }]
  }))
}

async function fetchArgusJson<T>(path: string, signal: AbortSignal): Promise<T> {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { detail?: string } | null
    throw new Error(body?.detail ?? `Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

function mapGraphConnections(edges: GraphEdge[]) {
  const connectionMap = new Map<string, Set<string>>()

  edges.forEach(edge => {
    const source = edge.source?.trim()
    const target = edge.target?.trim()
    if (!source || !target) return

    if (!connectionMap.has(source)) connectionMap.set(source, new Set())
    if (!connectionMap.has(target)) connectionMap.set(target, new Set())

    connectionMap.get(source)?.add(target)
    connectionMap.get(target)?.add(source)
  })

  return connectionMap
}

function normalizeCompanies(companyPayload: CompaniesResponse | null, graphPayload: GraphResponse | null): Company[] {
  const graphNodes = graphPayload?.nodes ?? []
  const graphNodeMap = new Map(graphNodes.flatMap(node => node.id ? [[node.id, node] as const] : []))
  const connectionMap = mapGraphConnections(graphPayload?.edges ?? [])
  const companyMap = new Map<string, Company>()

  ;(companyPayload?.companies ?? []).forEach(company => {
    const id = company.id?.trim()
    if (!id) return

    const graphNode = graphNodeMap.get(id)

    companyMap.set(id, {
      id,
      name: company.name?.trim() || graphNode?.label?.trim() || id,
      sector: company.sector?.trim() || graphNode?.sector?.trim() || graphNode?.industry?.trim() || 'Не указано',
      city: company.city?.trim() || graphNode?.city?.trim() || 'Не указано',
      revenue: toNumber(company.revenue ?? graphNode?.revenue),
      employees: toNumber(company.employees ?? graphNode?.employees),
      risk: toNumber(company.risk ?? graphNode?.risk_score),
      founded: toNumber(company.founded ?? graphNode?.founded),
      type: company.type?.trim() || graphNode?.type?.trim() || 'Не указано',
      description: company.description?.trim() || 'Описание отсутствует',
      director: company.director?.trim() || 'Не указан',
      connections: [...(connectionMap.get(id) ?? new Set())],
    })
  })

  graphNodes.forEach(node => {
    const id = node.id?.trim()
    if (!id || companyMap.has(id)) return

    companyMap.set(id, {
      id,
      name: node.label?.trim() || id,
      sector: node.sector?.trim() || node.industry?.trim() || 'Не указано',
      city: node.city?.trim() || 'Не указано',
      revenue: toNumber(node.revenue),
      employees: toNumber(node.employees),
      risk: toNumber(node.risk_score),
      founded: toNumber(node.founded),
      type: node.type?.trim() || 'Не указано',
      description: 'Описание отсутствует',
      director: 'Не указан',
      connections: [...(connectionMap.get(id) ?? new Set())],
    })
  })

  return [...companyMap.values()].sort((a, b) => b.risk - a.risk)
}

function getRiskChanges(previousCompanies: Company[], nextCompanies: Company[]): string[] {
  const previousRiskById = new Map(previousCompanies.map(company => [company.id, company.risk]))
  return nextCompanies
    .filter(company => previousRiskById.has(company.id) && previousRiskById.get(company.id) !== company.risk)
    .map(company => company.id)
}

export default function Argus() {
  const [search, setSearch] = useState('')
  const [industryFilter, setIndustryFilter] = useState('Все')
  const [riskFilter, setRiskFilter] = useState('Все')
  const [selected, setSelected] = useState<string | null>(null)
  const [sortField, setSortField] = useState<'name'|'risk'|'revenue'>('risk')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc')
  const [viewTab, setViewTab] = useState<'table'|'graph'>('table')
  const [nodePos, setNodePos] = useState<Record<string, {x:number;y:number}>>({})
  const [graphZoom, setGraphZoom] = useState(1)
  const [graphPan, setGraphPan] = useState({ x: 0, y: 0 })
  const [dragId, setDragId] = useState<string | null>(null)
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 })
  const [graphSelected, setGraphSelected] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const [companies, setCompanies] = useState<Company[]>([])
  const [stats, setStats] = useState<ArgusStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [analyticsIds, setAnalyticsIds] = useState<Set<string>>(new Set())
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [analyticMetric, setAnalyticMetric] = useState<'risk' | 'revenue' | 'employees'>('risk')
  const [chartTooltip, setChartTooltip] = useState<{ x: number; y: number; lines: string[] }>({ x: 0, y: 0, lines: [] })
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null)
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0)
  const [flashingCompanyIds, setFlashingCompanyIds] = useState<Set<string>>(new Set())
  const flashTimeoutRef = useRef<number | null>(null)
  const previousCompaniesRef = useRef<Company[]>([])

  const loadArgusData = useCallback(async (options?: { background?: boolean }) => {
    const background = options?.background ?? false
    const controller = new AbortController()

    if (!API_BASE_URL) {
      setCompanies([])
      setStats(null)
      setNodePos({})
      setAnalyticsIds(new Set())
      setError('VITE_API_URL is not configured.')
      setLoading(false)
      return
    }

    if (!background) setLoading(true)
    setError(null)

    const [companiesResult, statsResult, graphResult] = await Promise.allSettled([
      fetchArgusJson<CompaniesResponse>('/api/argus/companies', controller.signal),
      fetchArgusJson<ArgusStats>('/api/argus/stats', controller.signal),
      fetchArgusJson<GraphResponse>('/api/argus/graph', controller.signal),
    ])

    const nextCompanies = normalizeCompanies(
      companiesResult.status === 'fulfilled' ? companiesResult.value : null,
      graphResult.status === 'fulfilled' ? graphResult.value : null,
    )

    const nextStats = statsResult.status === 'fulfilled'
      ? statsResult.value
      : {
          total_companies: graphResult.status === 'fulfilled' ? toNumber(graphResult.value.stats?.total_companies) : nextCompanies.length,
          total_relationships: graphResult.status === 'fulfilled' ? toNumber(graphResult.value.stats?.total_relationships) : 0,
          avg_risk_score: graphResult.status === 'fulfilled' ? toNumber(graphResult.value.stats?.avg_risk_score) : 0,
          critical_count: graphResult.status === 'fulfilled' ? toNumber(graphResult.value.stats?.critical_count) : nextCompanies.filter(company => company.risk >= CRITICAL_RISK_THRESHOLD).length,
          high_risk_count: graphResult.status === 'fulfilled' ? toNumber(graphResult.value.stats?.high_risk_count) : nextCompanies.filter(company => company.risk >= HIGH_RISK_THRESHOLD).length,
        }

    const nextAnalyticsIds = new Set(
      [...nextCompanies]
        .sort((a, b) => b.risk - a.risk)
        .slice(0, 10)
        .map(company => company.id)
    )

    const loadErrors = [companiesResult, statsResult, graphResult]
      .flatMap(result => result.status === 'rejected' ? [result.reason instanceof Error ? result.reason.message : DEFAULT_ERROR_MESSAGE] : [])

    const changedRiskIds = getRiskChanges(previousCompaniesRef.current, nextCompanies)

    setCompanies(nextCompanies)
    setStats(nextStats)
    setNodePos(buildGraphInitialPositions(nextCompanies))
    setAnalyticsIds(currentIds => {
      const nextCompanyIds = new Set(nextCompanies.map(company => company.id))
      const preservedIds = [...currentIds].filter(id => nextCompanyIds.has(id))
      return preservedIds.length > 0 ? new Set(preservedIds) : nextAnalyticsIds
    })
    setSelected(currentId => nextCompanies.some(company => company.id === currentId) ? currentId : null)
    setGraphSelected(currentId => nextCompanies.some(company => company.id === currentId) ? currentId : null)
    setError(loadErrors.length > 0 ? loadErrors.join(' | ') : (nextCompanies.length === 0 ? DEFAULT_ERROR_MESSAGE : null))
    setLoading(false)

    if (changedRiskIds.length > 0) {
      setFlashingCompanyIds(new Set(changedRiskIds))
      if (flashTimeoutRef.current !== null) window.clearTimeout(flashTimeoutRef.current)
      flashTimeoutRef.current = window.setTimeout(() => {
        setFlashingCompanyIds(new Set())
        flashTimeoutRef.current = null
      }, FLASH_DURATION_MS)
    }

    if (nextCompanies.length > 0) {
      previousCompaniesRef.current = nextCompanies
      setLastUpdatedAt(Date.now())
      setSecondsSinceUpdate(0)
    }
  }, [])

  useEffect(() => {
    void loadArgusData().catch(loadError => {
      setError(loadError instanceof Error ? loadError.message : DEFAULT_ERROR_MESSAGE)
      setLoading(false)
    })
  }, [loadArgusData, reloadKey])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void loadArgusData({ background: true }).catch(loadError => {
        setError(loadError instanceof Error ? loadError.message : DEFAULT_ERROR_MESSAGE)
      })
    }, POLL_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [loadArgusData])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSecondsSinceUpdate(lastUpdatedAt ? Math.max(0, Math.floor((Date.now() - lastUpdatedAt) / 1000)) : 0)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [lastUpdatedAt])

  useEffect(() => () => {
    if (flashTimeoutRef.current !== null) window.clearTimeout(flashTimeoutRef.current)
  }, [])

  const COMPANIES = companies
  const INDUSTRIES = ['Все', ...[...new Set(COMPANIES.map(company => company.sector).filter(Boolean))].sort()]

  const filtered = COMPANIES.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.sector.toLowerCase().includes(search.toLowerCase())) return false
    if (industryFilter !== 'Все' && c.sector !== industryFilter) return false
    if (riskFilter === 'КРИТИЧНЫЕ' && c.risk < 70) return false
    if (riskFilter === 'ВЫСОКИЕ' && (c.risk < 40 || c.risk >= 70)) return false
    if (riskFilter === 'СРЕДНИЕ' && (c.risk < 20 || c.risk >= 40)) return false
    if (riskFilter === 'НИЗКИЕ' && c.risk >= 20) return false
    return true
  }).sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1
    if (sortField === 'name') return mul * a.name.localeCompare(b.name)
    return mul * (a[sortField] - b[sortField])
  })

  const selectedCompany = COMPANIES.find(c => c.id === selected)
  const connectedCompanies = selectedCompany ? COMPANIES.filter(c => selectedCompany.connections.includes(c.id)) : []
  const critCount = COMPANIES.filter(c => c.risk >= 70).length
  const highCount = COMPANIES.filter(c => c.risk >= 40 && c.risk < 70).length
  const totalCompanies = stats?.total_companies ?? COMPANIES.length
  const anomalyCount = stats?.high_risk_count ?? COMPANIES.filter(c => c.risk >= 40).length
  const criticalCount = stats?.critical_count ?? critCount
  const liveStatusLabel = lastUpdatedAt === null ? 'Waiting for live data' : `Last updated: ${secondsSinceUpdate} seconds ago`

  const inputStyle: React.CSSProperties = {
    background: 'rgba(46,174,232,0.05)', border: '1px solid rgba(46,174,232,0.15)',
    borderRadius: 6, padding: '8px 12px', color: '#E8EDF5',
    fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', outline: 'none', cursor: 'pointer',
  }

  function toggleSort(field: 'name'|'risk'|'revenue') {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const handleNodeDown = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setDragId(id)
    setLastMouse({ x: e.clientX, y: e.clientY })
    setGraphSelected(id)
  }, [])

  const handleSvgMove = useCallback((e: React.MouseEvent) => {
    if (!dragId || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const vbW = 900, vbH = 560
    const dx = (e.clientX - lastMouse.x) * (vbW / rect.width) / graphZoom
    const dy = (e.clientY - lastMouse.y) * (vbH / rect.height) / graphZoom
    setNodePos(pos => ({ ...pos, [dragId]: { x: pos[dragId].x + dx, y: pos[dragId].y + dy } }))
    setLastMouse({ x: e.clientX, y: e.clientY })
  }, [dragId, lastMouse, graphZoom])

  const handleSvgUp = useCallback(() => setDragId(null), [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setGraphZoom(z => Math.min(3, Math.max(0.3, z * (e.deltaY < 0 ? 1.1 : 0.9))))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 64 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
        <style>{`
          @keyframes argus-live-pulse {
            0% { opacity: 0.45; transform: scale(0.92); box-shadow: 0 0 0 0 rgba(76, 201, 91, 0.55); }
            70% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 10px rgba(76, 201, 91, 0); }
            100% { opacity: 0.6; transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 201, 91, 0); }
          }
          @keyframes argus-row-flash {
            0% { background: rgba(76, 201, 91, 0.22); box-shadow: inset 0 0 0 1px rgba(76, 201, 91, 0.35); }
            100% { background: transparent; box-shadow: inset 0 0 0 1px rgba(76, 201, 91, 0); }
          }
        `}</style>

        <div style={{ padding: '28px 0 20px', borderBottom: '1px solid rgba(46,174,232,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span className="status-dot" />
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: '#2EAEE8', letterSpacing: '0.18em' }}>ARGUS — ENTERPRISE GRAPH ANALYTICS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <h1 style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.6rem', color: '#E8EDF5', letterSpacing: '0.06em' }}>КОРПОРАТИВНЫЙ ГРАФ</h1>
            <div style={{ display: 'flex', gap: 24 }}>
              {[
                { label: 'КОМПАНИЙ', value: totalCompanies, color: '#2EAEE8' },
                { label: 'АНОМАЛИИ', value: anomalyCount, color: '#D94040' },
                { label: 'КРИТИЧНЫХ', value: criticalCount, color: '#D94040' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.4rem', color: s.color, transition: 'color 220ms ease, transform 220ms ease, opacity 220ms ease' }}>{s.value}</div>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#526080', letterSpacing: '0.1em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', right: 32, top: 88, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 999, background: 'rgba(9,16,29,0.88)', border: '1px solid rgba(76,201,91,0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CC95B', animation: 'argus-live-pulse 1.8s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: '#4CC95B', letterSpacing: '0.14em' }}>LIVE</span>
          </div>
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', color: '#8A9BBF', letterSpacing: '0.06em' }}>{liveStatusLabel}</span>
        </div>

        <div style={{ display: 'flex', gap: 0, margin: '16px 0 0', border: '1px solid rgba(46,174,232,0.12)', borderRadius: 7, overflow: 'hidden', width: 'fit-content' }}>
          {(['table','graph'] as const).map(t => (
            <button key={t} onClick={() => setViewTab(t)} style={{ padding: '9px 24px', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.1em', cursor: 'pointer', border: 'none', transition: 'all 180ms', background: viewTab === t ? 'rgba(46,174,232,0.12)' : 'transparent', color: viewTab === t ? '#2EAEE8' : '#526080' }}>
              {t === 'table' ? '≡ ТАБЛИЦА' : '◎ ГРАФ'}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(46,174,232,0.18)', background: 'rgba(46,174,232,0.06)', color: '#2EAEE8', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.64rem', letterSpacing: '0.08em' }}>
            ЗАГРУЗКА ДАННЫХ ARGUS...
          </div>
        )}

        {error && (
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(217,64,64,0.28)', background: 'rgba(217,64,64,0.08)' }}>
            <span style={{ color: '#F3B3B3', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem' }}>{error}</span>
            <button onClick={() => setReloadKey(key => key + 1)} style={{ background: 'rgba(217,64,64,0.12)', color: '#FFD8D8', border: '1px solid rgba(217,64,64,0.3)', borderRadius: 6, padding: '7px 12px', cursor: 'pointer', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.08em', flexShrink: 0 }}>
              ПОВТОРИТЬ
            </button>
          </div>
        )}

        {viewTab === 'table' && <div style={{ display: 'flex', gap: 10, padding: '16px 0', flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="text" placeholder="Поиск компании..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, flex: '1 1 220px', minWidth: 180 }} />
          <select value={industryFilter} onChange={e => setIndustryFilter(e.target.value)} style={{ ...inputStyle, flex: '0 0 auto' }}>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} style={{ ...inputStyle, flex: '0 0 auto' }}>
            {['Все','КРИТИЧНЫЕ','ВЫСОКИЕ','СРЕДНИЕ','НИЗКИЕ'].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: '#526080', marginLeft: 'auto' }}>{filtered.length} / {COMPANIES.length} записей</span>
        </div>}

        {viewTab === 'graph' && (() => {
          const selCo = graphSelected ? COMPANIES.find(c => c.id === graphSelected) : null
          const vbW = 900, vbH = 560, cx = vbW / 2, cy = vbH / 2
          return (
            <div style={{ display: 'grid', gridTemplateColumns: selCo ? '1fr 320px' : '1fr', gap: 16, marginTop: 16, marginBottom: 32 }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(46,174,232,0.1)', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                {/* Legend */}
                <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, background: 'rgba(7,12,24,0.85)', border: '1px solid rgba(46,174,232,0.12)', borderRadius: 6, padding: '8px 12px' }}>
                  {[['#2EAEE8','LOW < 20'],['#C9A84C','MED 20–40'],['#E07B39','HIGH 40–70'],['#D94040','CRIT 70+']].map(([c,l]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.55rem', color: '#8A9BBF' }}>{l}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 6, fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#526080' }}>Scroll: zoom · Drag: move</div>
                </div>
                <svg ref={svgRef} width="100%" viewBox={`0 0 ${vbW} ${vbH}`} style={{ display: 'block', cursor: dragId ? 'grabbing' : 'default' }}
                  onMouseMove={handleSvgMove} onMouseUp={handleSvgUp} onMouseLeave={handleSvgUp}
                  onWheel={handleWheel}>
                  <g transform={`translate(${cx},${cy}) scale(${graphZoom}) translate(${-cx + graphPan.x},${-cy + graphPan.y})`}>
                    {/* Edges */}
                    {COMPANIES.flatMap(c => c.connections.map(tid => {
                      const t = COMPANIES.find(x => x.id === tid)
                      if (!t || t.id < c.id) return null
                      const s = nodePos[c.id], e = nodePos[t.id]
                      if (!s || !e) return null
                      return <line key={c.id+'-'+tid} x1={s.x} y1={s.y} x2={e.x} y2={e.y} stroke="rgba(46,174,232,0.2)" strokeWidth="1.5" />
                    }))}
                    {/* Nodes */}
                    {COMPANIES.map(c => {
                      const p = nodePos[c.id]
                      if (!p) return null
                      const col = riskColor(c.risk)
                      const isSel = graphSelected === c.id
                      return (
                        <g key={c.id} onMouseDown={e => handleNodeDown(e, c.id)} style={{ cursor: 'grab' }}>
                          <circle cx={p.x} cy={p.y} r={isSel ? 14 : 10} fill={col} opacity={0.9} stroke={isSel ? '#fff' : col} strokeWidth={isSel ? 2 : 1} filter={c.risk >= 70 ? `drop-shadow(0 0 6px ${col})` : undefined} />
                          <text x={p.x} y={p.y + 22} textAnchor="middle" style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, fill: '#8A9BBF', pointerEvents: 'none' }}>{c.name.slice(0, 14)}</text>
                        </g>
                      )
                    })}
                  </g>
                </svg>
              </div>
              {selCo && (
                <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(46,174,232,0.15)', borderRadius: 8, padding: 20, alignSelf: 'start' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: '#2EAEE8', letterSpacing: '0.15em' }}>ДОСЬЕ</span>
                    <button onClick={() => setGraphSelected(null)} style={{ background: 'none', border: 'none', color: '#526080', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                  </div>
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#E8EDF5', marginBottom: 4, lineHeight: 1.3 }}>{selCo.name}</h3>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', color: '#526080', marginBottom: 14 }}>{selCo.city} · {selCo.type} · {selCo.founded}</div>
                  <div style={{ background: riskColor(selCo.risk) + '12', border: '1px solid ' + riskColor(selCo.risk) + '30', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: '#526080' }}>РИСК-ИНДЕКС</span>
                      <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.4rem', color: riskColor(selCo.risk) }}>{selCo.risk}</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: selCo.risk + '%', height: '100%', background: riskColor(selCo.risk), borderRadius: 3 }} />
                    </div>
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#8A9BBF', lineHeight: 1.5, marginBottom: 10 }}>{selCo.description}</p>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#526080', marginBottom: 4 }}>ДИРЕКТОР</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#E8EDF5', marginBottom: 14 }}>{selCo.director}</div>
                  {selCo.connections.length > 0 && (
                    <div>
                      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#526080', marginBottom: 8 }}>СВЯЗИ ({selCo.connections.length})</div>
                      {selCo.connections.map(tid => {
                        const t = COMPANIES.find(x => x.id === tid)
                        return t ? (
                          <div key={tid} onClick={() => setGraphSelected(tid)} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', marginBottom: 4, background: 'rgba(255,255,255,0.03)', borderRadius: 6, cursor: 'pointer' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(46,174,232,0.08)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}>
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#E8EDF5' }}>{t.name}</span>
                            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', fontWeight: 700, color: riskColor(t.risk) }}>{t.risk}</span>
                          </div>
                        ) : null
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })()}

        {viewTab === 'table' && <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 16, marginBottom: 0 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(46,174,232,0.1)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1.4fr 1fr', padding: '0 16px', background: 'rgba(7,12,24,0.8)', borderBottom: '1px solid rgba(46,174,232,0.12)' }}>
              {[
                { key: 'name', label: 'КОМПАНИЯ' },
                { key: null, label: 'ОТРАСЛЬ' },
                { key: 'revenue', label: 'ВЫРУЧКА $М' },
                { key: null, label: 'РИСК-ИНДЕКС' },
                { key: 'risk', label: 'УРОВЕНЬ' },
              ].map((col, i) => (
                <div key={i} onClick={col.key ? () => toggleSort(col.key as 'name'|'risk'|'revenue') : undefined}
                  style={{ padding: '11px 0', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', color: sortField === col.key ? '#2EAEE8' : '#526080', letterSpacing: '0.1em', cursor: col.key ? 'pointer' : 'default', userSelect: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {col.label}{col.key && sortField === col.key && <span>{sortDir === 'desc' ? ' ▼' : ' ▲'}</span>}
                </div>
              ))}
            </div>
            <div style={{ overflowY: 'auto', maxHeight: '50vh' }}>
              {filtered.map((company, idx) => (
                <div key={company.id} onClick={() => setSelected(selected === company.id ? null : company.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2.5fr 1fr 1fr 1.4fr 1fr',
                    padding: '0 16px',
                    borderBottom: '1px solid rgba(46,174,232,0.06)',
                    cursor: 'pointer',
                    transition: 'background 220ms ease, box-shadow 220ms ease',
                    background: selected === company.id ? 'rgba(46,174,232,0.08)' : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)',
                    animation: flashingCompanyIds.has(company.id) ? 'argus-row-flash 1.2s ease-out 2' : undefined,
                  }}
                  onMouseEnter={e => { if (selected !== company.id) (e.currentTarget as HTMLElement).style.background = 'rgba(46,174,232,0.05)' }}
                  onMouseLeave={e => { if (selected !== company.id) (e.currentTarget as HTMLElement).style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)' }}
                >
                  <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: company.risk >= 40 ? riskColor(company.risk) : 'transparent', flexShrink: 0, boxShadow: company.risk >= 70 ? '0 0 6px ' + riskColor(company.risk) : 'none' }} />
                    <div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#E8EDF5', lineHeight: 1.2 }}>{company.name}</div>
                      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: '#526080', marginTop: 2 }}>{company.city} · {company.type} · {company.founded}</div>
                    </div>
                  </div>
                  <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#8A9BBF' }}>{company.sector}</span>
                  </div>
                  <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.82rem', color: '#E8EDF5', fontWeight: 600, transition: 'color 220ms ease, transform 220ms ease, opacity 220ms ease' }}>{company.revenue.toLocaleString()}</span>
                  </div>
                  <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: company.risk + '%', height: '100%', background: riskColor(company.risk), borderRadius: 3, transition: 'width 420ms ease, background-color 320ms ease' }} />
                    </div>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.78rem', fontWeight: 700, color: riskColor(company.risk), width: 24, textAlign: 'right', flexShrink: 0, transition: 'color 320ms ease, transform 320ms ease, opacity 320ms ease' }}>{company.risk}</span>
                  </div>
                  <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.55rem', padding: '3px 7px', borderRadius: 4, background: riskColor(company.risk) + '18', color: riskColor(company.risk), border: '1px solid ' + riskColor(company.risk) + '35' }}>{riskLabel(company.risk)}</span>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ padding: 40, textAlign: 'center', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.75rem', color: '#526080' }}>Записей не найдено</div>
              )}
            </div>
          </div>

          {selectedCompany && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(46,174,232,0.15)', borderRadius: 8, padding: 20, alignSelf: 'start', position: 'sticky', top: 84 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', color: '#2EAEE8', letterSpacing: '0.15em' }}>ДОСЬЕ КОМПАНИИ</span>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#526080', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>✕</button>
              </div>
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#E8EDF5', marginBottom: 4, lineHeight: 1.3 }}>{selectedCompany.name}</h2>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: '#526080', marginBottom: 16 }}>{selectedCompany.city} · {selectedCompany.type} · Осн. {selectedCompany.founded}</div>
              <div style={{ background: riskColor(selectedCompany.risk) + '10', border: '1px solid ' + riskColor(selectedCompany.risk) + '30', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', color: '#526080', letterSpacing: '0.1em' }}>РИСК-ИНДЕКС</span>
                  <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.6rem', color: riskColor(selectedCompany.risk) }}>{selectedCompany.risk}</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ width: selectedCompany.risk + '%', height: '100%', background: riskColor(selectedCompany.risk), borderRadius: 3 }} />
                </div>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: riskColor(selectedCompany.risk) }}>{riskLabel(selectedCompany.risk)}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                {[
                  { k: 'ОТРАСЛЬ', v: selectedCompany.sector },
                  { k: 'ВЫРУЧКА', v: '$' + selectedCompany.revenue.toLocaleString() + 'М' },
                  { k: 'СОТРУДНИКИ', v: selectedCompany.employees.toLocaleString() },
                  { k: 'ФОРМА', v: selectedCompany.type },
                ].map(m => (
                  <div key={m.k} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '10px 12px' }}>
                    <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#526080', letterSpacing: '0.08em', marginBottom: 4 }}>{m.k}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#E8EDF5' }}>{m.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#526080', letterSpacing: '0.08em', marginBottom: 6 }}>ОПИСАНИЕ</div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#8A9BBF', lineHeight: 1.55, marginBottom: 10 }}>{selectedCompany.description}</p>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#526080', letterSpacing: '0.08em', marginBottom: 4 }}>ДИРЕКТОР</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#E8EDF5', fontWeight: 500 }}>{selectedCompany.director}</div>
              </div>
              {connectedCompanies.length > 0 && (
                <div>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#526080', letterSpacing: '0.08em', marginBottom: 8 }}>СВЯЗАННЫЕ ({connectedCompanies.length})</div>
                  {connectedCompanies.map(c => (
                    <div key={c.id} onClick={() => setSelected(c.id)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', marginBottom: 4, background: 'rgba(255,255,255,0.03)', borderRadius: 6, cursor: 'pointer', border: '1px solid transparent', transition: 'all 150ms' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(46,174,232,0.2)'; (e.currentTarget as HTMLElement).style.background = 'rgba(46,174,232,0.06)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' }}
                    >
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#E8EDF5' }}>{c.name}</span>
                      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', fontWeight: 700, color: riskColor(c.risk) }}>{c.risk}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>}

        {viewTab === 'table' && (() => {
          const analyticCompanies = COMPANIES.filter(c => analyticsIds.has(c.id))
          const metricVal = (c: typeof COMPANIES[0]) => analyticMetric === 'risk' ? c.risk : analyticMetric === 'revenue' ? c.revenue : c.employees
          const metricLabel = analyticMetric === 'risk' ? 'РИСК' : analyticMetric === 'revenue' ? 'ВЫРУЧКА $М' : 'СОТРУДНИКИ'
          const metricFmt = (v: number) => analyticMetric === 'revenue' ? (v >= 1000 ? Math.round(v / 1000) + 'K' : String(v)) : v.toLocaleString()
          const secondMetric = analyticMetric === 'risk' ? 'revenue' : analyticMetric === 'revenue' ? 'employees' : 'risk'
          const secondLabel = secondMetric === 'risk' ? 'РИСК' : secondMetric === 'revenue' ? 'ВЫРУЧКА $М' : 'СОТРУДНИКИ'
          const secondVal = (c: typeof COMPANIES[0]) => secondMetric === 'risk' ? c.risk : secondMetric === 'revenue' ? c.revenue : c.employees
          const secondFmt = (v: number) => secondMetric === 'revenue' ? (v >= 1000 ? Math.round(v / 1000) + 'K' : String(v)) : v.toLocaleString()

          const chart1Data = [...analyticCompanies].sort((a, b) => metricVal(b) - metricVal(a)).slice(0, 10)
          const maxVal1 = Math.max(...chart1Data.map(metricVal), 1)
          const chart3Data = [...analyticCompanies].sort((a, b) => secondVal(b) - secondVal(a)).slice(0, 10)
          const maxVal3 = Math.max(...chart3Data.map(secondVal), 1)

          const industryCounts: Record<string, number> = {}
          analyticCompanies.forEach(c => { industryCounts[c.sector] = (industryCounts[c.sector] || 0) + 1 })
          const donutIndustries = Object.entries(industryCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)
          const donutTotal = donutIndustries.reduce((s, [, v]) => s + v, 0)
          const pieColors = ['#2EAEE8', '#1B9AAA', '#C9A84C', '#E07B39', '#D94040', '#526080']
          let donutAngle = -Math.PI / 2
          const pieSlices = donutIndustries.map(([label, count], i) => {
            const da = donutTotal > 0 ? (count / donutTotal) * Math.PI * 2 : 0
            const ea = donutAngle + da
            const dcx = 110, dcy = 110, r = 85, ri = 48
            const x1 = dcx + r * Math.cos(donutAngle), y1 = dcy + r * Math.sin(donutAngle)
            const x2 = dcx + r * Math.cos(ea), y2 = dcy + r * Math.sin(ea)
            const ix1 = dcx + ri * Math.cos(donutAngle), iy1 = dcy + ri * Math.sin(donutAngle)
            const ix2 = dcx + ri * Math.cos(ea), iy2 = dcy + ri * Math.sin(ea)
            const large = da > Math.PI ? 1 : 0
            const path = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ri} ${ri} 0 ${large} 0 ${ix1} ${iy1} Z`
            const pct = donutTotal > 0 ? Math.round(count / donutTotal * 100) : 0
            const slice = { path, color: pieColors[i], label, count, pct }
            donutAngle = ea
            return slice
          })

          const barW = 44, barGap = 6, chartH = 150, padL = 8
          function showTip(e: React.MouseEvent, lines: string[]) { setChartTooltip({ x: e.clientX, y: e.clientY, lines }) }
          function hideTip() { setChartTooltip(t => ({ ...t, lines: [] })) }
          function moveTip(e: React.MouseEvent) { setChartTooltip(t => t.lines.length > 0 ? { ...t, x: e.clientX, y: e.clientY } : t) }

          return (
            <div style={{ marginTop: 32, paddingTop: 28, borderTop: '1px solid rgba(46,174,232,0.1)' }}>
              <style>{`@keyframes bar-grow { from { transform: scaleY(0) } to { transform: scaleY(1) } }`}</style>

              {/* Tooltip */}
              {chartTooltip.lines.length > 0 && (
                <div style={{ position: 'fixed', left: chartTooltip.x + 14, top: chartTooltip.y - 8, zIndex: 9999, background: 'rgba(7,12,24,0.96)', border: '1px solid rgba(46,174,232,0.25)', borderRadius: 6, padding: '8px 12px', pointerEvents: 'none', minWidth: 160, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                  {chartTooltip.lines.map((l, i) => (
                    <div key={i} style={{ fontFamily: i === 0 ? 'Inter, sans-serif' : 'Share Tech Mono, monospace', fontWeight: i === 0 ? 600 : 400, fontSize: i === 0 ? '0.82rem' : '0.68rem', color: i === 0 ? '#E8EDF5' : '#8A9BBF', marginBottom: i < chartTooltip.lines.length - 1 ? 3 : 0 }}>{l}</div>
                  ))}
                </div>
              )}

              {/* Header: label + controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="status-dot" />
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: '#2EAEE8', letterSpacing: '0.18em' }}>ANALYTICS — RISK INTELLIGENCE OVERVIEW</span>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Metric toggle */}
                  <div style={{ display: 'flex', gap: 0, border: '1px solid rgba(46,174,232,0.15)', borderRadius: 6, overflow: 'hidden' }}>
                    {(['risk', 'revenue', 'employees'] as const).map(m => (
                      <button key={m} onClick={() => setAnalyticMetric(m)} style={{ padding: '6px 14px', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.08em', cursor: 'pointer', border: 'none', transition: 'all 150ms', background: analyticMetric === m ? 'rgba(46,174,232,0.15)' : 'transparent', color: analyticMetric === m ? '#2EAEE8' : '#526080' }}>
                        {m === 'risk' ? 'РИСК' : m === 'revenue' ? 'ВЫРУЧКА' : 'СОТРУДНИКИ'}
                      </button>
                    ))}
                  </div>
                  {/* Company selector */}
                  <div style={{ position: 'relative' }}>
                    {selectorOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setSelectorOpen(false)} />}
                    <button onClick={() => setSelectorOpen(o => !o)} style={{ position: 'relative', zIndex: 100, padding: '6px 14px', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.08em', cursor: 'pointer', background: selectorOpen ? 'rgba(46,174,232,0.15)' : 'rgba(46,174,232,0.05)', border: '1px solid rgba(46,174,232,0.2)', borderRadius: 6, color: '#2EAEE8', transition: 'all 150ms', whiteSpace: 'nowrap' }}>
                      ◈ КОМПАНИИ ({analyticsIds.size}) ▾
                    </button>
                    {selectorOpen && (
                      <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', zIndex: 200, width: 300, maxHeight: 360, overflowY: 'auto', background: 'var(--bg-card)', border: '1px solid rgba(46,174,232,0.2)', borderRadius: 8, boxShadow: '0 16px 48px rgba(0,0,0,0.5)', padding: '8px 0' }}>
                        <div style={{ display: 'flex', gap: 8, padding: '8px 12px 10px', borderBottom: '1px solid rgba(46,174,232,0.08)' }}>
                          <button onClick={() => setAnalyticsIds(new Set(COMPANIES.map(c => c.id)))} style={{ flex: 1, padding: '5px 0', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', cursor: 'pointer', background: 'rgba(46,174,232,0.08)', border: '1px solid rgba(46,174,232,0.2)', borderRadius: 4, color: '#2EAEE8' }}>ВЫБРАТЬ ВСЕ</button>
                          <button onClick={() => setAnalyticsIds(new Set())} style={{ flex: 1, padding: '5px 0', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', cursor: 'pointer', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, color: '#526080' }}>СБРОСИТЬ</button>
                        </div>
                        {COMPANIES.map(c => {
                          const checked = analyticsIds.has(c.id)
                          return (
                            <div key={c.id} onClick={() => setAnalyticsIds(prev => { const n = new Set(prev); if (n.has(c.id)) n.delete(c.id); else n.add(c.id); return n })}
                              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px', cursor: 'pointer', background: checked ? 'rgba(46,174,232,0.05)' : 'transparent', transition: 'background 120ms' }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = checked ? 'rgba(46,174,232,0.1)' : 'rgba(255,255,255,0.03)'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = checked ? 'rgba(46,174,232,0.05)' : 'transparent'}>
                              <div style={{ width: 14, height: 14, border: '1px solid ' + (checked ? '#2EAEE8' : 'rgba(255,255,255,0.15)'), borderRadius: 3, background: checked ? '#2EAEE8' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms' }}>
                                {checked && <svg width="9" height="9" viewBox="0 0 9 9"><polyline points="1.5,4.5 3.5,6.5 7.5,2" stroke="#050508" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.76rem', color: '#E8EDF5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.54rem', color: '#526080' }}>{c.sector} · риск {c.risk}</div>
                              </div>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: riskColor(c.risk), flexShrink: 0 }} />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {analyticCompanies.length === 0 ? (
                <div style={{ padding: '48px 0', textAlign: 'center', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.75rem', color: '#526080' }}>Выберите компании для отображения аналитики</div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>

                    {/* Chart 1: Top by selected metric */}
                    <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(46,174,232,0.1)', borderRadius: 8, padding: '20px 20px 16px' }}>
                      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: '#526080', letterSpacing: '0.12em', marginBottom: 16 }}>ТОП-10 ПО {metricLabel}</div>
                      <svg width="100%" viewBox={`0 0 ${padL + chart1Data.length * (barW + barGap) + 20} ${chartH + 60}`} style={{ overflow: 'visible', display: 'block' }}>
                        {[0, 0.25, 0.5, 0.75, 1].map(v => {
                          const yv = chartH * (1 - v)
                          return (
                            <g key={v}>
                              <line x1={padL} y1={yv} x2={padL + chart1Data.length * (barW + barGap)} y2={yv} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                              <text x={padL - 2} y={yv + 4} textAnchor="end" style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 7, fill: '#526080' }}>{metricFmt(Math.round(maxVal1 * v))}</text>
                            </g>
                          )
                        })}
                        {chart1Data.map((c, i) => {
                          const bh = Math.max(2, (metricVal(c) / maxVal1) * chartH)
                          const bx = padL + i * (barW + barGap)
                          const col = riskColor(c.risk)
                          const isSel = selected === c.id
                          return (
                            <g key={`${c.id}-${analyticMetric}`} style={{ cursor: 'pointer' }}
                              onClick={() => { setSelected(c.id) }}
                              onMouseEnter={e => showTip(e, [c.name, `${metricLabel}: ${metricFmt(metricVal(c))}`, `Риск: ${riskLabel(c.risk)} (${c.risk})`])}
                              onMouseMove={moveTip} onMouseLeave={hideTip}>
                              <rect x={bx} y={chartH - bh} width={barW} height={bh} fill={col}
                                opacity={isSel ? 1 : 0.78} rx="2"
                                style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', animation: 'bar-grow 400ms ease forwards', filter: isSel ? `drop-shadow(0 0 8px ${col})` : undefined }} />
                              <text x={bx + barW / 2} y={chartH - bh - 4} textAnchor="middle" style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, fill: col, fontWeight: 700 }}>{metricFmt(metricVal(c))}</text>
                              <text x={bx + barW / 2} y={chartH + 14} textAnchor="middle" style={{ fontFamily: 'Inter, sans-serif', fontSize: 8, fill: isSel ? '#E8EDF5' : '#8A9BBF' }}>{c.name.split(' ')[0].slice(0, 10)}</text>
                            </g>
                          )
                        })}
                        <line x1={padL} y1={chartH} x2={padL + chart1Data.length * (barW + barGap)} y2={chartH} stroke="rgba(46,174,232,0.2)" strokeWidth="1" />
                      </svg>
                    </div>

                    {/* Chart 2: Industry donut */}
                    <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(46,174,232,0.1)', borderRadius: 8, padding: '20px 20px 16px' }}>
                      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: '#526080', letterSpacing: '0.12em', marginBottom: 16 }}>ОТРАСЛЕВОЕ РАСПРЕДЕЛЕНИЕ</div>
                      {donutTotal === 0 ? <div style={{ color: '#526080', fontSize: '0.75rem', fontFamily: 'Share Tech Mono, monospace', padding: 20 }}>Нет данных</div> : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <svg width="200" height="200" style={{ flexShrink: 0 }}>
                            {pieSlices.map((sl, i) => {
                              const isActive = industryFilter === sl.label
                              return (
                                <path key={i} d={sl.path} fill={sl.color}
                                  opacity={isActive ? 1 : 0.82}
                                  stroke={isActive ? '#fff' : 'rgba(7,12,24,0.8)'}
                                  strokeWidth={isActive ? 3 : 2}
                                  style={{ cursor: 'pointer', filter: isActive ? `drop-shadow(0 0 8px ${sl.color})` : undefined }}
                                  onClick={() => setIndustryFilter(industryFilter === sl.label ? 'Все' : sl.label)}
                                  onMouseEnter={e => showTip(e, [sl.label, `Компаний: ${sl.count}`, `Доля: ${sl.pct}%`])}
                                  onMouseMove={moveTip} onMouseLeave={hideTip}
                                />
                              )
                            })}
                            <text x="100" y="95" textAnchor="middle" style={{ fontFamily: 'Orbitron, monospace', fontSize: 20, fontWeight: 900, fill: '#E8EDF5' }}>{analyticCompanies.length}</text>
                            <text x="100" y="112" textAnchor="middle" style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 8, fill: '#526080' }}>КОМПАНИЙ</text>
                          </svg>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                            {pieSlices.map((sl, i) => {
                              const isActive = industryFilter === sl.label
                              return (
                                <div key={i} onClick={() => setIndustryFilter(industryFilter === sl.label ? 'Все' : sl.label)}
                                  style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', padding: '3px 6px', borderRadius: 4, background: isActive ? 'rgba(46,174,232,0.08)' : 'transparent', transition: 'background 150ms' }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(46,174,232,0.06)'; showTip(e, [sl.label, `${sl.count} компаний · ${sl.pct}%`]) }}
                                  onMouseMove={moveTip}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isActive ? 'rgba(46,174,232,0.08)' : 'transparent'; hideTip() }}>
                                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: sl.color, flexShrink: 0 }} />
                                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: isActive ? '#E8EDF5' : '#8A9BBF', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sl.label}</span>
                                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: sl.color, fontWeight: 700, flexShrink: 0 }}>{sl.pct}%</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chart 3: Top by secondary metric */}
                    <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(46,174,232,0.1)', borderRadius: 8, padding: '20px 20px 16px' }}>
                      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: '#526080', letterSpacing: '0.12em', marginBottom: 16 }}>ТОП-10 ПО {secondLabel}</div>
                      <svg width="100%" viewBox={`0 0 ${padL + chart3Data.length * (barW + barGap) + 20} ${chartH + 60}`} style={{ overflow: 'visible', display: 'block' }}>
                        {[0, 0.25, 0.5, 0.75, 1].map(v => {
                          const yv = chartH * (1 - v)
                          return (
                            <g key={v}>
                              <line x1={padL} y1={yv} x2={padL + chart3Data.length * (barW + barGap)} y2={yv} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                              <text x={padL - 2} y={yv + 4} textAnchor="end" style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 7, fill: '#526080' }}>{secondFmt(Math.round(maxVal3 * v))}</text>
                            </g>
                          )
                        })}
                        {chart3Data.map((c, i) => {
                          const bh = Math.max(2, (secondVal(c) / maxVal3) * chartH)
                          const bx = padL + i * (barW + barGap)
                          const col = pieColors[i % pieColors.length]
                          const isSel = selected === c.id
                          return (
                            <g key={`${c.id}-${secondMetric}`} style={{ cursor: 'pointer' }}
                              onClick={() => { setSelected(c.id) }}
                              onMouseEnter={e => showTip(e, [c.name, `${secondLabel}: ${secondFmt(secondVal(c))}`, `Риск: ${riskLabel(c.risk)} (${c.risk})`])}
                              onMouseMove={moveTip} onMouseLeave={hideTip}>
                              <rect x={bx} y={chartH - bh} width={barW} height={bh} fill={col}
                                opacity={isSel ? 1 : 0.78} rx="2"
                                style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', animation: 'bar-grow 400ms ease forwards', filter: isSel ? `drop-shadow(0 0 8px ${col})` : undefined }} />
                              <text x={bx + barW / 2} y={chartH - bh - 4} textAnchor="middle" style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, fill: col, fontWeight: 700 }}>{secondFmt(secondVal(c))}</text>
                              <text x={bx + barW / 2} y={chartH + 14} textAnchor="middle" style={{ fontFamily: 'Inter, sans-serif', fontSize: 8, fill: isSel ? '#E8EDF5' : '#8A9BBF' }}>{c.name.split(' ')[0].slice(0, 10)}</text>
                            </g>
                          )
                        })}
                        <line x1={padL} y1={chartH} x2={padL + chart3Data.length * (barW + barGap)} y2={chartH} stroke="rgba(46,174,232,0.2)" strokeWidth="1" />
                      </svg>
                    </div>
                  </div>

                  {/* Summary cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 16 }}>
                    {[
                      { label: 'НИЗКИЙ РИСК', filter: 'НИЗКИЕ', count: analyticCompanies.filter(c => c.risk < 20).length, total: COMPANIES.filter(c => c.risk < 20).length, color: '#2EAEE8', range: '0–19' },
                      { label: 'СРЕДНИЙ РИСК', filter: 'СРЕДНИЕ', count: analyticCompanies.filter(c => c.risk >= 20 && c.risk < 40).length, total: COMPANIES.filter(c => c.risk >= 20 && c.risk < 40).length, color: '#C9A84C', range: '20–39' },
                      { label: 'ВЫСОКИЙ РИСК', filter: 'ВЫСОКИЕ', count: analyticCompanies.filter(c => c.risk >= 40 && c.risk < 70).length, total: COMPANIES.filter(c => c.risk >= 40 && c.risk < 70).length, color: '#E07B39', range: '40–69' },
                      { label: 'КРИТИЧНЫЙ', filter: 'КРИТИЧНЫЕ', count: analyticCompanies.filter(c => c.risk >= 70).length, total: COMPANIES.filter(c => c.risk >= 70).length, color: '#D94040', range: '70–100' },
                    ].map(s => {
                      const isActive = riskFilter === s.filter
                      return (
                        <div key={s.label} onClick={() => setRiskFilter(isActive ? 'Все' : s.filter)}
                          style={{ background: 'var(--bg-card)', border: '1px solid ' + (isActive ? s.color : s.color + '22'), borderRadius: 8, padding: '16px 18px', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all 200ms', boxShadow: isActive ? `0 0 16px ${s.color}22` : 'none' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = s.color + '66'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = isActive ? s.color : s.color + '22'}>
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: s.color }} />
                          {isActive && <div style={{ position: 'absolute', inset: 0, background: s.color, opacity: 0.04, pointerEvents: 'none' }} />}
                          <div style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '2rem', color: s.color, marginBottom: 4 }}>{s.count}</div>
                          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', color: isActive ? s.color : '#526080', letterSpacing: '0.1em' }}>{s.label}</div>
                          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: s.color, marginTop: 4, opacity: 0.7 }}>{s.range} · {s.total} всего</div>
                          <div style={{ position: 'absolute', right: 12, bottom: 10, width: 40, height: 40, borderRadius: '50%', background: s.color, opacity: isActive ? 0.12 : 0.06, transition: 'opacity 200ms', pointerEvents: 'none' }} />
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          )
        })()}

        <div style={{ height: 48 }} />
      </div>
    </div>
  )
                                }
