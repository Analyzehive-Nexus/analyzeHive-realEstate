import * as React from "react"
import { cn } from "@/lib/utils"

// A simplified generic dialog component for Analyzehive flow using an overlay approach
// Since we don't have radix-ui available, this is a basic state-driven dialog.

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  // If no state provided, fallback to uncontrolled
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = open !== undefined ? open : internalOpen

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={() => {
          setInternalOpen(false)
          if (onOpenChange) onOpenChange(false)
        }}
      />
      <div className="relative z-50 w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-lg sm:rounded-xl dark:border-slate-800 dark:bg-slate-950">
        {children}
      </div>
    </div>
  )
}

export function DialogTrigger({ asChild, onClick, children }: { asChild?: boolean, onClick?: () => void, children: React.ReactNode }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, { onClick })
  }
  return <div onClick={onClick}>{children}</div>
}

export function DialogContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("grid gap-4", className)}>{children}</div>
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-slate-500", className)} {...props} />
}
