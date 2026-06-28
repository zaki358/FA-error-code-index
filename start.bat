@echo off
chcp 65001 > nul
echo === エラーコード検索アプリ 起動 ===

if not exist ".venv" (
    echo セットアップが完了していません。先に setup.bat を実行してください。
    pause
    exit /b 1
)

if not exist "backend\static\index.html" (
    echo フロントエンドのビルドが見つかりません。setup.bat を先に実行してください。
    pause
    exit /b 1
)

echo http://127.0.0.1:8000 でサーバーを起動します...
cd backend
..\\.venv\Scripts\python main.py
cd ..
