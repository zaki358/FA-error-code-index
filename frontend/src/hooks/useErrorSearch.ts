import { useEffect, useState } from "react";
import { fetchErrors } from "../api/client";
import { searchRows } from "../lib/search";
import type { SearchResult } from "../lib/search";

interface UseErrorSearchState {
  columns: string[];
  results: SearchResult[];
  loading: boolean;
  error: string | null;
}

export function useErrorSearch(
  manufacturer: string,
  category: string,
  product: string,
  query: string
): UseErrorSearchState {
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!manufacturer || !category || !product) {
      setColumns([]);
      setRows([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchErrors(manufacturer, category, product)
      .then((data) => {
        if (cancelled) return;
        setColumns(data.columns);
        setRows(data.rows);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [manufacturer, category, product]);

  const results = searchRows(rows, query);
  return { columns, results, loading, error };
}
