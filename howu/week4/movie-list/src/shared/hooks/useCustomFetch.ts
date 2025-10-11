import { useState, useEffect } from 'react';

interface UseCustomFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseCustomFetchOptions {
  dependencies?: unknown[];
}

/**
 * 커스텀 Fetch 훅
 * @param fetchFn - 데이터를 가져오는 비동기 함수
 * @param options - 의존성 배열 등의 옵션
 * @returns data, loading, error 상태
 */
export function useCustomFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseCustomFetchOptions = {}
): UseCustomFetchResult<T> {
  const { dependencies = [] } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchFn();
        
        if (!isCancelled) {
          setData(result);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function: 컴포넌트 언마운트 시 진행중인 요청 취소
    return () => {
      isCancelled = true;
    };
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}
