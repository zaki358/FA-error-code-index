# -*- mode: python ; coding: utf-8 -*-
"""PyInstaller spec — エラーコード検索アプリ。

生成コマンド:
    pyinstaller error-code-viewer.spec --noconfirm

出力: dist/error-code-viewer.exe
"""
import sys
from pathlib import Path

ROOT = Path(SPECPATH)
BACKEND = ROOT / "backend"
STATIC = BACKEND / "static"

a = Analysis(
    [str(BACKEND / "main.py")],
    pathex=[str(BACKEND)],
    binaries=[],
    datas=[
        (str(STATIC), "static"),
    ],
    hiddenimports=[
        # uvicorn が動的に import するもの
        "uvicorn.loops",
        "uvicorn.loops.auto",
        "uvicorn.loops.asyncio",
        "uvicorn.protocols",
        "uvicorn.protocols.http",
        "uvicorn.protocols.http.auto",
        "uvicorn.protocols.http.h11_impl",
        "uvicorn.protocols.websockets",
        "uvicorn.protocols.websockets.auto",
        "uvicorn.lifespan",
        "uvicorn.lifespan.on",
        "anyio",
        "anyio._backends._asyncio",
        "anyio.abc",
        # starlette / fastapi
        "starlette.routing",
        "starlette.responses",
        "starlette.staticfiles",
        "email.mime.multipart",
        # csv / pathlib は標準ライブラリだが念のため
        "csv",
        "pathlib",
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name="error-code-viewer",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,       # コンソールウィンドウを表示（エラー確認のため）
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=None,
)
