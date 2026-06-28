import { describe, expect, it } from "vitest";
import { searchRows } from "../src/lib/search";

const ROWS: string[][] = [
  ["E.OC1", "加速中過電流遮断", "加速中に過電流", "加速時間を長くする"],
  ["E.OC2", "定速中過電流遮断", "定速中に過電流", "負荷の急変をなくす"],
  ["E.OC3", "減速中過電流遮断", "減速中に過電流", "減速時間を長くする"],
  ["OL", "ストール防止(過電流)", "電流制限中", "負荷を軽くする"],
  ["oL", "ストール防止(過電圧)", "減速中断中", "減速時間を長くする"],
  ["61", "オペレーションエラー", "ポイントテーブル見直し", ""],
  ["61", "過電流(MR-CV)", "電源設備", ""],
];

describe("searchRows", () => {
  it("空クエリは全行を返す", () => {
    expect(searchRows(ROWS, "")).toHaveLength(ROWS.length);
  });

  it("完全一致が最優先（大小文字区別 rank=1）", () => {
    const res = searchRows(ROWS, "OL");
    expect(res[0].rank).toBe(1);
    expect(res[0].cells[0]).toBe("OL");
  });

  it("大文字小文字を区別して表示（OL と oL は別カード）", () => {
    // oL を検索したとき OL は完全一致せず前方/部分一致のランクになる
    const resOL = searchRows(ROWS, "OL");
    const resOl = searchRows(ROWS, "oL");
    expect(resOL[0].cells[0]).toBe("OL");
    expect(resOl[0].cells[0]).toBe("oL");
  });

  it("前方一致は rank=3", () => {
    const res = searchRows(ROWS, "E.OC");
    expect(res.every((r) => r.rank === 3)).toBe(true);
    expect(res).toHaveLength(3);
  });

  it("部分一致 rank=4 はコード中間にマッチ", () => {
    const res = searchRows(ROWS, "OC2");
    expect(res[0].cells[0]).toBe("E.OC2");
    expect(res[0].rank).toBe(4);
  });

  it("本文一致 rank=5", () => {
    const res = searchRows(ROWS, "負荷の急変");
    expect(res).toHaveLength(1);
    expect(res[0].rank).toBe(5);
    expect(res[0].cells[0]).toBe("E.OC2");
  });

  it("コード重複（61）は2件とも返る", () => {
    const res = searchRows(ROWS, "61");
    expect(res).toHaveLength(2);
    expect(res.every((r) => r.cells[0] === "61")).toBe(true);
  });

  it("一致なしは空配列", () => {
    expect(searchRows(ROWS, "XXXXXXXX")).toHaveLength(0);
  });

  it("完全一致 > 前方一致 > 部分一致 の順", () => {
    const rows: string[][] = [
      ["ABC1", "内容", "処置"],
      ["ABC", "内容", "処置"],
      ["XABC", "内容", "処置"],
    ];
    const res = searchRows(rows, "ABC");
    expect(res[0].cells[0]).toBe("ABC");   // 完全一致
    expect(res[1].cells[0]).toBe("ABC1");  // 前方一致
    expect(res[2].cells[0]).toBe("XABC"); // 部分一致
  });

  it("クエリが空白のみは全行を返す", () => {
    expect(searchRows(ROWS, "   ")).toHaveLength(ROWS.length);
  });
});
