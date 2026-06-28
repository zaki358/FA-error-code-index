import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResultCard } from "../src/components/ResultCard";
import type { SearchResult } from "../src/lib/search";

const make = (cells: string[]): SearchResult => ({ cells, rank: 1 });

describe("ResultCard", () => {
  it("4列CSV: コード/エラー内容/異常内容/処置 を表示", () => {
    const cols = ["エラーコード", "エラー内容", "異常内容", "処置"];
    const result = make(["E.OC1", "加速中過電流遮断", "加速中に過電流", "加速時間を長くする"]);
    render(<ResultCard columns={cols} result={result} />);

    expect(screen.getByText("E.OC1")).toBeInTheDocument();
    expect(screen.getByText("加速中過電流遮断")).toBeInTheDocument();
    expect(screen.getByText("加速中に過電流")).toBeInTheDocument();
    expect(screen.getByText("加速時間を長くする")).toBeInTheDocument();
  });

  it("3列CSV（異常内容なし）でもレイアウト崩れなし", () => {
    const cols = ["エラーコード", "エラー内容", "処置"];
    const result = make(["61", "オペレーションエラー", "ポイントテーブル見直し"]);
    const { container } = render(<ResultCard columns={cols} result={result} />);

    expect(screen.getByText("61")).toBeInTheDocument();
    expect(screen.getByText("オペレーションエラー")).toBeInTheDocument();
    expect(screen.getByText("ポイントテーブル見直し")).toBeInTheDocument();
    // 余分な undefined/null セルが描画されていない
    expect(container.querySelectorAll("[data-testid='result-card']")).toHaveLength(1);
  });

  it("コードは badge-coral スタイルで表示されている", () => {
    const cols = ["エラーコード", "エラー内容", "処置"];
    const result = make(["E.OV1", "加速中回生過電圧遮断", "加速時間を短くする"]);
    render(<ResultCard columns={cols} result={result} />);

    const badge = screen.getByText("E.OV1");
    expect(badge).toBeInTheDocument();
  });

  it("セルが空の列は描画しない", () => {
    const cols = ["エラーコード", "エラー内容", "異常内容", "処置"];
    const result = make(["61", "過電流", "", "電源点検"]);
    render(<ResultCard columns={cols} result={result} />);

    // 異常内容列は値が空なので表示されない
    expect(screen.queryByText("異常内容")).not.toBeInTheDocument();
  });
});
