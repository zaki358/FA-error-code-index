import React from "react";
import type { Manufacturer } from "../types";
import { Tab } from "./primitives/Tab";

interface ManufacturerTabsProps {
  manufacturers: Manufacturer[];
  selected: string;
  onSelect: (name: string) => void;
}

export function ManufacturerTabs({
  manufacturers,
  selected,
  onSelect,
}: ManufacturerTabsProps): React.ReactElement {
  return (
    <div
      role="tablist"
      aria-label="メーカー選択"
      style={{
        display: "flex",
        gap: "var(--space-xs)",
        flexWrap: "wrap",
        padding: "var(--space-sm) 0",
      }}
    >
      {manufacturers.map((m) => (
        <Tab
          key={m.name}
          label={m.name}
          active={m.name === selected}
          onClick={() => onSelect(m.name)}
        />
      ))}
    </div>
  );
}
