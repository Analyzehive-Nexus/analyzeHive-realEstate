"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-slate-950 p-4 text-center text-slate-50">
        <h2 className="text-2xl font-bold">Critical Application Error</h2>
        <p className="text-slate-400 max-w-md">
          {error.message || "A critical error occurred at the root level."}
        </p>
        <button
          onClick={() => reset()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
