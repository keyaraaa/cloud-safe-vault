"""
App factory: собирает Flask-приложение, регистрирует blueprints,
инициализирует БД и Prometheus-метрики.
"""
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from prometheus_flask_exporter import PrometheusMetrics

from config import get_config

# Глобальная ссылка на SQLAlchemy — инициализируется в create_app().
db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config.from_object(get_config())

    # БД
    db.init_app(app)

    # Prometheus /metrics (мониторинг: latency, RPS, error rate).
    metrics = PrometheusMetrics(app)
    metrics.info("app_info", "Intelligent Cloud — Digital Security Platform", version="1.0.0")

    # Регистрируем blueprints (feature-based).
    from app.passwords.routes import bp as passwords_bp
    from app.crypto.routes import bp as crypto_bp

    app.register_blueprint(passwords_bp, url_prefix="/api/passwords")
    app.register_blueprint(crypto_bp, url_prefix="/api/crypto")

    # Страницы фронта (возвращают HTML шаблоны).
    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/passwords")
    def passwords_page():
        return render_template("passwords.html")

    @app.route("/encryption")
    def encryption_page():
        return render_template("encryption.html")

    @app.route("/about")
    def about_page():
        return render_template("about.html")

    @app.route("/healthz")
    def healthz():
        return {"status": "ok"}, 200

    @app.route("/api/stats")
    def stats():
        """Публичная статистика для страницы About."""
        from app.crypto.models import EncryptedToken
        try:
            total = db.session.query(EncryptedToken).count()
        except Exception:
            total = 0
        # Самая ранняя запись — считаем временем «запуска».
        try:
            earliest = db.session.query(db.func.min(EncryptedToken.created_at)).scalar()
            since = earliest.isoformat() + "Z" if earliest else None
        except Exception:
            since = None
        return {"tokens_total": total, "since": since}, 200

    # Создаём таблицы при первом запуске (idempotent).
    with app.app_context():
        from app.crypto.models import EncryptedToken  # noqa: F401
        db.create_all()

    return app
