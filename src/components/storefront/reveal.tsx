"use client";

import { useEffect, useRef } from "react";

/**
 * Fades content up as it scrolls into view.
 *
 * Progressive enhancement: the server markup is fully visible. After mount,
 * elements still below the viewport get the hidden state and an
 * IntersectionObserver reveals them once — anything already on screen (or
 * any no-JS visitor) never sees a flash of hidden content.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Stagger offset in ms, applied to the reveal transition. */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Only animate elements that haven't been scrolled to yet.
    if (el.getBoundingClientRect().top >= window.innerHeight) {
      el.classList.add("reveal-hidden");
    } else {
      return;
    }

    function show(animated: boolean) {
      el!.style.transitionDelay = animated && delay ? `${delay}ms` : "";
      el!.classList.add("reveal-visible");
      el!.classList.remove("reveal-hidden");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(true);
          observer.disconnect();
          clearTimeout(failsafe);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);

    // Failsafe: if the observer never fires (throttled/background renderer,
    // exotic embedder), content must still become visible eventually.
    const failsafe = window.setTimeout(() => {
      if (el.classList.contains("reveal-hidden")) {
        show(false);
        observer.disconnect();
      }
    }, 4000);

    return () => {
      observer.disconnect();
      clearTimeout(failsafe);
    };
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
