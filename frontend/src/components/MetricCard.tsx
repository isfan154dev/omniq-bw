import { useEffect, useRef, useState } from 'react'

interface MetricCardProps {
  value: number
  suffix?: string
  prefix?: string
  label: string
  sublabel?: string
  color: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  decimals?: number
}

function useCountUp(target: number, duration: number = 1800, decimals: number = 0) {
  const [count, setCount] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const frameRef = useRef<number>(0)
  const startedRef = useRef(false)

  const start = () => {
    if (startedRef.current) return
    startedRef.current = true

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(parseFloat((target * eased).toFixed(decimals)))
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }
    frameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return { count, start }
}

export default function MetricCard({
  value,
  suffix = '',
  prefix = '',
  label,
  sublabel,
  color,
  trend = 'neutral',
  trendValue,
  decimals = 0,
}: MetricCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { count, start } = useCountUp(value, 1800, decimals)
  const [visible, setVisible] = useState(false)

  // Only color strings starting with # are hex
  const isHex = color.startsWith('#')
  const rgbFromHex = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `${r}, ${g}, ${b}`
  }
  const rgb = isHex ? rgbFromHex(color) : '0, 212, 255'

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !visible) {
          setVisible(true)
          start()
        }
      },
      { threshold: 0.3 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [visible, start])

  const trendColor =
    trend === 'up' ? '#00ff88'
    : trend === 'down' ? '#ff2d55'
    : 'var(--text-muted)'

  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'

  return (
    <div
      ref={cardRef}
      style={{
        padding: '28px 24px',
        background: `linear-gradient(145deg, rgba(${rgb}, 0.05) 0%, var(--bg-card) 100%)`,
        border: `1px solid rgba(${rgb}, 0.25)`,
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 500ms ease, transform 500ms ease',
      }}
    >
      {/* Top border accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 8px rgba(${rgb}, 0.5)`,
        }}
      />

      {/* Corner decoration */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 60,
          height: 60,
          background: `radial-gradient(circle at top right, rgba(${rgb}, 0.1) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Value */}
      <div
        style={{
          fontFamily: 'Orbitron, monospace',
          fontWeight: 900,
          fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
          lineHeight: 1.1,
          marginBottom: 8,
          color: color,
          textShadow: `0 0 20px rgba(${rgb}, 0.5)`,
          letterSpacing: '-0.02em',
        }}
      >
        {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}{suffix}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: '0.72rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          marginBottom: sublabel ? 6 : 0,
        }}
      >
        {label}
      </div>

      {sublabel && (
        <div
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}
        >
          {sublabel}
        </div>
      )}

      {/* Trend */}
      {trendValue && (
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.72rem',
            color: trendColor,
          }}
        >
          <span>{trendIcon}</span>
          <span>{trendValue}</span>
          <span style={{ color: 'var(--text-muted)', marginLeft: 2 }}>vs last quarter</span>
        </div>
      )}

      {/* Bottom bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, rgba(${rgb}, 0.3), rgba(${rgb}, 0.6) ${(count / value) * 100}%, rgba(${rgb}, 0.05) ${(count / value) * 100}%, rgba(${rgb}, 0.05) 100%)`,
          transition: 'background 100ms ease',
        }}
      />
    </div>
  )
}
