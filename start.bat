@echo off
REM =========================================================
REM  Запуск Digital Security Platform на Windows.
REM  Двойной клик — и всё поднимется.
REM =========================================================

echo.
echo === Intelligent Cloud - Digital Security Platform ===
echo.
echo Проверяю Docker...

docker --version >nul 2>&1
if errorlevel 1 (
    echo [!] Docker не найден. Установи Docker Desktop и запусти его.
    echo     https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker info >nul 2>&1
if errorlevel 1 (
    echo [!] Docker Desktop не запущен. Открой его и подожди, пока кит в трее станет зелёным.
    pause
    exit /b 1
)

echo [OK] Docker в порядке.
echo.
echo Собираю и запускаю контейнеры (первый раз может занять 2-5 минут)...
echo.

docker compose up --build -d

if errorlevel 1 (
    echo.
    echo [!] Что-то пошло не так. Смотри логи выше.
    pause
    exit /b 1
)

echo.
echo =====================================================
echo  Сайт запущен! Открывай в браузере:
echo.
echo     http://localhost:5000
echo.
echo =====================================================
echo.
echo Остановить:  docker compose down
echo Логи:        docker compose logs -f
echo.
timeout /t 3 >nul
start http://localhost:5000
pause
