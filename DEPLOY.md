# Деплой Vault — пошаговая инструкция

## Шаг 9 — GitHub

Открой Терминал и выполни в папке проекта:

```bash
cd ~/ICT              # или где лежит проект

rm -f .git/index.lock   # убрать lock если остался

git add .
git commit -m "Initial commit: Vault — password manager & encryption tool"
```

**Вариант А — через gh CLI (проще):**
```bash
gh repo create vault --public --source=. --remote=origin --push
```

**Вариант Б — вручную:**
1. Зайди на https://github.com/new
2. Название: `vault`, Public, без README
3. Нажми "Create repository"
4. Выполни в терминале:
```bash
git remote add origin https://github.com/ТВОЙ_ЛОГИН/vault.git
git push -u origin main
```

---

## Шаг 10 — Render деплой

1. Зайди на https://render.com → Sign up / Log in через GitHub
2. Нажми **"New +"** → **"Web Service"**
3. Подключи репозиторий `vault`
4. Render автоматически найдёт `render.yaml` — нажми **Apply**
5. Подожди 3–5 минут — сайт появится на `https://vault-XXXX.onrender.com`

> На бесплатном тарифе сайт "засыпает" через 15 минут неактивности.
> Первый запрос после сна занимает ~30 сек — это нормально.

---

## Шаг 11 — Deploy Hook (авто-деплой при пуше)

После того как Render задеплоит:

1. В Render → твой сервис → **Settings** → **Deploy Hook** → скопируй URL
2. В GitHub → репозиторий → **Settings** → **Secrets and variables** → **Actions**
3. Нажми **"New repository secret"**:
   - Name: `RENDER_DEPLOY_HOOK_URL`
   - Value: вставь URL из Render
4. Готово! Теперь каждый `git push` в `main` → автоматически деплоит на Render

---

## Шаг 12 — Финальный чек-лист к защите

### Функциональность
- [ ] Генератор паролей работает (длина, символы, сложность)
- [ ] Парольная фраза генерируется (рус: "Парольная фраза")
- [ ] Сила пароля показывается (zxcvbn)
- [ ] Проверка по базам утечек работает (HIBP / k-anonymity)
- [ ] Шифрование текста: зашифровать → получить токен
- [ ] Дешифрование по токену работает
- [ ] Токен истекает через 24 ч

### Безопасность
- [ ] `.env` не попал в GitHub (проверь на github.com в репозитории)
- [ ] `SECRET_KEY` в Render сгенерирован автоматически (не тот что в .env.example)
- [ ] HTTPS включён (Render даёт автоматически)
- [ ] Пароли нигде не логируются и не хранятся в БД

### Техническая часть
- [ ] Docker запускается: `docker compose up --build`
- [ ] Тесты проходят: `pytest -q`
- [ ] CI зелёный в GitHub (вкладка Actions)
- [ ] Публичный URL открывается и работает
- [ ] Переключатель языков RU/EN работает

### Для защиты — что рассказать
- **Стек:** Flask, PostgreSQL, Docker, Render, GitHub Actions
- **Шифрование:** Fernet (AES-256-CBC + HMAC-SHA256)
- **Проверка утечек:** k-anonymity — на сервер уходят только первые 5 символов хэша
- **Без регистрации:** никаких пользователей, никаких паролей в БД
- **CI/CD:** на каждый push — lint + pytest + docker build + деплой

---

## Быстрые команды

```bash
# Локальный запуск
docker compose up --build

# Тесты
pytest -q

# Запушить изменения (триггернёт авто-деплой)
git add .
git commit -m "fix: описание"
git push
```
