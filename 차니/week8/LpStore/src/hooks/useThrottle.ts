import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value: T, interval = 500): T {
  // 1. 상태 변수 : throttledValue : 최종적으로 쓰로틀링 적용된 값
  const [throttledValue, setThrottledValue] = useState<T>(value);

  // 2. 마지막으로 실제로 값이 반영된 시각
  const lastExecutedRef = useRef<number>(Date.now());

  // 3. 예약된 타이머 id (있을 수도 있고, 없을 수도 있음)
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastExecutedRef.current;
    const remaining = interval - elapsed;

    if (remaining <= 0) {
      // interval 이상 지났으면 바로 실행
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      lastExecutedRef.current = now;
      setThrottledValue(value);
    } else {
      // 아직 interval이 안 지났으면 남은 시간만큼만 기다렸다가 실행
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        lastExecutedRef.current = Date.now();
        setThrottledValue(value);
        timeoutRef.current = null;
      }, remaining);
    }

    // value / interval이 바뀌거나 언마운트될 때 타이머 정리
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [value, interval]);

  return throttledValue;
}

export default useThrottle;
