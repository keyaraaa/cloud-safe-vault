"""
Бизнес-логика модуля паролей:
1. generate_password — криптографически стойкий генератор.
2. score_password   — оценка силы (энтропия + zxcvbn).
3. check_breach     — проверка по HIBP через k-anonymity.
"""
import hashlib
import math
import secrets
import string
from typing import Dict, List, Optional

import requests
from zxcvbn import zxcvbn

from app.passwords.wordlist import WORDS

# Символьные алфавиты для генератора.
ALPHABETS = {
    "lower": string.ascii_lowercase,
    "upper": string.ascii_uppercase,
    "digits": string.digits,
    "symbols": "!@#$%^&*()-_=+[]{};:,.<>?/|~",
}

# Похожие символы, которые часто исключают для читаемости паролей.
SIMILAR = set("Il1O0o`'\"")


def generate_password(
    length: int = 16,
    use_lower: bool = True,
    use_upper: bool = True,
    use_digits: bool = True,
    use_symbols: bool = True,
    exclude_similar: bool = False,
    exclude_chars: str = "",
) -> Dict[str, object]:
    """Генерирует пароль через `secrets.choice` — CSPRNG, не PRNG."""
    if length < 4 or length > 128:
        raise ValueError("length должен быть в диапазоне 4..128")

    pool_parts: List[str] = []
    if use_lower:
        pool_parts.append(ALPHABETS["lower"])
    if use_upper:
        pool_parts.append(ALPHABETS["upper"])
    if use_digits:
        pool_parts.append(ALPHABETS["digits"])
    if use_symbols:
        pool_parts.append(ALPHABETS["symbols"])

    if not pool_parts:
        raise ValueError("Хотя бы один класс символов должен быть включён")

    # Финальный пул с учётом исключений.
    excluded = set(exclude_chars)
    if exclude_similar:
        excluded |= SIMILAR

    pool_parts = [
        "".join(ch for ch in part if ch not in excluded) for part in pool_parts
    ]
    pool_parts = [p for p in pool_parts if p]
    if not pool_parts:
        raise ValueError("После исключений не осталось символов для генерации")

    # Гарантируем наличие хотя бы одного символа из каждого выбранного класса.
    password_chars: List[str] = [secrets.choice(part) for part in pool_parts]

    combined_pool = "".join(pool_parts)
    for _ in range(length - len(password_chars)):
        password_chars.append(secrets.choice(combined_pool))

    # Тасуем, чтобы обязательные символы не стояли в начале.
    secrets.SystemRandom().shuffle(password_chars)
    password = "".join(password_chars)

    entropy_bits = length * math.log2(len(combined_pool)) if combined_pool else 0.0

    return {
        "password": password,
        "length": length,
        "pool_size": len(combined_pool),
        "entropy_bits": round(entropy_bits, 2),
    }


def generate_passphrase(
    words: int = 4,
    separator: str = "-",
    append_digits: bool = True,
) -> Dict[str, object]:
    """Memorable passphrase в стиле diceware: слова через разделитель + опц. цифры."""
    if words < 2 or words > 12:
        raise ValueError("words должно быть в диапазоне 2..12")
    if len(separator) > 3:
        raise ValueError("separator слишком длинный")

    chosen = [secrets.choice(WORDS) for _ in range(words)]
    phrase = separator.join(chosen)
    if append_digits:
        phrase += separator + f"{secrets.randbelow(1000):03d}"

    # Энтропия: log2(|WORDS|) на слово + 10 бит на 3-значное число (если включено).
    entropy = words * math.log2(len(WORDS)) + (10 if append_digits else 0)

    return {
        "passphrase": phrase,
        "entropy_bits": round(entropy, 2),
        "words_count": words,
        "dictionary_size": len(WORDS),
    }


def score_password(password: str) -> Dict[str, object]:
    """Возвращает оценку силы пароля: score 0..4 + энтропия + советы."""
    if not password:
        raise ValueError("password не может быть пустым")

    result = zxcvbn(password)
    pool = 0
    if any(c.islower() for c in password):
        pool += 26
    if any(c.isupper() for c in password):
        pool += 26
    if any(c.isdigit() for c in password):
        pool += 10
    if any(not c.isalnum() for c in password):
        pool += 32

    entropy_bits = len(password) * math.log2(pool) if pool else 0.0

    return {
        "score": result["score"],               # 0..4
        "crack_times": result["crack_times_display"],
        "feedback": result["feedback"],
        "entropy_bits": round(entropy_bits, 2),
        "length": len(password),
    }


def check_breach(password: str, timeout: int = 5) -> Dict[str, object]:
    """
    Проверка по HIBP через k-anonymity: наружу уходит только первые
    5 символов SHA-1, обратно приходит список суффиксов — сверяем локально.
    Сам пароль никогда не покидает наш сервер.
    """
    if not password:
        raise ValueError("password не может быть пустым")

    sha1 = hashlib.sha1(password.encode("utf-8")).hexdigest().upper()
    prefix, suffix = sha1[:5], sha1[5:]

    try:
        from flask import current_app
        url = current_app.config.get("HIBP_API_URL", "https://api.pwnedpasswords.com/range/") + prefix
    except RuntimeError:
        # Вне Flask-контекста (например, юнит-тест).
        url = "https://api.pwnedpasswords.com/range/" + prefix

    response = requests.get(url, timeout=timeout, headers={"User-Agent": "IntelligentCloud-DSP"})
    response.raise_for_status()

    count = 0
    for line in response.text.splitlines():
        parts = line.strip().split(":")
        if len(parts) == 2 and parts[0] == suffix:
            count = int(parts[1])
            break

    return {
        "breached": count > 0,
        "count": count,
        "prefix_sent": prefix,   # видно — мы отправили только 5 символов
    }
