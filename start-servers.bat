@echo off
setlocal enabledelayedexpansion

:: Configuration des chemins
set "FRONTEND_PATH=D:\Dev\OC\Projets\8. Portfolio\Frontend\portfolio-app"
set "BACKEND_PATH=D:\Dev\OC\Projets\8. Portfolio\Backend\Backend-Portfolio"

:: Couleurs pour les messages
set "GREEN=[32m"
set "RED=[31m"
set "YELLOW=[33m"
set "CYAN=[36m"
set "RESET=[0m"

echo %CYAN%🚀 Démarrage des serveurs...%RESET%

:: Vérification des chemins
if not exist "%FRONTEND_PATH%" (
    echo %RED%❌ Le chemin du frontend n'existe pas: %FRONTEND_PATH%%RESET%
    pause
    exit /b 1
)

if not exist "%BACKEND_PATH%" (
    echo %RED%❌ Le chemin du backend n'existe pas: %BACKEND_PATH%%RESET%
    pause
    exit /b 1
)

:: Vérification des package.json
if not exist "%FRONTEND_PATH%\package.json" (
    echo %RED%❌ package.json non trouvé dans le frontend%RESET%
    pause
    exit /b 1
)

if not exist "%BACKEND_PATH%\package.json" (
    echo %RED%❌ package.json non trouvé dans le backend%RESET%
    pause
    exit /b 1
)

:: Vérification de npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %RED%❌ npm n'est pas installé ou n'est pas dans le PATH%RESET%
    pause
    exit /b 1
)

:: Démarrage du frontend
echo %GREEN%📦 Démarrage du Frontend...%RESET%
start "Frontend" cmd /c "cd /d "%FRONTEND_PATH%" && npm install && npm run dev"

:: Démarrage du backend
echo %GREEN%📦 Démarrage du Backend...%RESET%
start "Backend" cmd /c "cd /d "%BACKEND_PATH%" && npm install && npm run start:dev"

echo.
echo %CYAN%✨ Serveurs démarrés avec succès !%RESET%
echo %GREEN%Frontend: http://localhost:3000%RESET%
echo %GREEN%Backend: http://localhost:3001%RESET%
echo.
echo %YELLOW%⚠️ Pour arrêter les serveurs, fermez simplement les fenêtres de commande%RESET%
echo.
pause 