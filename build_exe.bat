@echo off
chcp 65001 > nul
echo === .exe ビルド ===

if not exist ".venv" (
    echo .venv が見つかりません。先に setup.bat を実行してください。
    pause
    exit /b 1
)

echo [1/2] フロントエンドをビルド中...
cd frontend
call npm run build
if errorlevel 1 (
    echo エラー: npm run build に失敗しました。
    cd ..
    pause
    exit /b 1
)
cd ..

echo [2/2] PyInstaller で exe を生成中...
call .venv\Scripts\pyinstaller error-code-viewer.spec --noconfirm
if errorlevel 1 (
    echo エラー: PyInstaller に失敗しました。
    pause
    exit /b 1
)

echo.
echo ビルド完了: dist\error-code-viewer.exe
echo このファイル単体を別のPCに配布できます（Python/Node 不要）。
pause
