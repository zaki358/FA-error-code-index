import React from "react";
import type { Category } from "../types";
import { Tab } from "./primitives/Tab";

interface CategoryTabsProps {
  categories: Category[];
  selected: string;
  onSelect: (name: string) => void;
}

export function CategoryTabs({
  categories,
  selected,
  onSelect,
}: CategoryTabsProps): React.ReactElement {
  return (
    <div
      role="tablist"
      aria-label="カテゴリ選択"
      style={{
        display: "flex",
        gap: "var(--space-xs)",
        flexWrap: "wrap",
        padding: "var(--space-xs) 0",
      }}
    >
      {categories.map((c) => (
        <Tab
          key={c.name}
          label={c.name}
          active={c.name === selected}
          onClick={() => onSelect(c.name)}
        />
      ))}
    </div>
  );
}
