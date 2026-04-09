import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type ModalType = 'demo' | 'access' | null

interface ModalContextValue {
  modalType: ModalType
  openDemo: () => void
  openAccess: () => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalType, setModalType] = useState<ModalType>(null)

  return (
    <ModalContext.Provider value={{
      modalType,
      openDemo:   () => setModalType('demo'),
      openAccess: () => setModalType('access'),
      closeModal: () => setModalType(null),
    }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used within ModalProvider')
  return ctx
}
