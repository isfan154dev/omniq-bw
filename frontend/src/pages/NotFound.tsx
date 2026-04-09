import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 72,
      }}
    >
      <div className="scanline-overlay" />

      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70vw',
          height: '70vh',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 40%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Horizontal scan lines */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.15), transparent)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '30%',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.15), transparent)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="container"
        style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}
      >
        {/* Glitching 404 */}
        <div
          className="glitch-404"
          style={{
            fontFamily: 'Orbitron, monospace',
            fontWeight: 900,
            fontSize: 'clamp(6rem, 20vw, 14rem)',
            lineHeight: 1,
            marginBottom: 8,
            color: '#0a0a0a',
            textShadow: 'none',
            letterSpacing: '-0.02em',
            userSelect: 'none',
          }}
        >
          404
        </div>

        {/* SIGNAL LOST */}
        <div
          style={{
            fontFamily: 'Orbitron, monospace',
            fontWeight: 900,
            fontSize: 'clamp(1.4rem, 4vw, 2.8rem)',
            letterSpacing: '0.25em',
            background: 'linear-gradient(135deg, #ffffff 0%, #efefed 50%, #0a0a0a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 24,
            textTransform: 'uppercase',
          }}
        >
          SIGNAL LOST
        </div>

        {/* Mono status line */}
        <div
          style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            color: '#0a0a0a',
            marginBottom: 12,
            opacity: 0.8,
          }}
        >
          ERROR_CODE: 0x404 В· ROUTE_NOT_FOUND В· TIMESTAMP: {new Date().toISOString().slice(0, 19)}Z
        </div>

        <p
          style={{
            fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)',
            color: 'var(--text-secondary)',
            maxWidth: 480,
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}
        >
          The page you requested does not exist in our ontology.
          <br />
          <span
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            No matching node or relationship found in the knowledge graph.
          </span>
        </p>

        {/* CTA */}
        <Link to="/" className="btn-primary" style={{ fontSize: '0.78rem', padding: '13px 36px' }}>
          <span>в—€</span> {t('nav_home')}
        </Link>

        {/* Bottom terminal line */}
        <div
          style={{
            marginTop: 64,
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            opacity: 0.5,
          }}
        >
          OMNIQ DECISION INTELLIGENCE В· SOVEREIGN PLATFORM В· v2.4
        </div>
      </div>

      <style>{`
        .glitch-404 {
          position: relative;
          animation: glitch404 4s ease-in-out infinite;
        }

        .glitch-404::before,
        .glitch-404::after {
          content: '404';
          position: absolute;
          top: 0; left: 0; right: 0;
          font-family: Orbitron, monospace;
          font-weight: 900;
          font-size: inherit;
          letter-spacing: inherit;
        }

        .glitch-404::before {
          color: #0a0a0a;
          animation: glitch404-before 4s ease-in-out infinite;
          clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
          opacity: 0;
        }

        .glitch-404::after {
          color: #2a2a2a;
          animation: glitch404-after 4s ease-in-out infinite;
          clip-path: polygon(0 55%, 100% 55%, 100% 75%, 0 75%);
          opacity: 0;
        }

        @keyframes glitch404 {
          0%, 85%, 100% { transform: none; }
          87% { transform: translate(-3px, 0) skew(-1deg); }
          89% { transform: translate(3px, 0) skew(1deg); }
          91% { transform: translate(-2px, 1px); }
          93% { transform: none; }
        }

        @keyframes glitch404-before {
          0%, 85%, 100% { opacity: 0; transform: none; }
          87% { opacity: 0.8; transform: translate(-6px, 0); }
          89% { opacity: 0.6; transform: translate(4px, 0); }
          91%, 93% { opacity: 0; transform: none; }
        }

        @keyframes glitch404-after {
          0%, 85%, 100% { opacity: 0; transform: none; }
          87% { opacity: 0; }
          89% { opacity: 0.7; transform: translate(6px, 0); }
          91% { opacity: 0.5; transform: translate(-3px, 0); }
          93% { opacity: 0; transform: none; }
        }
      `}</style>
    </div>
  )
}


