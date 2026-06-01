"use client";

import { useEffect, useState } from "react";

function clamp01(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export default function ScrollProgressBar({
  containerId,
}: {
  containerId: string;
}) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = document.getElementById(containerId);
    if (!el) return;

    function onScroll() {
      const node = document.getElementById(containerId);
      if (!node) return;
      const max = node.scrollHeight - node.clientHeight;
      const v = max <= 0 ? 0 : node.scrollTop / max;
      setPct(clamp01(v));
    }

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true } as any);
    window.addEventListener("resize", onScroll);

    return () => {
      el.removeEventListener("scroll", onScroll as any);
      window.removeEventListener("resize", onScroll);
    };
  }, [containerId]);

  return (
    <div className="sticky top-20 z-10 h-1 bg-[color:var(--surface-container-high)]">
      <div
        className="h-full bg-[color:var(--primary)] shadow-[0_0_12px_rgba(35,70,213,0.35)] transition-[width] duration-150"
        style={{ width: `${Math.round(pct * 100)}%` }}
      />
    </div>
  );
}
