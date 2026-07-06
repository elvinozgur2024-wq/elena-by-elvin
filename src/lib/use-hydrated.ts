import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

// SSR-safe hydration flag: returns false on the server and during the first
// client render (matching SSR output), then true afterward. Avoids the
// setState-in-effect pattern that trips the React Compiler's lint rule.
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
