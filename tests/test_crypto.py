"""Тесты crypto-модуля — самая чувствительная часть приложения."""
import pytest


def test_encrypt_then_decrypt_roundtrip(client):
    r1 = client.post("/api/crypto/encrypt", json={"text": "секретное сообщение"})
    assert r1.status_code == 200
    data = r1.get_json()
    assert "token_id" in data and "key" in data

    r2 = client.post("/api/crypto/decrypt", json={
        "token_id": data["token_id"],
        "key": data["key"],
    })
    assert r2.status_code == 200
    assert r2.get_json()["plaintext"] == "секретное сообщение"


def test_decrypt_with_wrong_key_fails(client):
    r1 = client.post("/api/crypto/encrypt", json={"text": "hello"})
    data = r1.get_json()

    # Пытаемся с заведомо неправильным (но синтаксически валидным) ключом.
    from cryptography.fernet import Fernet
    bad_key = Fernet.generate_key().decode()

    r2 = client.post("/api/crypto/decrypt", json={
        "token_id": data["token_id"],
        "key": bad_key,
    })
    assert r2.status_code == 400


def test_decrypt_without_token_fails(client):
    r = client.post("/api/crypto/decrypt", json={"token_id": "", "key": "x"})
    assert r.status_code == 400


def test_encrypt_empty_fails(client):
    r = client.post("/api/crypto/encrypt", json={"text": ""})
    assert r.status_code == 400


def test_token_not_found(client):
    from cryptography.fernet import Fernet
    r = client.post("/api/crypto/decrypt", json={
        "token_id": "does-not-exist",
        "key": Fernet.generate_key().decode(),
    })
    assert r.status_code == 400
