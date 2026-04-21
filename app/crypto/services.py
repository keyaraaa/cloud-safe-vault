"""
Шифрование/расшифровка через Fernet (AES-128-CBC + HMAC-SHA256).
Алгоритмически — симметричное шифрование на одноразовом ключе,
выдаваемом клиенту ровно один раз. Сервер не хранит ни ключ, ни plaintext.
"""
import secrets
from datetime import datetime
from typing import Dict, Optional

from cryptography.fernet import Fernet, InvalidToken
from flask import current_app

from app import db
from app.crypto.models import EncryptedToken


def encrypt_text(plaintext: str) -> Dict[str, str]:
    """
    Шифрует plaintext и возвращает:
      - token_id  — идентификатор записи в БД (безопасно публиковать),
      - key       — Fernet-ключ (показывается ОДИН раз, не хранится),
      - expires_at — ISO timestamp до какого момента токен действителен.
    """
    max_len = current_app.config.get("MAX_PLAINTEXT_LEN", 10_000)
    if not plaintext:
        raise ValueError("plaintext не может быть пустым")
    if len(plaintext) > max_len:
        raise ValueError(f"plaintext слишком длинный (>{max_len} символов)")

    key = Fernet.generate_key()              # 32 случайных байта, base64
    fernet = Fernet(key)
    ciphertext = fernet.encrypt(plaintext.encode("utf-8")).decode("utf-8")

    token_id = secrets.token_urlsafe(24)     # публичный ID, ~32 символа
    ttl = current_app.config.get("TOKEN_TTL")
    expires_at = datetime.utcnow() + ttl

    record = EncryptedToken(
        id=token_id,
        ciphertext=ciphertext,
        expires_at=expires_at,
    )
    db.session.add(record)
    db.session.commit()

    return {
        "token_id": token_id,
        "key": key.decode("utf-8"),
        "expires_at": expires_at.isoformat() + "Z",
    }


def decrypt_text(token_id: str, key: str) -> str:
    """
    Для расшифровки нужны ОБА компонента одновременно: token_id и key.
    Без одного из них — ничего не получится, даже имея доступ к БД.
    """
    if not token_id or not key:
        raise ValueError("Нужны и token_id, и key")

    record: Optional[EncryptedToken] = EncryptedToken.query.get(token_id)
    if record is None:
        raise ValueError("Токен не найден")
    if record.is_expired():
        db.session.delete(record)
        db.session.commit()
        raise ValueError("Срок жизни токена истёк")

    try:
        fernet = Fernet(key.encode("utf-8"))
        plaintext = fernet.decrypt(record.ciphertext.encode("utf-8")).decode("utf-8")
        return plaintext
    except (InvalidToken, ValueError):
        raise ValueError("Неверный ключ или испорченный токен")
