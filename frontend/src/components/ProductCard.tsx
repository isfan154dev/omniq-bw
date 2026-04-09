import { Link } from 'react-router-dom'
import { useState } from 'react'

interface ProductCardProps {
  name: string
  tagline: string
  description: string
  color: string
  icon: React.ReactNode
  features: string[]
  href: string
  onExplore?: () => void
}

export default function ProductCard({
  name,
  tagline,
  description,
  color,
  icon,
  features,
  href,
  onExplore,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false)

  const isHex = color.startsWith('#')
  const rgbFromHex = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `${r}, ${g}, ${b}`
  }
  const rgb = isHex ? rgbFromHex(color) : '0, 212, 255'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: hovered
          ? `linear-gradient(145deg, rgba(${rgb}, 0.06) 0%, var(--bg-card) 100%)`
          : 'var(--bg-card)',
        border: `1px solid ${hovered ? `rgba(${rgb}, 0.5)` : `rgba(${rgb}, 0.2)`}`,
        borderRadius: 'var(--radius-xl)',
        padding: '36px 32px',
        overflow: 'hidden',
        transition: 'all 350ms ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 20px 48px rgba(0,0,0,0.4), 0 0 40px rgba(${rgb}, 0.12)`
          : '0 4px 24px rgba(0,0,0,0.3)',
        cursor: 'default',
      }}
    >
      {/* Scan-line animation */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          borderRadius: 'var(--radius-xl)',
          pointerEvents: 'none',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 300ms ease',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(90deg, transparent, rgba(${rgb}, 0.4), transparent)`,
            animation: hovered ? 'scanline 3s linear infinite' : 'none',
          }}
        />
      </div>

      {/* Top corner accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 80,
          height: 80,
          background: `radial-gradient(circle at top right, rgba(${rgb}, 0.15) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 'var(--radius-base)',
          background: `rgba(${rgb}, 0.1)`,
          border: `1px solid rgba(${rgb}, 0.3)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          color: color,
          boxShadow: hovered ? `0 0 16px rgba(${rgb}, 0.3)` : 'none',
          transition: 'box-shadow 300ms ease',
          fontSize: '1.4rem',
        }}
      >
        {icon}
      </div>

      {/* Product name */}
      <div
        style={{
          fontFamily: 'Orbitron, monospace',
          fontWeight: 900,
          fontSize: '1.4rem',
          letterSpacing: '0.08em',
          color: color,
          textShadow: hovered ? `0 0 16px rgba(${rgb}, 0.6)` : 'none',
          marginBottom: 4,
          transition: 'text-shadow 300ms ease',
        }}
      >
        {name}
      </div>

      {/* Tagline */}
      <div
        style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: `rgba(${rgb}, 0.7)`,
          marginBottom: 16,
        }}
      >
        {tagline}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          marginBottom: 24,
        }}
      >
        {description}
      </p>

      {/* Features list */}
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          marginBottom: 28,
        }}
      >
        {features.map(feat => (
          <li
            key={feat}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: '0.83rem',
              color: 'var(--text-secondary)',
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: `rgba(${rgb}, 0.1)`,
                border: `1px solid rgba(${rgb}, 0.4)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8">
                <polyline points="1,4 3,6 7,2" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {feat}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {onExplore ? (
        <button
          onClick={onExplore}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'Orbitron, monospace',
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: color,
            padding: '10px 20px',
            border: `1px solid rgba(${rgb}, 0.4)`,
            borderRadius: 'var(--radius-base)',
            background: `rgba(${rgb}, 0.05)`,
            transition: 'all 200ms ease',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = `rgba(${rgb}, 0.12)`
            e.currentTarget.style.borderColor = color
            e.currentTarget.style.boxShadow = `0 0 16px rgba(${rgb}, 0.2)`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = `rgba(${rgb}, 0.05)`
            e.currentTarget.style.borderColor = `rgba(${rgb}, 0.4)`
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          EXPLORE {name}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      ) : (
        <Link
          to={href}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'Orbitron, monospace',
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: color,
            textDecoration: 'none',
            padding: '10px 20px',
            border: `1px solid rgba(${rgb}, 0.4)`,
            borderRadius: 'var(--radius-base)',
            background: `rgba(${rgb}, 0.05)`,
            transition: 'all 200ms ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = `rgba(${rgb}, 0.12)`
            e.currentTarget.style.borderColor = color
            e.currentTarget.style.boxShadow = `0 0 16px rgba(${rgb}, 0.2)`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = `rgba(${rgb}, 0.05)`
            e.currentTarget.style.borderColor = `rgba(${rgb}, 0.4)`
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          EXPLORE {name}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      )}
    </div>
  )
}
