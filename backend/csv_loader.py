"""ディレクトリツリーの走査と CSV の解析。

データ階層: ``<data_dir>/<メーカー>/<カテゴリ>/<製品名>.csv``

設計上の要点（実データ調査で判明）:
- 第1列を「エラーコード」（検索キー）とみなす
- 列構成はファイルごとに異なってよい（**列非依存**）。A800=4列, J4=3列 など
- エラーコードはファイル内で一意でない（重複行はそのまま全て保持）
- 文字コードは ``utf-8-sig`` → ``cp932`` の順でフォールバック（Excel 由来の Shift-JIS 対応）
"""
from __future__ import annotations

import csv
import io
from pathlib import Path

from security import is_safe_name, safe_join

_ENCODINGS = ("utf-8-sig", "cp932")


def _decode(raw: bytes) -> str:
    for enc in _ENCODINGS:
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    # 最後の手段: 置換しながら読む（壊れた文字があっても落とさない）
    return raw.decode("utf-8", errors="replace")


def scan_tree(data_dir: str | Path) -> list[dict]:
    """data_dir 配下を走査し、メーカー→カテゴリ→製品 の階層を返す。

    返り値: ``[{"name": メーカー, "categories": [{"name": カテゴリ,
             "products": [製品名...]}]}]``
    CSV を1つも含まないカテゴリ/メーカーは除外する。
    """
    base = Path(data_dir)
    if not base.is_dir():
        return []

    manufacturers: list[dict] = []
    for maker in sorted(base.iterdir(), key=lambda p: p.name):
        if not maker.is_dir() or not is_safe_name(maker.name):
            continue
        categories: list[dict] = []
        for cat in sorted(maker.iterdir(), key=lambda p: p.name):
            if not cat.is_dir() or not is_safe_name(cat.name):
                continue
            products = [
                f.stem
                for f in sorted(cat.iterdir(), key=lambda p: p.name)
                if f.is_file()
                and f.suffix.lower() == ".csv"
                and is_safe_name(f.name)
            ]
            if products:
                categories.append({"name": cat.name, "products": products})
        if categories:
            manufacturers.append({"name": maker.name, "categories": categories})
    return manufacturers


def read_product(
    data_dir: str | Path, manufacturer: str, category: str, product: str
) -> dict:
    """指定製品の CSV を解析し ``{"columns": [...], "rows": [[...], ...]}`` を返す。

    - 第1列=エラーコード。列はファイルごとに可変。
    - 空行は除去。重複コードはそのまま保持。
    """
    for part in (manufacturer, category, product):
        if not is_safe_name(part):
            raise ValueError(f"unsafe component: {part!r}")

    path = safe_join(Path(data_dir), manufacturer, category, f"{product}.csv")
    if not path.is_file():
        raise FileNotFoundError(str(path))

    text = _decode(path.read_bytes())
    reader = csv.reader(io.StringIO(text))
    rows = [r for r in reader if any(cell.strip() for cell in r)]  # 空行を除去
    if not rows:
        return {"columns": [], "rows": []}

    columns = [c.strip() for c in rows[0]]
    data_rows = [[cell for cell in r] for r in rows[1:]]
    return {"columns": columns, "rows": data_rows}
