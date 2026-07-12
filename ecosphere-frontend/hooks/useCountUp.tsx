'use client';

// hooks/useCountUp.tsx
// ============================================================
// Animated count-up hook using requestAnimationFrame
// ============================================================
import { useState, useEffect, useRef } from 'react';

// Ease-out cubic
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp(
  target: number,
  {
    duration = 1200,
    decimals = 0,
    enabled = true,
    delay = 0,
  }: {
    duration?: number;
    decimals?: number;
    enabled?: boolean;
    delay?: number;
  } = {}
): number {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const startAnimation = () => {
      startTime.current = null;

      const animate = (timestamp: number) => {
        if (startTime.current === null) startTime.current = timestamp;
        const elapsed = timestamp - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        setValue(parseFloat((target * eased).toFixed(decimals)));

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setValue(target);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    };

    const timer = delay > 0 ? setTimeout(startAnimation, delay) : (startAnimation(), undefined);

    return () => {
      if (timer) clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, decimals, enabled, delay]);

  return value;
}
