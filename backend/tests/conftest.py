"""pytest 共通設定。

- backend/ を import パスに追加（main.py 等が絶対importのため）
- config.json をテンポラリへ書くよう環境変数を設定（backend/ を汚さない）
"""
import os
import sys
import tempfile
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

# テスト中の config.json は一時ディレクトリへ
os.environ.setdefault("ERRORCODE_CONFIG_DIR", tempfile.mkdtemp(prefix="ecv-cfg-"))
