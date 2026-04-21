"""
Модель для хранения зашифрованных токенов.
В БД кладём ТОЛЬКО ciphertext + время создания + TTL.
Ни plaintext, ни ключ сервер не хранит.
"""
from datetime import datetime, timedelta

from app import db


class EncryptedToken(db.Model):
    __tablename__ = "encrypted_tokens"

    # Публичный ID токена — безопасно возвращать клиенту.
    id = db.Column(db.String(64), primary_key=True)

    # Сам зашифрованный текст (Fernet token, base64).
    ciphertext = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)

    def is_expired(self) -> bool:
        return datetime.utcnow() > self.expires_at
