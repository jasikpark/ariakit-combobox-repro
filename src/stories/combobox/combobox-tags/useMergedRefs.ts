import { useEffect } from "react";
import { useRef } from "react";

/**
 * React hook to combine refs into a RefObject.
 *
 * See: https://itnext.io/reusing-the-ref-from-forwardref-with-react-hooks-4ce9df693dd
 */
export function useMergedRefs<T>(...refs: Array<React.ForwardedRef<T>>) {
  const targetRef = useRef<T>(null);

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}
