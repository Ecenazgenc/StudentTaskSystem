@echo off
echo ========================================================
echo   Ogrenci Gorev Takip Sistemi (Backend + Frontend)
echo ========================================================
echo.
echo 1. Backend (Spring Boot) baslatiliyor...
start "Spring Boot Backend" cmd /k "cd backend && mvnw.cmd spring-boot:run"

echo 2. Frontend (React + Vite) baslatiliyor...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Her iki servis de baslatildi!
echo - Backend:  http://localhost:8080
echo - Frontend: http://localhost:5173
echo ========================================================
