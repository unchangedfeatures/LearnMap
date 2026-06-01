"use client";

import { useEffect, useState } from "react";

function MaterialSymbol({ name, filled }: { name: string; filled?: boolean }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

export default function GuideLayoutClient({
  children,
}: {
  children: (args: { showRightRail: boolean; toggleRightRail: () => void }) => React.ReactNode;
}) {
  const [showRightRail, setShowRightRail] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("learnmap:guide:rightRail");
      if (raw === "hide") setShowRightRail(false);
    } catch {
      // ignore
    }
  }, []);

  function toggleRightRail() {
    setShowRightRail((v) => {
      const next = !v;
      try {
        window.localStorage.setItem("learnmap:guide:rightRail", next ? "show" : "hide");
      } catch {
        // ignore
      }
      return next;
    });
  }

  return (
    <div>
      {children({
        showRightRail,
        toggleRightRail,
      })}

      {/* lightweight hint (optional future): could be removed later */}
      {!showRightRail ? (
        <div className="fixed bottom-6 right-6 hidden lg:block">
          <button
            type="button"
            onClick={toggleRightRail}
            className="h-12 rounded-full bg-white border border-[color:var(--outline-variant)]/30 px-4 shadow-[0_10px_30px_rgba(0,0,0,0.12)] text-sm font-semibold text-[color:var(--on-surface)] inline-flex items-center gap-2"
          >
            <span className="text-[20px] text-[color:var(--muted-foreground)]" aria-hidden>
              <MaterialSymbol name="menu_open" />
            </span>
            Show resources
          </button>
        </div>
      ) : null}
    </div>
  );
}
