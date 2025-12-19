@echo off
echo ========================================
echo   Upload Project ke GitHub
echo ========================================
echo.

REM Check if git is initialized
if not exist .git (
    echo [1/5] Initialize Git Repository...
    git init
    echo ✓ Git repository initialized
) else (
    echo [1/5] Git repository sudah ada
)

echo.
echo [2/5] Add semua file ke staging...
git add .
echo ✓ Files added

echo.
echo [3/5] Commit perubahan...
set /p commit_msg="Masukkan commit message (atau tekan Enter untuk default): "
if "%commit_msg%"=="" set commit_msg=Initial commit - E-Commerce Microservices Project
git commit -m "%commit_msg%"
echo ✓ Committed

echo.
echo [4/5] Setup Remote Repository...
echo.
echo INSTRUKSI:
echo 1. Buka https://github.com/new
echo 2. Buat repository baru (misalnya: tubes-iae-microservices)
echo 3. Jangan centang "Initialize with README"
echo 4. Copy URL repository (misalnya: https://github.com/USERNAME/REPO_NAME.git)
echo.
set /p repo_url="Paste URL repository GitHub Anda: "

if "%repo_url%"=="" (
    echo ❌ URL tidak boleh kosong!
    pause
    exit /b 1
)

REM Check if remote already exists
git remote get-url origin >nul 2>&1
if %errorlevel% equ 0 (
    echo Remote 'origin' sudah ada. Update ke URL baru...
    git remote set-url origin %repo_url%
) else (
    git remote add origin %repo_url%
)
echo ✓ Remote repository configured

echo.
echo [5/5] Push ke GitHub...
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ✓ BERHASIL! Project sudah di-upload
    echo ========================================
    echo.
    echo Repository URL: %repo_url%
) else (
    echo.
    echo ========================================
    echo   ❌ GAGAL! Ada error saat push
    echo ========================================
    echo.
    echo Kemungkinan penyebab:
    echo - Belum login ke GitHub
    echo - URL repository salah
    echo - Belum create repository di GitHub
    echo.
    echo Coba manual:
    echo 1. git remote add origin %repo_url%
    echo 2. git push -u origin main
)

echo.
pause

