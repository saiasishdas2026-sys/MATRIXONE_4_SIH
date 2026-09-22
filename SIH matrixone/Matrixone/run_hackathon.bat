@echo off
title MATRIXONE Hackathon - Setup & Launch
cd /d "%~dp0"

echo =======================================================
echo MATRIXONE - Sovereign Material Harmonization Platform
echo =======================================================
echo.

:: Step 1: Detect Python
set PYTHON_EXE=python
python --version >nul 2>&1
if errorlevel 1 (
    if exist "D:\anaconda\python.exe" (
        set PYTHON_EXE=D:\anaconda\python.exe
    ) else if exist "C:\Users\%USERNAME%\AppData\Local\Python\pythoncore-3.14-64\python.exe" (
        set PYTHON_EXE=C:\Users\%USERNAME%\AppData\Local\Python\pythoncore-3.14-64\python.exe
    ) else if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python313\python.exe" (
        set PYTHON_EXE=C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python313\python.exe
    ) else if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python311\python.exe" (
        set PYTHON_EXE=C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python311\python.exe
    )
)

echo [OK] Using Python: %PYTHON_EXE%
"%PYTHON_EXE%" --version
echo.

:: Step 2: Detect Node.js
where.exe node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found in PATH. Please ensure Node.js is installed.
    pause
    exit /b 1
)
echo [OK] Node.js detected:
node --version
echo.

:: Step 3: Start Backend API server in a separate window
echo [STEP 1/2] Starting MATRIXONE Backend API on http://localhost:8000 ...
start "MATRIXONE Backend API [Port 8000]" cmd /c "cd /d "%~dp0" && set PYTHONPATH=%~dp0&& "%PYTHON_EXE%" -m uvicorn matrixone.backend.main:app --reload --port 8000 --host 127.0.0.1"

timeout /t 3 >nul

:: Step 4: Start Frontend server in a separate window
echo [STEP 2/2] Starting MATRIXONE Frontend on http://localhost:3000 ...
start "MATRIXONE Frontend UI [Port 3000]" cmd /c "cd /d "%~dp0frontend" && npm.cmd run dev"

timeout /t 3 >nul

echo.
echo =======================================================
echo MATRIXONE is now launching!
echo =======================================================
echo.
echo Backend API:     http://localhost:8000
echo API Docs:        http://localhost:8000/api/docs
echo Frontend Web UI: http://localhost:3000
echo.
echo Demo Login: admin@matrixone.gov.in / matrixone123
echo.
echo Opening browser to http://localhost:3000 ...
start http://localhost:3000

echo.
echo Press any key to exit this launcher window (servers remain running).
pause >nul