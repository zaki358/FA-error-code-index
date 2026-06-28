@echo off
chcp 65001 > nul
echo === エラーコード検索アプリ セットアップ ===

REM --- Python 仮想環境 ---
if not exist ".venv" (
    echo [1/4] Python 仮想環境を作成中...
    py -m venv .venv
    if errorlevel 1 (
        echo エラー: Python が見つかりません。Python 3.10 以上をインストールしてください。
        pause
        exit /b 1
    )
)

echo [2/4] Python パッケージをインストール中...
call .venv\Scripts\pip install -r backend\requirements.txt --quiet
if errorlevel 1 (
    echo エラー: pip install に失敗しました。
    pause
    exit /b 1
)

REM --- Node.js / フロントエンド ---
echo [3/4] Node パッケージをインストール中...
cd frontend
call npm install --silent
if errorlevel 1 (
    echo エラー: npm install に失敗しました。Node.js をインストールしてください。
    cd ..
    pause
    exit /b 1
)

echo [4/4] フロントエンドをビルド中...
call npm run build
if errorlevel 1 (
    echo エラー: npm run build に失敗しました。
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo セットアップ完了！ start.bat でアプリを起動してください。
pause
