"""パス安全性の検証（ディレクトリトラバーサル対策）。

ユーザー入力（メーカー/カテゴリ/製品名）を使ってファイルパスを組み立てる前に、
必ずここを通して data_dir の外に出ないことを保証する。
"""
from __future__ import annotations

from pathlib import Path

_FORBIDDEN = {"", ".", ".."}


def is_safe_name(name: str) -> bool:
    """単一のパス構成要素として安全か。

    区切り文字 (``/`` ``\\``)、``.`` / ``..``、NUL を含むものは拒否する。
    """
    if not isinstance(name, str):
        return False
    if name in _FORBIDDEN:
        return False
    if "/" in name or "\\" in name:
        return False
    if "\x00" in name:
        return False
    return True


def safe_join(base: Path, *parts: str) -> Path:
    """base 配下に限定して安全に結合する。逸脱したら ValueError。"""
    base_resolved = Path(base).resolve()
    for part in parts:
        if not is_safe_name(part):
            raise ValueError(f"unsafe path component: {part!r}")
    candidate = base_resolved.joinpath(*parts).resolve()
    if candidate != base_resolved and not candidate.is_relative_to(base_resolved):
        raise ValueError("path escapes base directory")
    return candidate
