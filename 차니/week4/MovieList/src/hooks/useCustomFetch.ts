import { useEffect, useMemo, useState } from "react";
import { tmdbAPI } from "../api/api";
import type { AxiosRequestConfig } from "axios";

export function useCustomFetch<T>(
  url: string | null,
  params?: AxiosRequestConfig["params"],
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  const paramsKey = useMemo(() => JSON.stringify(params ?? {}), [params]);

  useEffect(() => {
    if (!url) return;

    (async () => {
      setIsPending(true);
      setIsError(false);
      try {
        const { data } = await tmdbAPI.get<T>(url, { params });
        setData(data);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    })();
  }, [url, paramsKey, ...deps]);

  return { data, isPending, isError };
}
