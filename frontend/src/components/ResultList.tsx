import React from "react";
import type { SearchResult } from "../lib/search";
import { ResultCard } from "./ResultCard";

interface ResultListProps {
  columns: string[];
  results: SearchResult[];
  query: string;
  loading: boolean;
  error: string | null;
}

export function ResultList({
  columns,
  results,
  query,
  loading,
  error,
}: ResultListProps): React.ReactElement {
  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "var(--space-xxl)",
          color: "var(--color-muted)",
          fontFamily: "var(--font-sans)",
        }}
      >
        読み込み中…
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "var(--space-lg) var(--space-xl)",
          borderRadius: "var(--rounded-lg)",
          background: "var(--color-surface-card)",
          color: "var(--color-error)",
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
        }}
      >
        エラー: {error}
      </div>
    );
  }

  if (results.length === 0 && query.trim()) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "var(--space-xxl)",
          color: "var(--color-muted)",
          fontFamily: "var(--font-sans)",
        }}
      >
        「{query}」に一致するエラーコードが見つかりませんでした。
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-lg)",
      }}
    >
      {results.map((r, i) => (
        <ResultCard key={`${r.cells[0]}-${i}`} columns={columns} result={r} />
      ))}
    </div>
  );
}
