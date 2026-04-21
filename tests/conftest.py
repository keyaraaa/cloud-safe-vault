import os
import pytest

# Перед импортом приложения переключаем БД на временный SQLite.
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SECRET_KEY"] = "test-secret"
os.environ["FLASK_ENV"] = "development"

from app import create_app, db as _db  # noqa: E402


@pytest.fixture(scope="session")
def app():
    app = create_app()
    app.config["TESTING"] = True
    yield app


@pytest.fixture()
def client(app):
    with app.test_client() as c:
        yield c


@pytest.fixture(autouse=True)
def _reset_db(app):
    """Чистая БД перед каждым тестом."""
    with app.app_context():
        _db.drop_all()
        _db.create_all()
    yield
