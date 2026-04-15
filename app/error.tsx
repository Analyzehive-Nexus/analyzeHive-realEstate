"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 text-center">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Something went wrong!</h2>
      <p className="text-slate-500 max-w-md">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
