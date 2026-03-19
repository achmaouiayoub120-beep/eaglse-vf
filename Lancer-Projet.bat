@echo off
echo ==========================================
echo    EAGLES CLUB MANAGEMENT SYSTEM
echo ==========================================
echo.
echo [1/2] Nettoyage des fichiers temporaires...
if exist .next rmdir /s /q .next
echo [2/2] Lancement du serveur Eagles...
echo.
echo Une fois lance, ouvrez : http://localhost:3000
echo.
npm run dev
pause
