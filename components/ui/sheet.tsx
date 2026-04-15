"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = open !== undefined ? open : internalOpen

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="fixed inset-0 bg-black/80 transition-opacity" 
        onClick={() => {
          setInternalOpen(false)
          if (onOpenChange) onOpenChange(false)
        }}
      />
      <div className="relative z-50 h-full w-3/4 gap-4 bg-white p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out sm:max-w-sm dark:bg-slate-950">
        {children}
      </div>
    </div>
  )
}

export function SheetTrigger({ children, onClick, asChild }: { children: React.ReactNode, onClick?: () => void, asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, { onClick })
  }
  return <div onClick={onClick} className="inline-block">{children}</div>
}

export function SheetContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { side?: string }) {
  return <div className={cn("grid gap-4", className)} {...props}>{children}</div>
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
}

export function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold text-slate-950 dark:text-slate-50", className)} {...props} />
}

export function SheetDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-slate-500 dark:text-slate-400", className)} {...props} />
}
