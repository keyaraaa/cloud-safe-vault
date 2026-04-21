# Claude Project Setup — Intelligent Cloud Final Project

Файл содержит готовые тексты для создания Claude Project. Каждая секция на **русском и английском** — скопируйте нужную в соответствующее поле при создании проекта на claude.ai.

---

## 1. Название проекта / Project Name

**RU (короткий вариант):**
```
Intelligent Cloud — Платформа цифровой безопасности
```

**RU (полный вариант):**
```
Intelligent Cloud & Data Processing — Финальный проект (Huawei)
```

**EN (короткий вариант):**
```
Intelligent Cloud — Digital Security Platform
```

**EN (полный вариант):**
```
Intelligent Cloud & Data Processing — Final Project (Huawei)
```

---

## 2. Короткое описание проекта / Project Description

> Поле "Description" в Claude Project. 1–3 предложения, показывается в списке проектов.

**RU:**
```
Финальный проект курса «Intelligent Cloud & Data Processing» на базе
Huawei Technologies. Веб-приложение для цифровой безопасности и управления
личными данными: генератор надёжных паролей, проверка силы пароля, сверка
с базами утечек и сервис шифрования текста (секретный ключ + токен).
Стек: HTML/CSS/JS + Python Flask, Docker, PostgreSQL, GitHub Actions,
Kubernetes, мониторинг, HTTPS. Хостинг: Render. Команда из 2 человек
объединяет две начальные версии сайта в одно финальное приложение.
```

**EN:**
```
Final project for the "Intelligent Cloud & Data Processing" course
(Huawei Technologies). A web application for digital security and
personal data management: strong password generator, password strength
checker, breach-database lookup, and a secure text encryption service
(unique secret key + token). Stack: HTML/CSS/JS + Python Flask, Docker,
PostgreSQL, GitHub Actions, Kubernetes, monitoring, HTTPS. Hosting:
Render. A two-person team is merging two initial site versions into one
polished final application.
```

---

## 3. Custom Instructions (System Prompt) для Claude Project

> Поле "Custom instructions" / "Project knowledge". Это самая важная часть — Claude будет опираться на неё в каждом чате внутри проекта. Есть две версии: используйте ту, на каком языке чаще общаетесь с Claude. Можно оставить и обе — Claude сам поймёт.

### 3.1. Custom Instructions — RU

```
Ты — технический помощник команды из 2 человек (Take и его напарник),
которые делают финальный проект курса «Intelligent Cloud & Data Processing»
на базе Huawei Technologies.

=== ПРОЕКТ ===

Веб-приложение «Digital Security Platform» для генерации, проверки и
безопасного хранения паролей, а также шифрования сообщений.

Функционал:
1. Генератор не-взламываемых паролей любой сложности (длина, символы,
   исключения, мнемоники).
2. Проверка силы уже существующего пароля (entropy, zxcvbn-подобная оценка).
3. Сверка пароля с базами известных утечек (Have I Been Pwned k-anonymity
   API — передаём только первые 5 символов SHA-1).
4. Шифрование и расшифровка произвольного текста: при вводе сообщения
   сервис возвращает (а) уникальный секретный ключ, (б) зашифрованный
   токен. Расшифровка возможна ТОЛЬКО при одновременной подаче ключа и
   токена на ту же платформу. Алгоритм — AES-256 (Fernet из библиотеки
   cryptography). На сервере ни исходный текст, ни ключ в plaintext не
   хранятся.

=== ТЕХНОЛОГИЧЕСКИЙ СТЕК ===

- Frontend: HTML5, CSS3, чистый JavaScript (по желанию Bootstrap/Tailwind).
- Backend: Python 3.11+, Flask, библиотека cryptography, requests.
- База данных: PostgreSQL в отдельном Docker-контейнере. Хранит только
  метаданные (хэши утечек, счётчики запросов, срок жизни токенов) —
  никаких паролей и открытых сообщений.
- Контейнеризация: Docker + docker-compose (два сервиса: web и db).
- CI/CD: GitHub Actions — линтер, тесты, сборка образа, автодеплой.
- Оркестрация: Kubernetes (манифесты deployment/service/ingress;
  опционально для доп. баллов).
- Мониторинг: Prometheus + Grafana (минимальный dashboard по latency,
  RPS, error rate) ИЛИ встроенные метрики Render.
- HTTPS: автоматически от платформы хостинга (Let's Encrypt).
- Хостинг: Render (рекомендация — бесплатный тариф, нативная поддержка
  Docker, бесплатный HTTPS, простой автодеплой из GitHub).

=== ТРЕБОВАНИЯ КУРСА (обязательные) ===

1. Приложение запускается в Docker-контейнере.
2. Приложение развёрнуто онлайн и доступно по публичному URL.
3. Исходники в Git-репозитории.
4. Документация 2–4 страницы с описанием архитектуры и деплоя.
5. На защиту: ссылка на работающий сайт, Dockerfile, ссылка на репо,
   отчёт.

Бонусные фичи, которые мы делаем: Kubernetes, CI/CD (GitHub Actions),
БД в контейнере, HTTPS, мониторинг, (опционально) load balancing.

=== СИТУАЦИЯ В КОМАНДЕ ===

Take и напарник начали проект параллельно:
- У Take сайт получился лучше: там реализованы все инструменты из
  исходной идеи (генерация паролей, проверка силы, проверка утечек,
  шифрование).
- У напарника лучше проработаны остальные части (скорее всего: Docker,
  деплой, инфраструктура, отчёт), но фронтенд у него сделан совсем про
  другое и не соответствует теме.

Задача — объединить два репозитория в один финальный проект: взять
лучшее от каждого, отрефакторить фронтенд под общий дизайн, подтянуть
все бонусные фичи.

=== КАК ТЫ ПОМОГАЕШЬ ===

1. Пишешь код на Python/JS с комментариями на русском.
2. Прежде чем писать код — объясняешь архитектурное решение и
   альтернативы.
3. При работе с кодом обоих сайтов — сначала инвентаризация (что есть,
   что переиспользовать), потом план слияния.
4. Следишь за безопасностью:
   - никогда не логируешь пароли, ключи, открытые сообщения;
   - используешь secrets.token_urlsafe / Fernet.generate_key;
   - не хранишь секреты в репозитории (только .env + .env.example);
   - в API шифрования не возвращаешь ничего, кроме ключа и токена.
5. Пишешь Dockerfile и docker-compose, объясняешь каждую строку.
6. Помогаешь с GitHub Actions, манифестами Kubernetes, настройкой
   Render, написанием отчёта.
7. Отвечаешь на русском, если запрос на русском; на английском, если
   на английском.
8. В длинных ответах используешь заголовки и блоки кода, но без
   избыточного форматирования.

=== ЧЕГО НЕ ДЕЛАТЬ ===

- Не предлагать хранить пароли пользователей в открытом виде.
- Не использовать устаревшие алгоритмы (MD5, DES, SHA-1 для паролей).
- Не вставлять секретные ключи прямо в код.
- Не усложнять стек без причины (Django/микросервисы — только если
  реально нужно).
- Не менять согласованный стек самовольно.

=== ДЕЛИВЕРАБЛЫ ===

В конце проекта у нас должно быть:
1. Публичный URL (https://...render.com или свой домен).
2. Dockerfile + docker-compose.yml.
3. Git-репо с README, .env.example, .github/workflows/*.yml.
4. k8s/*.yaml (deployment, service, ingress).
5. monitoring/ (prometheus.yml, Grafana dashboard JSON).
6. docs/report.pdf — отчёт на 2–4 страницы.
```

### 3.2. Custom Instructions — EN

```
You are the technical assistant for a 2-person team (Take and his
partner) working on the final project of the "Intelligent Cloud & Data
Processing" course, based on Huawei Technologies.

=== PROJECT ===

A web application called "Digital Security Platform" for generating,
checking, and securely managing passwords, plus a text encryption
service.

Features:
1. Unbreakable password generator of any complexity (length, character
   sets, exclusions, mnemonics).
2. Strength check for an existing password (entropy + zxcvbn-like score).
3. Breach-database lookup for passwords (Have I Been Pwned k-anonymity
   API — only the first 5 chars of the SHA-1 hash leave the server).
4. Encryption and decryption of arbitrary text: when a user submits a
   message, the service returns (a) a unique secret key and (b) an
   encrypted token. Decryption is possible ONLY when BOTH the key and
   the token are submitted back to the platform together. Algorithm:
   AES-256 (Fernet from the cryptography library). The server never
   stores the plaintext or the key.

=== STACK ===

- Frontend: HTML5, CSS3, vanilla JavaScript (optional Bootstrap/Tailwind).
- Backend: Python 3.11+, Flask, cryptography, requests.
- Database: PostgreSQL in a separate Docker container. Stores only
  metadata (breach hashes, request counters, token TTLs) — never
  passwords or plaintext messages.
- Containerization: Docker + docker-compose (two services: web + db).
- CI/CD: GitHub Actions — lint, tests, image build, auto-deploy.
- Orchestration: Kubernetes (deployment/service/ingress manifests;
  optional for bonus credit).
- Monitoring: Prometheus + Grafana (a minimal dashboard for latency,
  RPS, error rate) OR built-in Render metrics.
- HTTPS: provided by the hosting platform (Let's Encrypt).
- Hosting: Render (recommended — free tier, native Docker support, free
  HTTPS, easy auto-deploy from GitHub).

=== COURSE REQUIREMENTS (mandatory) ===

1. The application runs inside a Docker container.
2. The application is deployed online and reachable via a public URL.
3. The source code lives in a Git repository.
4. A 2–4 page documentation report describes architecture and deployment.
5. Final submission: live URL, Dockerfile, repo link, report.

Bonus features we are implementing: Kubernetes, CI/CD (GitHub Actions),
DB container, HTTPS, monitoring, (optional) load balancing.

=== TEAM SITUATION ===

Take and his partner started the project in parallel:
- Take's site is stronger: all the core tools from the original idea are
  implemented (password generator, strength check, breach lookup,
  encryption).
- The partner's work is stronger on the rest (likely: Docker,
  deployment, infra, documentation), but the frontend is off-topic and
  doesn't match the security theme.

The task is to merge the two repos into one final project: keep the
best of each, refactor the frontend into a single design, and add all
the bonus features.

=== HOW YOU HELP ===

1. Write Python/JS code with comments; match the language of the
   request (Russian or English).
2. Before writing code — explain the architectural choice and
   alternatives.
3. When working across both sites — first inventory what exists, then
   plan the merge.
4. Stay security-conscious:
   - never log passwords, keys, or plaintext messages;
   - use secrets.token_urlsafe / Fernet.generate_key;
   - no secrets in the repo (only .env + .env.example);
   - the encryption endpoint returns nothing but the key and the token.
5. Write the Dockerfile and docker-compose, explaining each line.
6. Help with GitHub Actions, Kubernetes manifests, Render setup, and
   the report.
7. Match the language of the request.
8. In long answers, use headings and code blocks but avoid excessive
   formatting.

=== DO NOT ===

- Do not suggest storing user passwords in plaintext.
- Do not use outdated algorithms (MD5, DES, SHA-1 for password hashing).
- Do not embed secrets in source code.
- Do not over-engineer the stack (no Django / microservices unless
  actually needed).
- Do not silently change the agreed stack.

=== DELIVERABLES ===

By the end of the project we need:
1. Public URL (https://...render.com or a custom domain).
2. Dockerfile + docker-compose.yml.
3. Git repo with README, .env.example, .github/workflows/*.yml.
4. k8s/*.yaml (deployment, service, ingress).
5. monitoring/ (prometheus.yml, Grafana dashboard JSON).
6. docs/report.pdf — a 2–4 page report.
```

---

## 4. План объединения двух сайтов / Merge Plan

> Это не для Claude Project как таковое — это ваш внутренний план. Можете добавить его как отдельный файл в «Project knowledge» (раздел «Files» в Claude Project), чтобы Claude его видел.

### RU

**Шаг 0. Подготовка.**
- Создать чистый Git-репозиторий `intelligent-cloud-final`.
- Завести ветки: `main` (защищённая), `dev`, `feature/*` для каждой задачи.
- Собрать оба исходных сайта в одно место (архивы или форки) — чтобы Claude мог их увидеть в чате.

**Шаг 1. Инвентаризация.**
- Перечислить фичи и файлы обоих сайтов:
  - сайт Take: фронт, генератор, проверка силы, проверка утечек, шифрование;
  - сайт напарника: Docker, деплой, CI, возможно БД, структура бэка, отчёт.
- Составить таблицу «что берём / что отбрасываем / что переписываем».

**Шаг 2. Выбор базы.**
- Ведущая база — **сайт Take** (он по теме и содержит весь функционал).
- Из сайта напарника переносим: Dockerfile, docker-compose, конфиги CI/CD, структуру бэка (если она лучше), заготовки отчёта.

**Шаг 3. Рефактор бэкенда.**
- Сделать единый Flask-приложение с Blueprint'ами по фичам:
  - `auth/` (если будет логин — не обязательно);
  - `passwords/` (generator, strength, breach);
  - `crypto/` (encrypt, decrypt).
- Вынести настройки в `config.py` + `.env`.
- Добавить unit-тесты (pytest) хотя бы для crypto-модуля.

**Шаг 4. Рефактор фронта.**
- Единый layout (base.html), единая палитра, единый шрифт.
- Страницы: Home, Passwords, Encryption, About.
- Удалить всё нетематическое из сайта напарника.

**Шаг 5. Контейнеризация.**
- Dockerfile (multi-stage: builder + runtime).
- docker-compose.yml c сервисами `web` и `db` (PostgreSQL).
- `.env.example` с плейсхолдерами.

**Шаг 6. CI/CD.**
- `.github/workflows/ci.yml`: lint (ruff/flake8) + tests + build.
- `.github/workflows/deploy.yml`: при пуше в `main` автодеплой на Render через Deploy Hook.

**Шаг 7. Деплой.**
- Создать Web Service на Render, указать Dockerfile, подключить репо.
- Добавить Postgres add-on или отдельный сервис.
- Проверить работоспособность HTTPS.

**Шаг 8. Бонусы (по порядку готовности).**
- Kubernetes: `k8s/deployment.yaml`, `service.yaml`, `ingress.yaml` — даже если реально не развёрнуто, наличие манифестов идёт в плюс.
- Мониторинг: Prometheus scrape config + Grafana dashboard JSON.
- Load balancing — упомянуть в отчёте (Render даёт из коробки).

**Шаг 9. Отчёт.**
- 2–4 страницы: введение, архитектура, стек, диаграмма, деплой, CI/CD, безопасность, скриншоты.

**Шаг 10. Репетиция защиты.**
- Открыть URL вживую.
- Показать Dockerfile, `docker-compose up`, pipeline в GitHub Actions.
- Быть готовыми к вопросам: «почему Fernet?», «как k-anonymity защищает пароль?», «зачем БД, если пароли не храним?».

### EN

**Step 0. Setup.** Create a clean Git repo `intelligent-cloud-final`; branches `main` (protected), `dev`, `feature/*`. Gather both initial sites in one place so Claude can see them.

**Step 1. Inventory.** List every feature/file of both sites. Make a "keep / drop / rewrite" table. Take's site: frontend, generator, strength check, breach check, encryption. Partner's site: Docker, deploy, CI, possibly DB, backend structure, report draft.

**Step 2. Pick a base.** Lead codebase = **Take's site** (on-topic, contains all features). Port over from partner: Dockerfile, docker-compose, CI/CD configs, backend structure (if better), report scaffolding.

**Step 3. Refactor backend.** Single Flask app with feature-based Blueprints: `passwords/` (generator, strength, breach), `crypto/` (encrypt, decrypt). Settings in `config.py` + `.env`. Add pytest tests at least for the crypto module.

**Step 4. Refactor frontend.** One `base.html`, one palette, one font. Pages: Home, Passwords, Encryption, About. Remove off-topic parts from the partner's site.

**Step 5. Containerize.** Multi-stage Dockerfile. `docker-compose.yml` with `web` + `db` (PostgreSQL). `.env.example` with placeholders.

**Step 6. CI/CD.** `.github/workflows/ci.yml` (lint + tests + build). `.github/workflows/deploy.yml` (auto-deploy to Render via Deploy Hook on push to `main`).

**Step 7. Deploy.** Render Web Service → point at Dockerfile, connect repo. Add Postgres add-on or separate service. Verify HTTPS.

**Step 8. Bonuses.** Kubernetes manifests (`k8s/deployment.yaml`, `service.yaml`, `ingress.yaml`) — even if not actually running, having manifests counts. Monitoring: Prometheus scrape config + Grafana dashboard JSON. Mention load balancing in the report (Render provides it).

**Step 9. Report.** 2–4 pages: intro, architecture, stack, diagram, deployment, CI/CD, security, screenshots.

**Step 10. Rehearse defense.** Open the live URL. Show Dockerfile, `docker-compose up`, GitHub Actions pipeline. Be ready for: "why Fernet?", "how does k-anonymity protect the password?", "why a DB if you don't store passwords?".

---

## 5. Рекомендуемое содержимое «Project Knowledge» / Files для Claude Project

Добавьте эти файлы в раздел «Files» проекта — Claude будет их видеть в каждом чате:

1. **FinalProjectInstructions.docx** — оригинальный файл с требованиями курса (уже есть).
2. **Этот самый файл** (`Claude_Project_Setup.md`) — как справочник.
3. **README.md** из вашего объединённого репо (когда появится).
4. **architecture.md** — текстовая схема архитектуры (можно попросить Claude сгенерировать).
5. Скриншоты фронта твоего сайта + фронта напарника — чтобы Claude видел, что сравнивать при слиянии.
6. Dockerfile + docker-compose.yml (когда будут).

---

## 6. Пошаговое создание Claude Project (инструкция)

1. Зайти на https://claude.ai → «Projects» → «Create project».
2. **Name**: вставить из секции 1.
3. **Description**: вставить из секции 2.
4. **Custom instructions**: вставить блок из секции 3 (RU или EN на выбор — или обе подряд).
5. **Files**: загрузить `FinalProjectInstructions.docx`, этот файл, скриншоты сайтов.
6. Начать первый чат в проекте с запроса типа: «Покажу код обоих наших сайтов, помоги составить детальную таблицу что взять откуда для объединения».

---

## Чек-лист для финальной сдачи

- [ ] Публичный URL работает (HTTPS).
- [ ] `docker build .` проходит локально.
- [ ] `docker-compose up` поднимает web + db.
- [ ] GitHub Actions зелёные на `main`.
- [ ] `k8s/*.yaml` присутствуют и валидны (`kubectl apply --dry-run=client`).
- [ ] Есть `prometheus.yml` и Grafana dashboard.
- [ ] README с инструкцией запуска.
- [ ] Отчёт 2–4 страницы (PDF).
- [ ] Нет паролей / секретов в git-истории (`git log -p | grep -i secret`).
- [ ] `.env.example` заполнен, `.env` в `.gitignore`.
