import React from "react";

interface EmptyStateProps {
  message: string;
  sub?: string;
}

export function EmptyState({ message, sub }: EmptyStateProps): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-md)",
        padding: "var(--space-xxl)",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "24px",
          fontWeight: 400,
          letterSpacing: "-0.2px",
          color: "var(--color-ink)",
        }}
      >
        {message}
      </p>
      {sub && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            color: "var(--color-muted)",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
