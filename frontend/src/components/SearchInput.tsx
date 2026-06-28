import React, { useEffect, useRef } from "react";

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function SearchInput({
  value,
  onChange,
  disabled = false,
  autoFocus = false,
}: SearchInputProps): React.ReactElement {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus();
    }
  }, [autoFocus]);

  return (
    <div style={{ position: "relative" }}>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="エラーコードを入力 (例: E.OC1, 61, OL)"
        style={{
          width: "100%",
          height: "48px",
          padding: "0 var(--space-md)",
          borderRadius: "var(--rounded-md)",
          border: "1px solid var(--color-hairline)",
          background: "var(--color-canvas)",
          color: "var(--color-ink)",
          fontFamily: "var(--font-sans)",
          fontSize: "16px",
          fontWeight: 400,
          outline: "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--color-primary)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(204,120,92,0.15)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--color-hairline)";
          e.currentTarget.style.boxShadow = "none";
        }}
        aria-label="エラーコード検索"
      />
    </div>
  );
}
