'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { Button } from './button'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
  createdAt: number
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

const TOAST_DURATION = 5000 // 5 seconds

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(7)
    const newToast: Toast = { id, message, type, createdAt: Date.now() }
    
    setToasts((prev) => [...prev, newToast])
    
    // Auto remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, TOAST_DURATION)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 md:right-4 md:left-auto left-4 z-[100] flex flex-col gap-3 w-[calc(100%-2rem)] md:w-auto md:max-w-md">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [progress, setProgress] = useState(100)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    const startTime = Date.now()
    startTimeRef.current = startTime

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / TOAST_DURATION) * 100)
      setProgress(remaining)
    }, 16) // ~60fps

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const getIcon = () => {
    const iconClass = "w-6 h-6"
    switch (toast.type) {
      case 'success':
        return <CheckCircle className={iconClass} />
      case 'error':
        return <AlertCircle className={iconClass} />
      case 'warning':
        return <AlertTriangle className={iconClass} />
      case 'info':
        return <Info className={iconClass} />
    }
  }

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
          border: 'border-green-400',
          text: 'text-white',
          progress: 'bg-white/30'
        }
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-rose-600',
          border: 'border-red-400',
          text: 'text-white',
          progress: 'bg-white/30'
        }
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-500 to-amber-600',
          border: 'border-yellow-400',
          text: 'text-white',
          progress: 'bg-white/30'
        }
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-cyan-600',
          border: 'border-blue-400',
          text: 'text-white',
          progress: 'bg-white/30'
        }
    }
  }

  const styles = getStyles()

  return (
    <div
      className={`relative flex items-start gap-3 p-4 md:p-5 rounded-xl border-2 shadow-2xl backdrop-blur-sm overflow-hidden transition-all duration-300 md:animate-slideInRight animate-slideInTop ${styles.bg} ${styles.border} ${styles.text}`}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-black/10">
        <div
          className={`h-full transition-all duration-75 ${styles.progress}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

      {/* Message */}
      <div className="flex-1 text-sm md:text-base font-semibold leading-relaxed pr-2">
        {toast.message}
      </div>

      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 flex-shrink-0 hover:bg-white/20 text-white rounded-lg"
        onClick={() => onRemove(toast.id)}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

