import { cn } from "@/lib/utils";

export function ResponsiveTable({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className={cn("min-w-[640px]", className)}>
        {children}
      </div>
    </div>
  );
}
