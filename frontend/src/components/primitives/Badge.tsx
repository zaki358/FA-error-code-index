import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "coral" | "pill";
}

export function Badge({ children, variant = "pill" }: BadgeProps): React.ReactElement {
  const isCoral = variant === "coral";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 12px",
        borderRadius: "var(--rounded-pill)",
        background: isCoral ? "var(--color-primary)" : "var(--color-surface-card)",
        color: isCoral ? "var(--color-on-primary)" : "var(--color-ink)",
        fontFamily: "var(--font-sans)",
        fontSize: isCoral ? "12px" : "13px",
        fontWeight: 500,
        lineHeight: 1.4,
        letterSpacing: isCoral ? "1.5px" : "0",
        textTransform: isCoral ? "uppercase" : "none",
      }}
    >
      {children}
    </span>
  );
}
