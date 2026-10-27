"use client"

import {useEffect, useRef, useState} from "react";
import {usePathname} from "next/navigation";

const TRICKLE_INTERVAL = 200;
const DONE_DELAY = 300;
// A link the router did not follow (e.g. an error) must not leave the bar hanging
const GIVE_UP_AFTER = 15_000;

function isNavigationClick(event: MouseEvent): boolean {
  if (event.button != 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    return false;

  const anchor = (event.target as Element | null)?.closest?.("a[href]");

  if (!(anchor instanceof HTMLAnchorElement) || anchor.target == "_blank" || anchor.hasAttribute("download"))
    return false;

  const url = new URL(anchor.href, window.location.href);

  // Only a new path: the bar finishes on a pathname change, and query-only links don't change it
  return url.origin == window.location.origin && !url.pathname.startsWith("/api/") && url.pathname != window.location.pathname;
}

// Progress of a client navigation from 0 to 1, or null when none is running
export function useNavigationProgress(): number | null {
  const [progress, setProgress] = useState<number | null>(null);
  const pathname = usePathname();
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearInterval(timer));
    timers.current = [];
  }

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!isNavigationClick(event))
        return;

      clearTimers();
      setProgress(0.08);

      timers.current.push(
        window.setInterval(() => setProgress((value) => value == null ? value : value + (0.9 - value) * 0.1), TRICKLE_INTERVAL),
        window.setTimeout(() => {
          clearTimers();
          setProgress(null);
        }, GIVE_UP_AFTER)
      );
    }

    // Capture: next/link calls preventDefault in its own handler, which would run first
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimers();
    }
  }, []);

  useEffect(() => {
    if (timers.current.length == 0)
      return;

    clearTimers();
    setProgress(1);
    timers.current.push(window.setTimeout(() => setProgress(null), DONE_DELAY));
  }, [pathname]);

  return progress;
}
