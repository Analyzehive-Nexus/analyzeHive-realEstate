import * as React from "react"
import { cn } from "@/lib/utils"

export function Sidebar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pb-12 border-r bg-white dark:bg-slate-950 w-64 h-screen fixed inset-y-0 left-0 z-20 flex flex-col", className)}>
      <div className="space-y-4 py-4 h-full flex flex-col">
        {children}
      </div>
    </div>
  )
}

export function SidebarHeader({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-3 py-2", className)}>{children}</div>
}

export function SidebarContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 px-3 py-2 overflow-auto", className)}>{children}</div>
}

export function SidebarGroup({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("py-2", className)}>{children}</div>
}

export function SidebarGroupLabel({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 text-xs font-semibold tracking-tight text-slate-500", className)}>{children}</div>
}

export function SidebarGroupContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("w-full", className)}>{children}</div>
}

export function SidebarMenu({ className, children }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("flex w-full min-w-0 flex-col gap-1", className)}>{children}</ul>
}

export function SidebarMenuItem({ className, children }: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("relative", className)}>{children}</li>
}

export function SidebarMenuButton({ className, children, isActive, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-slate-950 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 active:bg-slate-100 active:text-slate-900 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:ring-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:active:bg-slate-800 dark:active:text-slate-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        isActive && "bg-slate-100 font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
