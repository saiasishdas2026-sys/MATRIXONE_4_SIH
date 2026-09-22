@echo off
title MATRIXONE Material Harmonization Platform - Backend
cd /d "%~dp0"

echo ============================================
echo MATRIXONE - Material Harmonization Platform
echo ============================================
echo.

:: Check Python installation
set PYTHON=python
python --version >nul 2>&1
if errorlevel 1 (
    if exist "D:\anaconda\python.exe" (
        set PYTHON=D:\anaconda\python.exe
    ) else if exist "C:\Users\%USERNAME%\AppData\Local\Python\pythoncore-3.14-64\python.exe" (
        set PYTHON=C:\Users\%USERNAME%\AppData\Local\Python\pythoncore-3.14-64\python.exe
    ) else if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python313\python.exe" (
        set PYTHON=C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python313\python.exe
    ) else if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python311\python.exe" (
        set PYTHON=C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python311\python.exe
    )
)

echo [OK] Using Python: %PYTHON%
echo.

set PYTHONPATH=%~dp0

echo Starting the MATRIXONE API server...
echo.
echo "Access the API at: http://localhost:8000"
echo "API Docs at: http://localhost:8000/api/docs"
echo "Health check: http://localhost:8000/health"
echo.

"%PYTHON%" -m uvicorn matrixone.backend.main:app --reload --port 8000 --host 127.0.0.1

pause