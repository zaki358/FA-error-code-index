import React from "react";

interface TabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function Tab({ label, active, onClick }: TabProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: "8px 14px",
        borderRadius: "var(--rounded-md)",
        background: active ? "var(--color-surface-card)" : "transparent",
        color: active ? "var(--color-ink)" : "var(--color-muted)",
        fontFamily: "var(--font-sans)",
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: 1.4,
        border: "none",
        cursor: "pointer",
        transition: "background 0.15s, color 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
