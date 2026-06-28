import React from "react";
import { Tab } from "./primitives/Tab";

interface ProductSelectorProps {
  products: string[];
  selected: string;
  onSelect: (name: string) => void;
}

export function ProductSelector({
  products,
  selected,
  onSelect,
}: ProductSelectorProps): React.ReactElement {
  return (
    <div
      role="tablist"
      aria-label="製品選択"
      style={{
        display: "flex",
        gap: "var(--space-xs)",
        flexWrap: "wrap",
        padding: "var(--space-xs) 0",
      }}
    >
      {products.map((p) => (
        <Tab
          key={p}
          label={p}
          active={p === selected}
          onClick={() => onSelect(p)}
        />
      ))}
    </div>
  );
}
