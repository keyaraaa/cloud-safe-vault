# =========================================================
# Multi-stage Dockerfile для Digital Security Platform.
# Stage 1 — builder: ставит зависимости в отдельный venv.
# Stage 2 — runtime: минимальный образ без build-инструментов.
# =========================================================

# -------- STAGE 1: builder --------
FROM python:3.11-slim AS builder

WORKDIR /app

# Системные зависимости, нужные для сборки psycopg2 и cryptography.
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev build-essential \
    && rm -rf /var/lib/apt/lists/*

# Отдельный venv, который потом скопируем в runtime-образ.
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt


# -------- STAGE 2: runtime --------
FROM python:3.11-slim AS runtime

# Непривилегированный пользователь для запуска приложения.
RUN groupadd --system app && useradd --system --gid app --home /app app

# libpq нужен runtime для psycopg2.
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq5 curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем venv из builder-стейджа.
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    FLASK_ENV=production

# Копируем исходники приложения.
COPY --chown=app:app . /app

USER app

EXPOSE 5000

# Healthcheck, чтобы оркестратор (Docker/K8s) видел состояние сервиса.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl --fail --silent http://localhost:5000/healthz || exit 1

# gunicorn — production-grade WSGI server.
# 2 worker'а достаточно для free-tier; на проде — по CPU.
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "60", "run:app"]
