"""
REST API для модуля паролей.
Все эндпоинты принимают/возвращают JSON.
"""
from flask import Blueprint, request, jsonify

from app.passwords.services import (
    generate_password,
    generate_passphrase,
    score_password,
    check_breach,
)

bp = Blueprint("passwords", __name__)


@bp.post("/generate")
def generate():
    """POST /api/passwords/generate → { password, entropy_bits, ... }"""
    data = request.get_json(silent=True) or {}
    try:
        result = generate_password(
            length=int(data.get("length", 16)),
            use_lower=bool(data.get("use_lower", True)),
            use_upper=bool(data.get("use_upper", True)),
            use_digits=bool(data.get("use_digits", True)),
            use_symbols=bool(data.get("use_symbols", True)),
            exclude_similar=bool(data.get("exclude_similar", False)),
            exclude_chars=str(data.get("exclude_chars", "")),
        )
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@bp.post("/passphrase")
def passphrase():
    """POST /api/passwords/passphrase → { passphrase, entropy_bits, ... }"""
    data = request.get_json(silent=True) or {}
    try:
        result = generate_passphrase(
            words=int(data.get("words", 4)),
            separator=str(data.get("separator", "-")),
            append_digits=bool(data.get("append_digits", True)),
        )
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@bp.post("/strength")
def strength():
    """POST /api/passwords/strength → { score, feedback, entropy_bits }"""
    data = request.get_json(silent=True) or {}
    password = data.get("password", "")
    try:
        return jsonify(score_password(password)), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@bp.post("/breach")
def breach():
    """POST /api/passwords/breach → { breached, count }"""
    data = request.get_json(silent=True) or {}
    password = data.get("password", "")
    try:
        return jsonify(check_breach(password)), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        # Внешний сервис мог упасть — не падаем сами.
        return jsonify({"error": f"HIBP unreachable: {type(e).__name__}"}), 502
