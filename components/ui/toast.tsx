"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ToastProps = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

// A simple toast system
type ToastContextType = {
  toasts: ToastProps[]
  toast: (props: Omit<ToastProps, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback((props: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...props, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <Toaster toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within ToastProvider")
  // Provide shadcn-like API
  return { toast: context.toast, dismiss: context.dismiss }
}

function Toaster({ toasts, dismiss }: { toasts: ToastProps[], dismiss: (id: string) => void }) {
  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map(function ({ id, title, description, variant }) {
        return (
          <div
            key={id}
            className={cn(
              "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all mb-2",
              variant === "destructive" ? "destructive group border-red-500 bg-red-500 text-slate-50" : "border-slate-200 bg-white text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50"
            )}
          >
            <div className="grid gap-1">
              {title && <div className="text-sm font-semibold">{title}</div>}
              {description && <div className="text-sm opacity-90">{description}</div>}
            </div>
            <button
              onClick={() => dismiss(id)}
              className="absolute right-2 top-2 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
            >
              x
            </button>
          </div>
        )
      })}
    </div>
  )
}
