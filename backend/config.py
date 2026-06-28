"""アプリ設定の読み書き（data_dir の管理）。

設定ファイル `config.json` は **書き込み可能な場所** に置く:
- PyInstaller で凍結(.exe)時 → 実行ファイルと同じフォルダ
- 通常実行時 → この backend/ ディレクトリ

環境変数で上書き可能:
- ``ERRORCODE_CONFIG_DIR`` … config.json を置くディレクトリ（テスト/起動スクリプト用）
- ``ERRORCODE_DATA_DIR``   … 既定の data_dir
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

DEFAULT_DATA_DIR = os.environ.get(
    "ERRORCODE_DATA_DIR", r"C:\Users\barub\Document\エラーコード"
)
CONFIG_FILENAME = "config.json"


def _app_dir() -> Path:
    """設定ファイルを置く、書き込み可能なディレクトリを返す。"""
    override = os.environ.get("ERRORCODE_CONFIG_DIR")
    if override:
        return Path(override)
    if getattr(sys, "frozen", False):
        # PyInstaller: 実行ファイルと同じ場所（_MEIPASS は読取専用なので使わない）
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parent


def config_path() -> Path:
    return _app_dir() / CONFIG_FILENAME


def load_config() -> dict:
    """現在の設定を返す。無ければ既定値で生成して返す。"""
    path = config_path()
    if path.exists():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(data, dict) and isinstance(data.get("data_dir"), str):
                return {"data_dir": data["data_dir"]}
        except (json.JSONDecodeError, OSError):
            pass
    return save_config(DEFAULT_DATA_DIR)


def save_config(data_dir: str) -> dict:
    """data_dir を保存して、保存後の設定を返す。"""
    cfg = {"data_dir": data_dir}
    path = config_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(cfg, ensure_ascii=False, indent=2), encoding="utf-8")
    return cfg
