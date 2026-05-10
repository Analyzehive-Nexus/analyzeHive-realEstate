"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface MobileSidebarSheetProps {
  children: React.ReactNode;
}

export function MobileSidebarSheet({ children }: MobileSidebarSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[260px] p-0">
          {children}
        </SheetContent>
      </Sheet>
    </>
  );
}
