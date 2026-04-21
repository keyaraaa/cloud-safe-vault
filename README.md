# cloud-safe-vault

A web app I built for a cloud & data processing course. It's basically a collection of security tools I actually wanted to use myself — instead of opening five different sketchy websites every time I need to generate a password or check if it got leaked.

## What's inside

- **Password generator** — uses `secrets` module (CSPRNG), configurable length, character sets, entropy display
- **Strength checker** — zxcvbn-based scoring with estimated crack time
- **Breach lookup** — checks Have I Been Pwned using k-anonymity, only the first 5 chars of the SHA-1 hash ever leave your browser
- **Text encryption** — Fernet (AES-256 + HMAC), generates a one-time key, stores only the ciphertext, auto-expires in 24h

## Stack

| Layer | Tech |
|---|---|
| Frontend | HTML5, CSS3 (dark theme), vanilla JS |
| Backend | Python 3.11, Flask, SQLAlchemy |
| DB | PostgreSQL 16 |
| Containers | Docker (multi-stage), docker-compose |
| CI/CD | GitHub Actions — lint, pytest, docker build, auto-deploy to Render |
| Orchestration | Kubernetes manifests (deployment / service / ingress) |
| Monitoring | prometheus-flask-exporter + Prometheus + Grafana |
| Hosting | Render (free tier) |

## Run locally

**With Docker (recommended):**
```bash
cp .env.example .env
# edit .env — set DB password and SECRET_KEY
docker compose up --build
```
Open http://localhost:5000

**Without Docker:**
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python run.py
```
Uses SQLite by default. Override `DATABASE_URL` in `.env` for Postgres.

## Tests

```bash
pytest -q
```

Covers crypto (roundtrip, bad key, TTL expiry) and passwords (generation, validation, strength scoring).

## API

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/api/passwords/generate` | `{length, use_lower, use_upper, use_digits, use_symbols, exclude_chars}` | `{password, entropy_bits}` |
| POST | `/api/passwords/strength` | `{password}` | `{score, crack_times, feedback}` |
| POST | `/api/passwords/breach` | `{password}` | `{breached, count}` |
| POST | `/api/crypto/encrypt` | `{text}` | `{token_id, key, expires_at}` |
| POST | `/api/crypto/decrypt` | `{token_id, key}` | `{plaintext}` |
| GET | `/healthz` | — | `{status: "ok"}` |

## Security notes

- Passwords are never stored or logged anywhere
- HIBP k-anonymity — the actual password never leaves the server
- Encryption key is shown once and never saved — if you lose it, the text is gone
- No plaintext in the DB, only ciphertext + expiry timestamp
- `.env` is gitignored, secrets are set via environment variables in prod

## Repo structure

```
app/               Flask app (passwords + crypto blueprints, templates, static)
tests/             pytest
k8s/               Kubernetes manifests
monitoring/        Prometheus config, Grafana dashboard
.github/workflows/ CI pipeline + Render deploy hook
Dockerfile         Multi-stage build
docker-compose.yml Local dev with Postgres
render.yaml        Render deployment config
```
