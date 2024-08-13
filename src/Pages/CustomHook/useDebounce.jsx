import { useEffect } from "react";

export default function useDebounce(callback, delay, timeoutIdRef) {
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  const actualDebounceFn = (...args) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return actualDebounceFn;
}
