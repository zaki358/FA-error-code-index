import React from "react";
import { Badge } from "./primitives/Badge";
import type { SearchResult } from "../lib/search";

interface ResultCardProps {
  columns: string[];
  result: SearchResult;
}

/** 列名が「処置」かどうか判定（ダークパネルで強調表示する） */
function isTreatmentColumn(colName: string): boolean {
  return colName.includes("処置") || colName.includes("対処") || colName.includes("対応");
}

/** 列名が「エラー内容」かどうか（セリフ見出しで表示する） */
function isErrorNameColumn(colName: string): boolean {
  return colName.includes("エラー内容") || colName.includes("アラーム内容");
}

export function ResultCard({ columns, result }: ResultCardProps): React.ReactElement {
  const { cells } = result;
  const code = cells[0] ?? "";

  return (
    <article
      data-testid="result-card"
      style={{
        borderRadius: "var(--rounded-lg)",
        border: "1px solid var(--color-hairline)",
        overflow: "hidden",
        background: "var(--color-canvas)",
      }}
    >
      {/* ヘッダ: コード badge */}
      <div
        style={{
          padding: "var(--space-lg) var(--space-xl)",
          borderBottom: "1px solid var(--color-hairline-soft)",
        }}
      >
        <Badge variant="coral">{code}</Badge>
      </div>

      {/* 各列のコンテンツ */}
      {columns.slice(1).map((col, idx) => {
        const value = cells[idx + 1] ?? "";
        if (!value.trim()) return null;

        const isTreatment = isTreatmentColumn(col);
        const isErrorName = isErrorNameColumn(col);

        if (isTreatment) {
          return (
            <div
              key={col}
              style={{
                background: "var(--color-surface-dark)",
                padding: "var(--space-lg) var(--space-xl)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "var(--color-on-dark-soft)",
                  fontFamily: "var(--font-sans)",
                  marginBottom: "var(--space-sm)",
                }}
              >
                {col}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: "var(--color-on-dark)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {value}
              </p>
            </div>
          );
        }

        if (isErrorName) {
          return (
            <div
              key={col}
              style={{
                padding: "var(--space-lg) var(--space-xl)",
                borderBottom: "1px solid var(--color-hairline-soft)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "22px",
                  fontWeight: 400,
                  lineHeight: 1.3,
                  letterSpacing: "-0.2px",
                  color: "var(--color-ink)",
                }}
              >
                {value}
              </p>
            </div>
          );
        }

        return (
          <div
            key={col}
            style={{
              padding: "var(--space-md) var(--space-xl)",
              borderBottom: "1px solid var(--color-hairline-soft)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "var(--color-muted)",
                fontFamily: "var(--font-sans)",
                marginBottom: "4px",
              }}
            >
              {col}
            </div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "15px",
                fontWeight: 400,
                lineHeight: 1.55,
                color: "var(--color-body)",
              }}
            >
              {value}
            </p>
          </div>
        );
      })}
    </article>
  );
}
