# Intelligent Cloud — Digital Security Platform

Финальный проект курса **«Intelligent Cloud & Data Processing»** на базе Huawei Technologies.

Веб-приложение с четырьмя инструментами цифровой безопасности:

1. **Генератор паролей** — CSPRNG (`secrets`), любые алфавиты, исключения, энтропия в битах.
2. **Оценка силы** — скор 0–4 + оценка времени перебора (zxcvbn).
3. **Проверка утечек** — HIBP k-anonymity: наружу уходит только префикс SHA-1.
4. **Шифрование текста** — Fernet (AES-128-CBC + HMAC-SHA256) с одноразовым ключом.

## Стек

| Слой | Технологии |
|---|---|
| Frontend | HTML5, CSS3 (dark theme), vanilla JavaScript |
| Backend | Python 3.11, Flask, cryptography, SQLAlchemy |
| БД | PostgreSQL 16 (в Docker) |
| Контейнеры | Docker (multi-stage), docker-compose |
| CI/CD | GitHub Actions (lint + pytest + docker build + Render deploy) |
| Оркестрация | Kubernetes (deployment / service / ingress) |
| Мониторинг | prometheus-flask-exporter + Prometheus + Grafana |
| HTTPS | Let's Encrypt через cert-manager / платформу хостинга |
| Hosting | Render (free tier, нативный Docker) |

## Быстрый старт (Docker Compose)

```bash
cp .env.example .env
# отредактируйте .env — пароли БД, SECRET_KEY
docker compose up --build
```

Откройте http://localhost:5000.

## Локальный запуск без Docker

```bash
python -m venv .venv
source .venv/bin/activate              # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python run.py
```

По умолчанию используется SQLite (`local.db`). Для PostgreSQL переопределите `DATABASE_URL` в `.env`.

## Тесты

```bash
pytest -q
```

Покрыты: crypto (roundtrip, неверный ключ, TTL), passwords (генерация, валидация, сила).

## Структура репозитория

```
.
├── app/                     # Flask application
│   ├── __init__.py          # App factory
│   ├── passwords/           # Blueprint: генератор, сила, утечки
│   ├── crypto/              # Blueprint: encrypt / decrypt + модель БД
│   ├── templates/           # Jinja2 (base.html + 4 страницы)
│   └── static/              # CSS / JS
├── tests/                   # pytest
├── k8s/                     # Kubernetes manifests
├── monitoring/              # prometheus.yml, Grafana dashboard
├── .github/workflows/       # CI + deploy
├── docs/                    # Отчёт + диаграмма архитектуры
├── Dockerfile               # Multi-stage (builder + runtime)
├── docker-compose.yml       # web + db
├── .env.example
├── requirements.txt
├── config.py
├── run.py
└── README.md
```

## REST API (кратко)

| Метод | Путь | Запрос | Ответ |
|---|---|---|---|
| POST | `/api/passwords/generate` | `{length, use_lower, use_upper, use_digits, use_symbols, exclude_similar, exclude_chars}` | `{password, entropy_bits, pool_size, length}` |
| POST | `/api/passwords/strength` | `{password}` | `{score, crack_times, feedback, entropy_bits, length}` |
| POST | `/api/passwords/breach` | `{password}` | `{breached, count, prefix_sent}` |
| POST | `/api/crypto/encrypt` | `{text}` | `{token_id, key, expires_at}` |
| POST | `/api/crypto/decrypt` | `{token_id, key}` | `{plaintext}` |
| GET  | `/healthz` | — | `{status: "ok"}` |
| GET  | `/metrics` | — | Prometheus exposition format |

## Деплой на Render

1. Создать Web Service → подключить GitHub-репозиторий.
2. Environment: `Docker`. Dockerfile — в корне.
3. Environment Variables: `SECRET_KEY`, `DATABASE_URL`, `TOKEN_TTL_HOURS`.
4. Добавить PostgreSQL add-on (или внешнюю Postgres).
5. Render выдаёт HTTPS + автоматический редирект.
6. Для CI-деплоя: Deploy Hook → сохранить в GitHub Secrets как `RENDER_DEPLOY_HOOK_URL`.

## Безопасность

- Пароли генерируются через `secrets.SystemRandom`.
- HIBP: k-anonymity — пароль не покидает сервер.
- Шифрование: Fernet (AES-256 equiv.), ключ одноразовый.
- В БД — только `ciphertext`, `expires_at`. Никакого plaintext.
- Секретов в репозитории нет: `.env` в `.gitignore`, только `.env.example`.
- В production — HTTPS, непривилегированный пользователь в Docker, readOnlyRootFilesystem в k8s (опционально).

## Команда

Take и напарник. Проект объединяет два начальных сайта в один итоговый деливерабл.
