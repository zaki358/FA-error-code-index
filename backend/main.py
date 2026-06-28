"""エラーコード検索アプリ — FastAPI バックエンド。

- ``127.0.0.1`` のみで待ち受け（オフライン・外部に公開しない＝セキュリティ要件）
- ``/api/*`` がデータ API、``/`` 以下はビルド済み React (static) を配信
- 単一プロセスで API + 画面の両方を提供する
"""
from __future__ import annotations

import socket
import sys
import threading
import webbrowser
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse
from pydantic import BaseModel

import config as config_mod
import csv_loader

HOST = "127.0.0.1"
DEFAULT_PORT = 8000


def static_dir() -> Path:
    """ビルド済みフロントエンド(static)の場所を返す。

    PyInstaller 凍結時は ``sys._MEIPASS`` に展開される。
    """
    meipass = getattr(sys, "_MEIPASS", None)
    if meipass:
        return Path(meipass) / "static"
    return Path(__file__).resolve().parent / "static"


app = FastAPI(title="エラーコード検索", docs_url=None, redoc_url=None)


# ---------------------------------------------------------------------------
# API
# ---------------------------------------------------------------------------
class ConfigBody(BaseModel):
    data_dir: str


@app.get("/api/config")
def get_config() -> dict:
    return config_mod.load_config()


@app.post("/api/config")
def set_config(body: ConfigBody) -> dict:
    data_dir = body.data_dir.strip()
    if not data_dir:
        raise HTTPException(status_code=422, detail="データディレクトリが空です。")
    path = Path(data_dir)
    if not path.is_dir():
        raise HTTPException(
            status_code=422, detail=f"ディレクトリが存在しません: {data_dir}"
        )
    return config_mod.save_config(str(path))


@app.get("/api/tree")
def get_tree() -> dict:
    cfg = config_mod.load_config()
    return {
        "data_dir": cfg["data_dir"],
        "manufacturers": csv_loader.scan_tree(cfg["data_dir"]),
    }


@app.get("/api/errors")
def get_errors(
    manufacturer: str = Query(...),
    category: str = Query(...),
    product: str = Query(...),
) -> dict:
    cfg = config_mod.load_config()
    try:
        return csv_loader.read_product(
            cfg["data_dir"], manufacturer, category, product
        )
    except ValueError:
        raise HTTPException(status_code=422, detail="不正なパス指定です。")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="CSV が見つかりません。")


# ---------------------------------------------------------------------------
# 静的配信（ビルド済みフロントエンド）+ SPA フォールバック
# ---------------------------------------------------------------------------
_STATIC = static_dir()
if _STATIC.is_dir():
    _STATIC_RESOLVED = _STATIC.resolve()

    @app.get("/")
    def index() -> FileResponse:
        return FileResponse(_STATIC / "index.html")

    @app.get("/{full_path:path}")
    def spa(full_path: str) -> FileResponse:
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not Found")
        try:
            target = (_STATIC / full_path).resolve()
            if target.is_file() and target.is_relative_to(_STATIC_RESOLVED):
                return FileResponse(target)
        except (OSError, ValueError):
            pass
        # 不明なパスは index.html へ（クライアントサイドルーティング用）
        return FileResponse(_STATIC / "index.html")


# ---------------------------------------------------------------------------
# 起動
# ---------------------------------------------------------------------------
def _find_free_port(start: int, host: str) -> int:
    for port in range(start, start + 50):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            try:
                sock.bind((host, port))
                return port
            except OSError:
                continue
    return start


def main() -> None:
    import uvicorn

    port = _find_free_port(DEFAULT_PORT, HOST)
    url = f"http://{HOST}:{port}"
    print(f"エラーコード検索を起動します: {url}")
    # 少し待ってからブラウザを開く（サーバ起動を待つ）
    threading.Timer(1.2, lambda: webbrowser.open(url)).start()
    uvicorn.run(app, host=HOST, port=port, log_level="info")


if __name__ == "__main__":
    main()
