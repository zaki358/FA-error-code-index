/**
 * クライアントサイド即時検索ロジック。
 * 純粋関数のみ — 副作用なし、単体テスト対象。
 *
 * ランク（低いほど優先）:
 *  1 = エラーコード 完全一致（大小文字区別 — OL と oL は別コード）
 *  2 = エラーコード 完全一致（大小文字無視）
 *  3 = エラーコード 前方一致
 *  4 = エラーコード 部分一致
 *  5 = 本文（2列目以降）部分一致
 */

export interface SearchResult {
  cells: string[];
  rank: number;
}

export function searchRows(
  rows: string[][],
  query: string
): SearchResult[] {
  if (!query.trim()) {
    return rows.map((cells) => ({ cells, rank: 0 }));
  }

  const q = query.trim();
  const qLower = q.toLowerCase();
  const results: SearchResult[] = [];

  for (const cells of rows) {
    const code = cells[0] ?? "";
    const codeLower = code.toLowerCase();

    if (code === q) {
      results.push({ cells, rank: 1 });
      continue;
    }
    if (codeLower === qLower) {
      results.push({ cells, rank: 2 });
      continue;
    }
    if (codeLower.startsWith(qLower)) {
      results.push({ cells, rank: 3 });
      continue;
    }
    if (codeLower.includes(qLower)) {
      results.push({ cells, rank: 4 });
      continue;
    }
    const bodyText = cells.slice(1).join(" ").toLowerCase();
    if (bodyText.includes(qLower)) {
      results.push({ cells, rank: 5 });
    }
  }

  results.sort((a, b) => a.rank - b.rank);
  return results;
}
