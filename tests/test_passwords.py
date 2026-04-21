
def test_generate_basic(client):
    r = client.post("/api/passwords/generate", json={"length": 20})
    assert r.status_code == 200
    data = r.get_json()
    assert len(data["password"]) == 20
    assert data["entropy_bits"] > 80       # длинный пароль → высокая энтропия
    assert data["pool_size"] > 0


def test_generate_invalid_length(client):
    r = client.post("/api/passwords/generate", json={"length": 1})
    assert r.status_code == 400


def test_generate_no_classes(client):
    r = client.post("/api/passwords/generate", json={
        "length": 10,
        "use_lower": False,
        "use_upper": False,
        "use_digits": False,
        "use_symbols": False,
    })
    assert r.status_code == 400


def test_strength_scored(client):
    r = client.post("/api/passwords/strength", json={"password": "P@ssword123!"})
    assert r.status_code == 200
    data = r.get_json()
    assert "score" in data and 0 <= data["score"] <= 4
    assert data["length"] == 12


def test_strength_empty(client):
    r = client.post("/api/passwords/strength", json={"password": ""})
    assert r.status_code == 400


def test_passphrase_basic(client):
    r = client.post("/api/passwords/passphrase", json={"words": 4})
    assert r.status_code == 200
    data = r.get_json()
    # 4 слова + 3 цифры в конце по умолчанию → 5 частей через разделитель
    parts = data["passphrase"].split("-")
    assert len(parts) == 5
    assert data["entropy_bits"] > 30


def test_passphrase_no_digits(client):
    r = client.post("/api/passwords/passphrase", json={"words": 3, "append_digits": False})
    data = r.get_json()
    assert len(data["passphrase"].split("-")) == 3


def test_passphrase_bad_words(client):
    r = client.post("/api/passwords/passphrase", json={"words": 1})
    assert r.status_code == 400
