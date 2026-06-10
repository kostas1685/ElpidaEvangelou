@echo off
chcp 65001 >nul
title Evangelou Law - Setup

echo.
echo  ==========================================
echo   Evangelou Law - Git Setup
echo  ==========================================
echo.

:: Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Το Git δεν ειναι εγκατεστημενο!
    echo.
    echo  Κατεβαστε το Git απο: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

:: Set git identity
git config --global user.email "kostas1685@github.com"
git config --global user.name "kostas1685"

echo  [OK] Git βρεθηκε.
echo.

:: Check if we are already inside the repo
git rev-parse --git-dir >nul 2>&1
if not errorlevel 1 (
    echo  [INFO] Βρεθηκε υπαρχον repository. Κανω pull...
    echo.
    git pull origin main
    echo.
    echo  [OK] Ολα τα αρχεια ειναι ενημερωμενα!
    goto :done
)

:: Check if folder already exists next to this script
set REPO_DIR=%~dp0
if exist "%REPO_DIR%.git" (
    echo  [INFO] Βρεθηκε υπαρχον repository. Κανω pull...
    cd /d "%REPO_DIR%"
    git pull origin main
    echo.
    echo  [OK] Ολα τα αρχεια ειναι ενημερωμενα!
    goto :done
)

:: Fresh clone
echo  [INFO] Κανω clone το repository...
echo.
git clone https://github.com/kostas1685/ElpidaEvangelou.git
if errorlevel 1 (
    echo.
    echo  [ERROR] Αποτυχια clone. Ελεγξτε τη συνδεση σας.
    pause
    exit /b 1
)
echo.
echo  [OK] Clone ολοκληρωθηκε!

:done
echo.
echo  ==========================================
echo   Ετοιμο! Ο φακελος ElpidaEvangelou
echo   εχει ολα τα αρχεια ενημερωμενα.
echo  ==========================================
echo.
echo  ΣΗΜΑΝΤΙΚΟ: Μην ανεβαζετε αρχεια μεσω
echo  GitHub web interface (Upload files).
echo  Χρησιμοποιειτε παντα αυτο το script.
echo.
pause
