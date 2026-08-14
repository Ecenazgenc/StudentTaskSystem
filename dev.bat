@echo off
chcp 65001 >nul 2>&1
title Ogrenci Gorev Takip Sistemi

echo.
echo    ╔══════════════════════════════════════════════════════╗
echo    ║                                                      ║
echo    ║     OGRENCI GOREV TAKIP SISTEMI                      ║
echo    ║     Student Task Management System                   ║
echo    ║                                                      ║
echo    ╠══════════════════════════════════════════════════════╣
echo    ║                                                      ║
echo    ║   Backend  : Spring Boot   ► localhost:8080           ║
echo    ║   Frontend : React + Vite  ► localhost:5173           ║
echo    ║                                                      ║
echo    ╚══════════════════════════════════════════════════════╝
echo.

echo    [1/2] Backend (Spring Boot) baslatiliyor...
start "Spring Boot Backend" cmd /k "cd /d %~dp0backend && mvnw.cmd spring-boot:run"

echo    [2/2] Frontend (React + Vite) baslatiliyor...
start "React Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo    ════════════════════════════════════════════════════════
echo      Her iki servis de baslatildi!
echo      Tarayicinizda http://localhost:5173 adresini acin.
echo    ════════════════════════════════════════════════════════
echo.
pause
