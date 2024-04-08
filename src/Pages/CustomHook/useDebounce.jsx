import { useEffect, useRef } from "react";

export default function useDebounce(callback, delay) {
  const timeoutIdRef = useRef(null);

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
