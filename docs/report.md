# Отчёт по финальному проекту

**Курс:** Intelligent Cloud & Data Processing (Huawei Technologies)
**Проект:** Digital Security Platform
**Команда:** Take и напарник

## 1. Введение

Целью финального проекта было разработать, контейнеризировать и развернуть рабочее
веб-приложение с использованием cloud-native инструментов. Нашей темой стала
«платформа цифровой безопасности» — четыре инструмента для повседневной работы с
паролями и конфиденциальным текстом: генератор паролей, оценка силы, проверка по
базам утечек и сквозное шифрование текстовых сообщений.

## 2. Архитектура

Приложение построено по трёхслойной схеме:

- **Frontend** — многостраничный сайт на HTML5 / CSS3 / vanilla JavaScript (тёмная
  тема). Клиент общается с бэкендом через REST JSON API и не содержит бизнес-логики
  шифрования — все криптооперации выполняются на сервере.
- **Backend** — Flask-приложение по паттерну *app factory* с двумя blueprint'ами:
  `passwords/` и `crypto/`. Точка входа — `run.py`, в production используется
  `gunicorn` с двумя worker-процессами.
- **Database** — PostgreSQL 16 в отдельном Docker-контейнере. Хранит только
  метаданные зашифрованных токенов (`ciphertext`, `expires_at`); ни паролей, ни
  plaintext-сообщений в БД нет.

Полная диаграмма — в `docs/architecture.md`.

## 3. Технологический стек

Python 3.11 / Flask / cryptography (Fernet) / SQLAlchemy / psycopg2; PostgreSQL 16;
Docker (multi-stage build) + docker-compose; GitHub Actions; Kubernetes
(deployment + service + ingress); prometheus-flask-exporter + Prometheus + Grafana;
HTTPS через Let's Encrypt (cert-manager или платформа Render).

## 4. Безопасность

- Пароли генерируются через `secrets.SystemRandom` (CSPRNG, а не `random`).
- Проверка утечек — через **HIBP k-anonymity**: наружу уходит только первые 5
  символов SHA-1 хэша пароля, а обратно приходит список возможных суффиксов для
  локального сравнения. Сам пароль сервер никогда не отправляет в интернет.
- Шифрование — **Fernet** (AES-128-CBC + HMAC-SHA256; архитектурно эквивалентно
  AES-256 для малых сообщений). Ключ генерируется на сервере, отдаётся клиенту
  **один раз** и **не сохраняется**. Для расшифровки нужны одновременно `token_id`
  и ключ — без одного из компонентов расшифровка невозможна.
- В репозитории нет секретов: только `.env.example` и `.gitignore` исключает `.env`.
- В Docker-образе приложение запускается от непривилегированного пользователя
  `app`, runtime-стейдж не содержит build-инструментов.

## 5. Развёртывание

Локально поднимается одной командой `docker compose up --build` — поднимаются два
сервиса (`web` и `db`) с общей сетью и именованным volume для данных Postgres.
Для облака используется Render: подключаем GitHub-репозиторий как Web Service типа
Docker, добавляем Postgres add-on, указываем переменные окружения. HTTPS Render
даёт из коробки. После пуша в `main` срабатывает GitHub Action `deploy.yml`,
который триггерит Render Deploy Hook — получаем полноценный CI/CD.

## 6. CI/CD и мониторинг

Workflow `ci.yml` запускает линтер `ruff`, unit-тесты `pytest` (с PostgreSQL-сервисом
в GitHub Actions), собирает Docker-образ и выполняет smoke-тест healthcheck'а.
Для мониторинга используется `prometheus-flask-exporter`, который автоматически
экспортирует метрики RPS, latency-гистограммы и количество ошибок по статус-кодам.
Prometheus scrape-конфиг и готовый Grafana dashboard лежат в `monitoring/`.

## 7. Kubernetes

Манифесты в `k8s/` описывают Deployment с двумя репликами, readiness/liveness
probes на `/healthz`, ресурсные лимиты и Prometheus-аннотации. Ingress настроен
на NGINX + cert-manager (Let's Encrypt prod) — единый манифест даёт HTTPS при
развёртывании в управляемом кластере.

## 8. Выполнение требований курса

Минимальные требования: приложение работает в Docker-контейнере, развёрнуто
онлайн, доступно по публичному URL, исходники в Git-репозитории, документация
2–4 страницы присутствует (этот отчёт + README + architecture.md).

Бонусы: Kubernetes манифесты, CI/CD (GitHub Actions), БД в отдельном контейнере,
HTTPS, мониторинг (Prometheus + Grafana) — всё реализовано.

## 9. Ссылки

- Public URL: `https://<deployed-on-render>.onrender.com`
- Git repo: `https://github.com/<team>/intelligent-cloud-final`
- Dockerfile: корень репозитория.
- docker-compose: корень репозитория.
- Отчёт: `docs/report.md` (этот файл).
