import { useState, useEffect, useCallback } from "react";

export function useDataFetching<T>(fetcher: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err: any) {
      // Extract a user-friendly message
      let message = "An unknown error occurred";
      if (err.message) message = err.message;
      // Remove raw SQL/technical details
      message = message.replace(/^error: /i, "").split('\n')[0];
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [fetcher, ...deps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
