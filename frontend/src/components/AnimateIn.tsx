import { useEffect, useRef, useState, ReactNode, CSSProperties } from 'react'

interface AnimateInProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'fade'
  distance?: number
  duration?: number
  className?: string
  style?: CSSProperties
  threshold?: number
}

/**
 * Wraps children in a div that fades + slides into view when it enters the viewport.
 * Uses IntersectionObserver — no external libraries.
 */
export default function AnimateIn({
  children,
  delay = 0,
  direction = 'up',
  distance = 28,
  duration = 600,
  className,
  style,
  threshold = 0.12,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const hiddenTransform =
    direction === 'up'
      ? `translateY(${distance}px)`
      : direction === 'left'
        ? `translateX(-${distance}px)`
        : 'none'

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : hiddenTransform,
        transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`,
        willChange: visible ? 'auto' : 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
