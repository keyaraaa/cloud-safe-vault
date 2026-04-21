# Архитектура — Digital Security Platform

## Общая схема (текстовая диаграмма)

```
┌──────────┐   HTTPS     ┌────────────────────────────────┐
│ Браузер  │ ──────────▶ │  Ingress (NGINX + Let's Encrypt)│
└──────────┘             └──────────────┬─────────────────┘
                                        │
                                        ▼
                           ┌────────────────────────────┐
                           │ Service: dsp-web (ClusterIP)│
                           └──────────────┬─────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
        ┌──────────────────┐                            ┌──────────────────┐
        │ Pod 1: Flask +   │                            │ Pod 2: Flask +   │
        │ gunicorn (app)   │                            │ gunicorn (app)   │
        └─────────┬────────┘                            └─────────┬────────┘
                  │                                               │
                  │       SQL                 SQL                 │
                  └─────────────────┐    ┌────────────────────────┘
                                    ▼    ▼
                           ┌──────────────────────┐
                           │  PostgreSQL (db)     │
                           │  — encrypted_tokens  │
                           │  (ciphertext + TTL)  │
                           └──────────────────────┘

        Prometheus ──▶ /metrics на каждом pod ──▶ Grafana dashboard
        HIBP API ◀── k-anonymity SHA-1[:5] ── (из pod'а) — outbound HTTPS
```

## Потоки данных

### Шифрование
1. Клиент → POST `/api/crypto/encrypt {text}`.
2. Flask генерирует Fernet-ключ (32 байта CSPRNG) и `token_id` (secrets.token_urlsafe).
3. В БД пишется только `ciphertext` + `expires_at` (TTL по умолчанию 24 ч).
4. Ответ клиенту: `{token_id, key, expires_at}`. Ключ сервер не сохраняет.

### Расшифровка
1. Клиент → POST `/api/crypto/decrypt {token_id, key}`.
2. Flask достаёт `ciphertext` по `token_id`, проверяет TTL.
3. Fernet с переданным ключом расшифровывает. Ошибка ключа → 400, без утечки.

### Проверка утечек (HIBP k-anonymity)
1. Клиент → POST `/api/passwords/breach {password}`.
2. Flask считает SHA-1 локально, берёт только первые 5 символов.
3. GET `https://api.pwnedpasswords.com/range/<prefix>` → список `суффикс:count`.
4. Локальная сверка → ответ `{breached, count, prefix_sent}`. Сам пароль сеть не пересекает.

## Компоненты

- **Flask app** — `app/__init__.py` (app factory) + blueprints `passwords/`, `crypto/`.
- **PostgreSQL** — отдельный контейнер (`db` в docker-compose, StatefulSet в k8s).
- **gunicorn** — 2 worker'а, связан с gunicorn через EXPOSE 5000.
- **prometheus-flask-exporter** — автоматически отдаёт `flask_http_request_*`, `/metrics`.
- **CI/CD** — `.github/workflows/ci.yml` (lint + tests + docker build + smoke-test), `deploy.yml` (Render Deploy Hook по push в main).
- **K8s** — `deployment.yaml` (replicas 2, resources, probes), `service.yaml`, `ingress.yaml` (TLS).

## Ограничения и решения

| Проблема | Решение |
|---|---|
| Не хранить пароли и plaintext | Хранение только `ciphertext` + метаданные |
| Не отправлять пароль в HIBP | k-anonymity (первые 5 символов SHA-1) |
| Секреты в Git | `.env` в `.gitignore`, в k8s — Secret / Sealed Secrets |
| Утечка ключа Flask | Генерируется на деплое, ротация возможна без миграций |
| Cold-start на free-tier | Healthcheck + readiness probe |
| Переполнение БД просроченными токенами | TTL-чистка (cron/cleanup job — см. TODO) |
