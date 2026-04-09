import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { ModalProvider } from './context/ModalContext'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import OmniqModal from './components/OmniqModal'
import Footer from './components/Footer'

// Route-level code splitting — each page loads only when visited
const Home = lazy(() => import('./pages/Home'))
const Argus = lazy(() => import('./pages/Argus'))
const Nexus = lazy(() => import('./pages/Nexus'))
const Aurora = lazy(() => import('./pages/Aurora'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Pitch = lazy(() => import('./pages/Pitch'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
      }}
    >
      <span
        style={{
          fontFamily: 'Share Tech Mono, monospace',
          color: 'var(--accent-cyan)',
          fontSize: '0.75rem',
          letterSpacing: '0.25em',
          animation: 'blink 1s ease infinite',
        }}
      >
        LOADING...
      </span>
    </div>
  )
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token, isLoading } = useAuth()

  if (isLoading) {
    return <PageLoader />
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default function App() {
  return (
    <LanguageProvider>
      <ModalProvider>
        <div className="app-wrapper">
          <Navbar />
          <main>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/argus" element={<ProtectedRoute><Argus /></ProtectedRoute>} />
                <Route path="/nexus" element={<ProtectedRoute><Nexus /></ProtectedRoute>} />
                <Route path="/aurora" element={<ProtectedRoute><Aurora /></ProtectedRoute>} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/pitch" element={<Pitch />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <OmniqModal />
        </div>
      </ModalProvider>
    </LanguageProvider>
  )
}
