@echo off
echo ========================================================
echo   Ogrenci Gorev Takip Sistemi - Servisleri Durdur
echo ========================================================
echo.
echo Arka plan servisleri sonlandiriliyor...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
echo.
echo Tum servisler basariyla durduruldu!
pause
