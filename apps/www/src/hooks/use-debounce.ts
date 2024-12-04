import { useCallback } from "react";
import debounce from "lodash.debounce";

// Generic type version that preserves the callback's parameter types
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay = 300
) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  return useCallback(
    debounce((...args: Parameters<T>) => callback(...args), delay),
    [callback, delay]
  );
}
