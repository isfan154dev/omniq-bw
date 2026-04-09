import { useEffect, useState } from 'react'

interface Node {
  id: string
  label: string
  x: number
  y: number
  type: 'country' | 'hub' | 'data'
  color: string
}

interface Edge {
  from: string
  to: string
  active: boolean
}

const NODES: Node[] = [
  // Uzbekistan regions — positioned on viewBox 0 0 600 400
  { id: 'tsh', label: 'Tashkent',     x: 390, y: 130, type: 'country', color: '#0a0a0a' },
  { id: 'sam', label: 'Samarkand',    x: 280, y: 230, type: 'country', color: '#0a0a0a' },
  { id: 'nam', label: 'Namangan',     x: 450, y: 160, type: 'country', color: '#0a0a0a' },
  { id: 'and', label: 'Andijan',      x: 490, y: 200, type: 'country', color: '#0a0a0a' },
  { id: 'bux', label: 'Bukhara',      x: 175, y: 240, type: 'country', color: '#0a0a0a' },
  { id: 'nuk', label: 'Nukus',        x: 110, y: 155, type: 'country', color: '#0a0a0a' },
  // Gov hubs
  { id: 'h1', label: 'OMNIQ Hub',     x: 310, y: 175, type: 'hub',     color: '#2a2a2a' },
  { id: 'h2', label: 'my.gov.uz',     x: 480, y: 290, type: 'hub',     color: '#3a3a3a' },
  { id: 'h3', label: 'Soliq/Bojxona', x: 145, y: 310, type: 'hub',     color: '#5a5a5a' },
  // Data nodes (ESEDO, MinFin, CBU)
  { id: 'd1', label: '',              x: 250, y: 120, type: 'data',    color: '#0a0a0a' },
  { id: 'd2', label: '',              x: 420, y: 310, type: 'data',    color: '#2a2a2a' },
  { id: 'd3', label: '',              x: 100, y: 260, type: 'data',    color: '#3a3a3a' },
  { id: 'd4', label: '',              x: 540, y: 240, type: 'data',    color: '#0a0a0a' },
  { id: 'd5', label: '',              x: 200, y: 330, type: 'data',    color: '#2a2a2a' },
]

const EDGES: Edge[] = [
  { from: 'h1', to: 'tsh', active: true },
  { from: 'h1', to: 'sam', active: true },
  { from: 'h1', to: 'nam', active: false },
  { from: 'h1', to: 'and', active: true },
  { from: 'h1', to: 'bux', active: false },
  { from: 'h1', to: 'nuk', active: true },
  { from: 'h1', to: 'h2', active: true },
  { from: 'h1', to: 'h3', active: true },
  { from: 'tsh', to: 'nam', active: false },
  { from: 'sam', to: 'bux', active: true },
  { from: 'h2', to: 'd1', active: false },
  { from: 'h2', to: 'd2', active: true },
  { from: 'h3', to: 'd3', active: true },
  { from: 'h3', to: 'd5', active: false },
  { from: 'and', to: 'd4', active: true },
]

function getNode(id: string): Node {
  return NODES.find(n => n.id === id)!
}

export default function GlobeVisualization() {
  const [pulseStep, setPulseStep] = useState(0)
  const [activeEdgeIdx, setActiveEdgeIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseStep(s => (s + 1) % 60)
    }, 60)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveEdgeIdx(i => (i + 1) % EDGES.length)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  const viewW = 600
  const viewH = 400

  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-glow)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 60px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="status-dot" />
          <span
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '0.72rem',
              letterSpacing: '0.15em',
              color: 'var(--accent-cyan)',
            }}
          >
            UZBEKISTAN INTELLIGENCE NETWORK — LIVE
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'TSH', color: '#0a0a0a' },
            { label: 'SAM', color: '#0a0a0a' },
            { label: 'NAM', color: '#0a0a0a' },
            { label: 'AND', color: '#0a0a0a' },
            { label: 'BUX', color: '#0a0a0a' },
            { label: 'NUK', color: '#0a0a0a' },
          ].map(c => (
            <span
              key={c.label}
              style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '0.65rem',
                letterSpacing: '0.08em',
                padding: '2px 8px',
                border: `1px solid rgba(0, 0, 0, 0.2)`,
                borderRadius: '3px',
                color: c.color,
                opacity: 0.7,
              }}
            >
              {c.label}
            </span>
          ))}
        </div>
      </div>

      {/* SVG graph */}
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{ width: '100%', display: 'block', minHeight: 320 }}
        aria-label="Uzbekistan intelligence network graph"
      >
        {/* Background subtle map silhouette */}
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1"/>
            <stop offset="100%" stopColor="#efefed" stopOpacity="1"/>
          </radialGradient>
          <filter id="glow-cyan">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glow-purple">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          {/* Animated dash for active edges */}
          <marker id="arrowCyan" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,1 L5,3 L0,5" fill="none" stroke="#0a0a0a" strokeWidth="1"/>
          </marker>
          <marker id="arrowPurple" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,1 L5,3 L0,5" fill="none" stroke="#2a2a2a" strokeWidth="1"/>
          </marker>
        </defs>

        <rect width={viewW} height={viewH} fill="url(#bgGrad)"/>

        {/* Grid lines in the background */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={`hg-${i}`}
            x1={0} y1={(viewH / 12) * i}
            x2={viewW} y2={(viewH / 12) * i}
            stroke="rgba(0,0,0,0.04)" strokeWidth="1"
          />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <line
            key={`vg-${i}`}
            x1={(viewW / 16) * i} y1={0}
            x2={(viewW / 16) * i} y2={viewH}
            stroke="rgba(0,0,0,0.04)" strokeWidth="1"
          />
        ))}

        {/* Edges */}
        {EDGES.map((edge, idx) => {
          const a = getNode(edge.from)
          const b = getNode(edge.to)
          const isHighlighted = idx === activeEdgeIdx
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={a.x} y1={a.y}
              x2={b.x} y2={b.y}
              stroke={isHighlighted ? '#0a0a0a' : 'rgba(0,0,0,0.15)'}
              strokeWidth={isHighlighted ? 1.5 : 0.75}
              strokeDasharray={edge.active ? 'none' : '4 3'}
              opacity={isHighlighted ? 1 : 0.6}
              markerEnd={isHighlighted ? 'url(#arrowCyan)' : undefined}
              style={{ transition: 'all 300ms ease' }}
            />
          )
        })}

        {/* Pulse rings on country nodes */}
        {NODES.filter(n => n.type === 'country').map(node => {
          const scale = 1 + Math.sin((pulseStep / 60) * Math.PI * 2) * 0.3
          return (
            <circle
              key={`ring-${node.id}`}
              cx={node.x}
              cy={node.y}
              r={18 * scale}
              fill="none"
              stroke="#0a0a0a"
              strokeWidth="0.5"
              opacity={0.15 * (1 - scale * 0.3)}
            />
          )
        })}

        {/* Nodes */}
        {NODES.map(node => {
          const isCountry = node.type === 'country'
          const isHub = node.type === 'hub'
          const r = isCountry ? 10 : isHub ? 8 : 4

          return (
            <g key={node.id} filter={isHub ? 'url(#glow-purple)' : 'url(#glow-cyan)'}>
              {/* Outer ring */}
              <circle
                cx={node.x}
                cy={node.y}
                r={r + 5}
                fill="none"
                stroke={node.color}
                strokeWidth="0.5"
                opacity={0.3}
              />
              {/* Main node */}
              <circle
                cx={node.x}
                cy={node.y}
                r={r}
                fill={isCountry
                  ? 'rgba(0, 0, 0, 0.15)'
                  : isHub
                    ? 'rgba(0, 0, 0, 0.2)'
                    : `rgba(0, 0, 0, 0.08)`}
                stroke={node.color}
                strokeWidth={isCountry ? 1.5 : 1}
              />
              {/* Center dot */}
              <circle cx={node.x} cy={node.y} r={isCountry ? 3 : 2} fill={node.color} />

              {/* Label */}
              {node.label && (
                <text
                  x={node.x}
                  y={node.y + r + 14}
                  textAnchor="middle"
                  fill={node.color}
                  fontSize={isCountry ? 9 : 8}
                  fontFamily="Share Tech Mono, monospace"
                  letterSpacing="1"
                  opacity={0.85}
                >
                  {node.label}
                </text>
              )}
            </g>
          )
        })}

        {/* Data flow particles on active edge */}
        {EDGES[activeEdgeIdx] && (() => {
          const edge = EDGES[activeEdgeIdx]
          const a = getNode(edge.from)
          const b = getNode(edge.to)
          const t = (pulseStep % 60) / 60
          const px = a.x + (b.x - a.x) * t
          const py = a.y + (b.y - a.y) * t
          return (
            <circle
              cx={px}
              cy={py}
              r={3}
              fill="#0a0a0a"
              opacity={0.9}
              filter="url(#glow-cyan)"
            />
          )
        })()}
      </svg>

      {/* Legend */}
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
          { color: '#0a0a0a', label: 'Region Node' },
          { color: '#2a2a2a', label: 'OMNIQ Hub' },
          { color: '#3a3a3a', label: 'my.gov.uz' },
          { color: '#5a5a5a', label: 'Soliq / Bojxona' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: item.color,
              }}
            />
            <span
              style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.06em',
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
