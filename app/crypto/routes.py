"""
REST API для модуля шифрования.
  POST /api/crypto/encrypt  { text }            → { token_id, key, expires_at }
  POST /api/crypto/decrypt  { token_id, key }   → { plaintext }
"""
from flask import Blueprint, request, jsonify

from app.crypto.services import encrypt_text, decrypt_text

bp = Blueprint("crypto", __name__)


@bp.post("/encrypt")
def encrypt():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")
    try:
        return jsonify(encrypt_text(text)), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@bp.post("/decrypt")
def decrypt():
    data = request.get_json(silent=True) or {}
    try:
        plaintext = decrypt_text(
            token_id=str(data.get("token_id", "")),
            key=str(data.get("key", "")),
        )
        return jsonify({"plaintext": plaintext}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
