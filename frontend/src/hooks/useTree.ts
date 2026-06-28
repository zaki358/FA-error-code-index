import { useCallback, useEffect, useState } from "react";
import { fetchTree } from "../api/client";
import type { Manufacturer, TreeResponse } from "../types";

interface UseTreeState {
  manufacturers: Manufacturer[];
  dataDir: string;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useTree(): UseTreeState {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [dataDir, setDataDir] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchTree()
      .then((data: TreeResponse) => {
        if (cancelled) return;
        setManufacturers(data.manufacturers);
        setDataDir(data.data_dir);
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
  }, [tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { manufacturers, dataDir, loading, error, reload };
}
