@echo off
cd "D:\SIH 2026\Matrixone\matrixone"
set PYTHON_EXE=C:\Users\anime\AppData\Local\Programs\Python\Python311\python.exe
if exist "%PYTHON_EXE%" (
    echo Starting MATRIXONE...
    "%PYTHON_EXE%" -m pip install -e . --quiet 2>nul
    "%PYTHON_EXE%" test_minimal_run.py
) else (
    echo Python 3.11 not found at expected location.
    echo Trying alternative...
    python -m pip install -e . --quiet 2>nul
    python test_minimal_run.py
)
pause