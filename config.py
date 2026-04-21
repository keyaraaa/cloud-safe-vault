import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:
    # Секретный ключ Flask для сессий / CSRF. Перегенерируется на деплое.
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-me")

    # БД: по умолчанию — SQLite (для локальной разработки без Docker),
    # в docker-compose будет переопределено на PostgreSQL.
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "sqlite:///local.db",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # TTL токенов шифрования (после истечения — токен удаляется).
    TOKEN_TTL = timedelta(hours=int(os.environ.get("TOKEN_TTL_HOURS", 720)))  # 30 дней по умолчанию

    # HIBP API — никаких ключей не требуется для k-anonymity endpoint.
    HIBP_API_URL = "https://api.pwnedpasswords.com/range/"

    # Лимит длины текста для шифрования (защита от злоупотребления).
    MAX_PLAINTEXT_LEN = 10_000


class ProductionConfig(Config):
    DEBUG = False


class DevelopmentConfig(Config):
    DEBUG = True


def get_config():
    env = os.environ.get("FLASK_ENV", "development").lower()
    return ProductionConfig if env == "production" else DevelopmentConfig
