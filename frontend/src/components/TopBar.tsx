import React from "react";

interface TopBarProps {
  dataDir: string;
  onChangeFolder: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function TopBar({ dataDir, onChangeFolder, theme, onToggleTheme }: TopBarProps): React.ReactElement {
  return (
    <header
      style={{
        height: "64px",
        backgroundColor: "var(--color-canvas)",
        borderBottom: "1px solid var(--color-hairline)",
        display: "flex",
        alignItems: "center",
        padding: "0 var(--space-xl)",
        gap: "var(--space-md)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* スパイクマーク + タイトル */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <line x1="8" y1="0" x2="8" y2="16" stroke="var(--color-ink)" strokeWidth="2" />
          <line x1="0" y1="8" x2="16" y2="8" stroke="var(--color-ink)" strokeWidth="2" />
          <line x1="2.34" y1="2.34" x2="13.66" y2="13.66" stroke="var(--color-ink)" strokeWidth="1.5" />
          <line x1="13.66" y1="2.34" x2="2.34" y2="13.66" stroke="var(--color-ink)" strokeWidth="1.5" />
        </svg>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--color-ink)",
            letterSpacing: "0",
          }}
        >
          エラーコード検索
        </span>
      </div>

      {/* スペーサー */}
      <div style={{ flex: 1 }} />

      {/* データフォルダ表示 */}
      {dataDir && (
        <span
          style={{
            fontSize: "12px",
            color: "var(--color-muted)",
            fontFamily: "var(--font-mono)",
            maxWidth: "360px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={dataDir}
        >
          {dataDir}
        </span>
      )}

      {/* テーマ切り替えボタン */}
      <button
        onClick={onToggleTheme}
        title={theme === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え"}
        aria-label={theme === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え"}
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "var(--rounded-full)",
          background: "var(--color-surface-card)",
          border: "1px solid var(--color-hairline)",
          color: "var(--color-ink)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          flexShrink: 0,
        }}
      >
        {theme === "dark" ? "☀" : "🌙"}
      </button>

      <button
        onClick={onChangeFolder}
        style={{
          padding: "8px 16px",
          borderRadius: "var(--rounded-md)",
          background: "var(--color-canvas)",
          border: "1px solid var(--color-hairline)",
          color: "var(--color-ink)",
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
          fontWeight: 500,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        フォルダ変更
      </button>
    </header>
  );
}
