#!/usr/bin/env bash
# =========================================================
# Запуск Digital Security Platform на macOS / Linux.
# Запуск:  ./start.sh   (предварительно: chmod +x start.sh)
# =========================================================
set -e

echo ""
echo "=== Intelligent Cloud — Digital Security Platform ==="
echo ""
echo "Проверяю Docker..."

if ! command -v docker >/dev/null 2>&1; then
    echo "[!] Docker не найден. Установи Docker Desktop."
    echo "    https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo "[!] Docker не запущен. Открой Docker Desktop и подожди пока он полностью стартует."
    exit 1
fi

echo "[OK] Docker в порядке."
echo ""
echo "Собираю и запускаю контейнеры (первый раз 2–5 минут)..."
echo ""

docker compose up --build -d

echo ""
echo "====================================================="
echo "  Сайт запущен! Открывай в браузере:"
echo ""
echo "     http://localhost:5000"
echo ""
echo "====================================================="
echo ""
echo "Остановить:  docker compose down"
echo "Логи:        docker compose logs -f"
echo ""

# Автоматически открыть в браузере (работает на macOS; на Linux — xdg-open).
if command -v open >/dev/null 2>&1; then
    sleep 3
    open http://localhost:5000
elif command -v xdg-open >/dev/null 2>&1; then
    sleep 3
    xdg-open http://localhost:5000
fi
