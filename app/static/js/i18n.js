/* =================================================================
   i18n: простой клиентский переключатель языков RU/EN.
   Хранит выбор в cookie, применяет переводы по data-i18n атрибуту.
   ================================================================= */

const I18N = {
    ru: {
        "title.home":        "Vault — пароли и шифрование",
        "title.passwords":   "Vault · пароли",
        "title.encryption":  "Vault · шифрование",
        "title.about":       "Vault · о проекте",

        "nav.home":          "Главная",
        "nav.passwords":     "Пароли",
        "nav.encryption":    "Шифрование",
        "nav.about":         "О проекте",

        "footer.line1":      "Vault · пет-проект, написанный в свободное время",
        "footer.line2":      "Fernet · HIBP k-anonymity · Docker · PostgreSQL",

        /* ---------- Home ---------- */
        "home.pill":         "открытый код",
        "home.title":        "Пароли и шифрование. В одном месте.",
        "home.subtitle":     "Без регистрации. Пароли не хранятся и не уходят в сторонние сервисы.",
        "home.lead":         "Генератор паролей и парольных фраз, оценка силы, проверка по базам утечек и шифрование текста с одноразовым ключом — на одной странице.",
        "home.cta.primary":  "Открыть генератор",
        "home.cta.ghost":    "Зашифровать текст",

        "home.features.heading": "Что внутри",
        "home.f1.title": "Генератор паролей",
        "home.f1.desc":  "Длина 6–64, наборы символов, исключение похожих (I/l/1, O/0). Считает реальную энтропию в битах.",
        "home.f2.title": "Парольная фраза",
        "home.f2.desc":  "Несколько слов + цифры, стиль correct-horse-battery-42. Запоминается, а подбирать — всё равно годы.",
        "home.f3.title": "Проверка силы",
        "home.f3.desc":  "Скор 0–4 по zxcvbn + примерное время подбора. Показывает что конкретно не так.",
        "home.f4.title": "Проверка утечек",
        "home.f4.desc":  "Через Have I Been Pwned. Но k-anonymity: наружу уходит только первые 5 символов SHA-1. Сам пароль остаётся у вас.",
        "home.f5.title": "Шифрование текста",
        "home.f5.desc":  "AES-256 (Fernet). На выходе — token_id и одноразовый ключ. Без обоих одновременно расшифровать нельзя.",
        "home.f6.title": "Ничего не хранится",
        "home.f6.desc":  "Никаких паролей, никакого plaintext. В БД — только зашифрованные токены с TTL 24 часа.",

        "home.why.heading": "Почему это не просто ещё один сайт",
        "home.why.1": "Пароль для проверки утечек никогда не покидает сервер. В интернет уходит только префикс его хэша.",
        "home.why.2": "Ключ шифрования генерируется на сервере, отдаётся вам один раз и тут же забывается. Без ключа никто — включая меня — расшифровать не сможет.",
        "home.why.3": "Код открыт, Dockerfile лежит в репозитории. Можно посмотреть, как что устроено, и поднять у себя.",

        /* ---------- Passwords page ---------- */
        "pw.heading":    "Пароли",
        "pw.lead":       "Генерация, оценка силы и проверка по базам утечек.",

        "pw.gen.title":  "Генератор",
        "pw.gen.length": "Длина:",
        "pw.gen.classes": "Классы символов",
        "pw.gen.lower":  "a–z",
        "pw.gen.upper":  "A–Z",
        "pw.gen.digits": "0–9",
        "pw.gen.symbols": "символы",
        "pw.gen.similar": "исключить похожие (I/l/1/O/0)",
        "pw.gen.exclude": "Исключить свои символы:",
        "pw.gen.excludePh": "например {}[]",
        "pw.gen.run":    "Сгенерировать",
        "pw.gen.entropy": "Энтропия:",
        "pw.gen.entropyUnit": "бит",
        "pw.gen.pool":   "Алфавит:",
        "pw.gen.copy":   "Копировать",

        "pw.phrase.title": "Парольная фраза",
        "pw.phrase.words": "Слов:",
        "pw.phrase.sep":   "Разделитель:",
        "pw.phrase.digits": "Добавить цифры в конце",
        "pw.phrase.run":   "Сгенерировать фразу",

        "pw.str.title":  "Оценка силы",
        "pw.str.label":  "Ваш пароль:",
        "pw.str.ph":     "введите пароль для анализа",
        "pw.str.run":    "Проверить",
        "pw.str.score":  "Скор:",
        "pw.str.entropy": "Энтропия:",
        "pw.str.length": "длина",
        "pw.str.crack":  "Время взлома (оценки)",

        "pw.brc.title":  "Проверка на утечки (HIBP)",
        "pw.brc.note":   "Наружу уходит только первые 5 символов SHA-1 от пароля. Сам пароль не покидает сервер.",
        "pw.brc.label":  "Пароль:",
        "pw.brc.ph":     "пароль для проверки",
        "pw.brc.run":    "Проверить утечки",
        "pw.brc.prefix": "Отправлен префикс:",
        "pw.brc.safe":   "✅ Пароль не обнаружен в известных утечках",
        "pw.brc.breach": "❌ Пароль найден в утечках:",
        "pw.brc.times":  "раз",

        /* ---------- Encryption page ---------- */
        "enc.heading":   "Шифрование текста",
        "enc.lead":      "Для расшифровки нужны одновременно token_id и секретный ключ. Сервер не хранит ни plaintext, ни ключ.",

        "enc.box.title": "Зашифровать",
        "enc.box.label": "Сообщение:",
        "enc.box.ph":    "введите текст для шифрования",
        "enc.box.run":   "Зашифровать",
        "enc.box.warn":  "⚠ Сохраните оба значения. Ключ показывается один раз и нигде не хранится.",
        "enc.box.token": "Token ID:",
        "enc.box.key":   "Секретный ключ:",
        "enc.box.expires": "Срок действия:",
        "enc.box.copy":  "Копировать",

        "dec.title":     "Расшифровать",
        "dec.token":     "Token ID:",
        "dec.tokenPh":   "вставьте token_id",
        "dec.key":       "Секретный ключ:",
        "dec.keyPh":     "вставьте ключ",
        "dec.run":       "Расшифровать",
        "dec.result":    "Расшифрованный текст:",

        /* ---------- About page ---------- */
        "about.heading": "О Vault",
        "about.lead":    "Пет-проект, который вырос из лабы по контейнерам и облакам — и которым я в итоге пользуюсь сам.",

        "about.what.h":  "Что делает",
        "about.what.p":  "Четыре вещи, которые обычно разбросаны по разным сайтам сомнительного качества: генератор паролей, оценка силы, проверка на утечки и разовое шифрование текста. Всё на одной странице, без регистрации и без того, чтобы ваши данные где-то сохранялись.",

        "about.why.h":   "Зачем я это делал",
        "about.why.1":   "Надоело гуглить «генератор паролей» и гадать, не утекает ли он куда на бэкенд.",
        "about.why.2":   "Хотелось на живом примере разобраться с Fernet, HIBP k-anonymity и как вообще грамотно работать с секретами в коде.",
        "about.why.3":   "Нужно было что-то сдавать за лабу. Но хотелось сделать так, чтобы получилось не «чтобы сдать», а «чтобы пользоваться».",

        "about.stack.h": "Под капотом",
        "about.stack.1": "Бэк — Python / Flask. Фронт — HTML/CSS/ванильный JS.",
        "about.stack.2": "Хранилище — PostgreSQL в отдельном Docker-контейнере. В БД только зашифрованные токены с TTL 24 часа. Никакого plaintext.",
        "about.stack.3": "Запакован в Docker, один файл docker-compose поднимает web + db.",
        "about.stack.4": "Задеплоен на Render, с автодеплоем через GitHub Actions на каждый push в main.",
        "about.stack.5": "Метрики latency/RPS/error rate через Prometheus-экспортер Flask. Готов Grafana dashboard на случай если кто-то захочет мониторить.",
        "about.stack.6": "На будущее — в репо лежат Kubernetes-манифесты (deployment/service/ingress). Пока не развёрнуто, но работает «из коробки» если поднять кластер.",

        "about.nodo.h":  "Чего здесь нет",
        "about.nodo.1":  "Регистрации и аккаунтов. Вам ничего не нужно создавать.",
        "about.nodo.2":  "Логов с паролями и plaintext. Такого просто не пишется в код.",
        "about.nodo.3":  "Небезопасных алгоритмов (MD5, DES). SHA-1 используется только для HIBP — это часть их протокола, наши пароли через SHA-1 не хэшируются.",
        "about.nodo.4":  "Рекламы, трекеров, cookie-banner'ов. Единственный cookie — это ваш выбор языка.",

        "about.stats.h":    "Немного статистики",
        "about.stats.tokens": "токенов зашифровано",
        "about.stats.since":  "с запуска",

        "about.course.h": "Формально",
        "about.course.p": "Финальный проект курса «Intelligent Cloud & Data Processing» на базе Huawei Technologies. Код и документация — в репозитории."
    },

    en: {
        "title.home":        "Vault — passwords & encryption",
        "title.passwords":   "Vault · passwords",
        "title.encryption":  "Vault · encryption",
        "title.about":       "Vault · about",

        "nav.home":          "Home",
        "nav.passwords":     "Passwords",
        "nav.encryption":    "Encryption",
        "nav.about":         "About",

        "footer.line1":      "Vault · a side project, built in spare time",
        "footer.line2":      "Fernet · HIBP k-anonymity · Docker · PostgreSQL",

        "home.pill":         "open source",
        "home.title":        "Passwords and encryption. In one place.",
        "home.subtitle":     "No signup. Passwords aren't stored and aren't sent to third-party services.",
        "home.lead":         "Password generator and passphrases, strength scoring, breach lookups and one-shot text encryption — all on a single page.",
        "home.cta.primary":  "Open generator",
        "home.cta.ghost":    "Encrypt text",

        "home.features.heading": "What's inside",
        "home.f1.title": "Password generator",
        "home.f1.desc":  "Length 6–64, character classes, exclusion of look-alikes (I/l/1, O/0). Shows real entropy in bits.",
        "home.f2.title": "Memorable passphrase",
        "home.f2.desc":  "Words + digits in the correct-horse-battery-42 style. Easy to remember, still painful to brute-force.",
        "home.f3.title": "Strength check",
        "home.f3.desc":  "zxcvbn score 0–4 plus estimated crack time. Tells you exactly what's weak.",
        "home.f4.title": "Breach check",
        "home.f4.desc":  "Via Have I Been Pwned — but using k-anonymity. Only the first 5 chars of SHA-1 leave the server; your password stays put.",
        "home.f5.title": "Text encryption",
        "home.f5.desc":  "AES-256 (Fernet). You get a token_id and a one-shot key. Without both, decryption is impossible.",
        "home.f6.title": "Nothing is stored",
        "home.f6.desc":  "No passwords, no plaintext ever. The DB only holds encrypted tokens with a 24-hour TTL.",

        "home.why.heading": "Why this isn't just another site",
        "home.why.1": "The password you check against HIBP never leaves the server — only a prefix of its hash.",
        "home.why.2": "The encryption key is generated server-side, handed to you once, and immediately forgotten. Nobody — including me — can decrypt without it.",
        "home.why.3": "The code is open and the Dockerfile is in the repo. You can read it end-to-end and host your own instance.",

        "pw.heading":    "Passwords",
        "pw.lead":       "Generation, strength scoring and breach lookups.",

        "pw.gen.title":  "Generator",
        "pw.gen.length": "Length:",
        "pw.gen.classes": "Character classes",
        "pw.gen.lower":  "a–z",
        "pw.gen.upper":  "A–Z",
        "pw.gen.digits": "0–9",
        "pw.gen.symbols": "symbols",
        "pw.gen.similar": "exclude look-alikes (I/l/1/O/0)",
        "pw.gen.exclude": "Exclude your own chars:",
        "pw.gen.excludePh": "e.g. {}[]",
        "pw.gen.run":    "Generate",
        "pw.gen.entropy": "Entropy:",
        "pw.gen.entropyUnit": "bits",
        "pw.gen.pool":   "Alphabet:",
        "pw.gen.copy":   "Copy",

        "pw.phrase.title": "Memorable passphrase",
        "pw.phrase.words": "Words:",
        "pw.phrase.sep":   "Separator:",
        "pw.phrase.digits": "Append digits",
        "pw.phrase.run":   "Generate passphrase",

        "pw.str.title":  "Strength check",
        "pw.str.label":  "Your password:",
        "pw.str.ph":     "enter a password to analyse",
        "pw.str.run":    "Check",
        "pw.str.score":  "Score:",
        "pw.str.entropy": "Entropy:",
        "pw.str.length": "length",
        "pw.str.crack":  "Estimated crack time",

        "pw.brc.title":  "Breach lookup (HIBP)",
        "pw.brc.note":   "Only the first 5 chars of SHA-1 leave the server. Your password never does.",
        "pw.brc.label":  "Password:",
        "pw.brc.ph":     "password to check",
        "pw.brc.run":    "Check breaches",
        "pw.brc.prefix": "Prefix sent:",
        "pw.brc.safe":   "✅ Not seen in any known breach",
        "pw.brc.breach": "❌ Found in breaches:",
        "pw.brc.times":  "times",

        "enc.heading":   "Text encryption",
        "enc.lead":      "To decrypt you need BOTH the token_id and the secret key. The server stores neither plaintext nor key.",

        "enc.box.title": "Encrypt",
        "enc.box.label": "Message:",
        "enc.box.ph":    "enter text to encrypt",
        "enc.box.run":   "Encrypt",
        "enc.box.warn":  "⚠ Save both values. The key is shown only once and is never stored anywhere.",
        "enc.box.token": "Token ID:",
        "enc.box.key":   "Secret key:",
        "enc.box.expires": "Expires at:",
        "enc.box.copy":  "Copy",

        "dec.title":     "Decrypt",
        "dec.token":     "Token ID:",
        "dec.tokenPh":   "paste token_id",
        "dec.key":       "Secret key:",
        "dec.keyPh":     "paste key",
        "dec.run":       "Decrypt",
        "dec.result":    "Decrypted text:",

        "about.heading": "About Vault",
        "about.lead":    "A side project that started as a uni lab on containers and the cloud — and that I ended up actually using.",

        "about.what.h":  "What it does",
        "about.what.p":  "Four things that are usually scattered across sketchy websites: password generation, strength scoring, breach lookup, and one-shot text encryption. All on a single site, no signup, no data saved anywhere.",

        "about.why.h":   "Why I built it",
        "about.why.1":   "I got tired of googling \"password generator\" and wondering what's happening on the backend.",
        "about.why.2":   "I wanted a hands-on excuse to learn Fernet, HIBP k-anonymity, and how to handle secrets properly in code.",
        "about.why.3":   "I needed something to submit for a cloud-computing lab. But I wanted the result to be \"useful\", not just \"submitted\".",

        "about.stack.h": "Under the hood",
        "about.stack.1": "Backend — Python / Flask. Frontend — plain HTML/CSS/vanilla JS.",
        "about.stack.2": "Storage — PostgreSQL in its own Docker container. Only encrypted tokens with a 24h TTL. Zero plaintext.",
        "about.stack.3": "Packaged in Docker, one docker-compose file brings up web + db.",
        "about.stack.4": "Deployed on Render, auto-deployed via GitHub Actions on every push to main.",
        "about.stack.5": "Latency/RPS/error-rate metrics via the Prometheus Flask exporter. A Grafana dashboard is ready if someone wants to wire it up.",
        "about.stack.6": "Future-proofing — Kubernetes manifests (deployment/service/ingress) live in the repo. Not deployed yet, but ready to apply.",

        "about.nodo.h":  "What's NOT here",
        "about.nodo.1":  "No signup, no accounts. There's nothing to register.",
        "about.nodo.2":  "No logs of passwords or plaintext. That simply never gets written.",
        "about.nodo.3":  "No broken crypto (MD5, DES). SHA-1 is used only for HIBP — part of their protocol — never for password hashing here.",
        "about.nodo.4":  "No ads, no trackers, no cookie banners. The only cookie is your language choice.",

        "about.stats.h":    "A bit of stats",
        "about.stats.tokens": "tokens encrypted",
        "about.stats.since":  "since launch",

        "about.course.h": "For the record",
        "about.course.p": "Final project for the \"Intelligent Cloud & Data Processing\" course at Huawei Technologies. Source code and docs are in the repo."
    }
};

function detectDefaultLang() {
    const m = document.cookie.match(/vault_lang=([a-z]{2})/);
    if (m) return m[1];
    return navigator.language && navigator.language.toLowerCase().startsWith("ru") ? "ru" : "en";
}

function setLang(lang) {
    if (!I18N[lang]) return;
    document.cookie = `vault_lang=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`;
    document.documentElement.lang = lang;
    applyLang(lang);
    const btn = document.getElementById("lang-current");
    if (btn) btn.textContent = lang.toUpperCase();
}

function applyLang(lang) {
    const dict = I18N[lang] || I18N.ru;

    // Текстовое содержимое
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key] !== undefined) el.textContent = dict[key];
    });

    // Плейсхолдеры у input/textarea
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
    });

    // Title страницы (если прописан data-i18n на <title>)
    const titleEl = document.querySelector("title[data-i18n]");
    if (titleEl) {
        const key = titleEl.getAttribute("data-i18n");
        if (dict[key] !== undefined) document.title = dict[key];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const lang = detectDefaultLang();
    setLang(lang);

    const toggle = document.getElementById("lang-toggle");
    if (toggle) {
        toggle.addEventListener("click", () => {
            const current = document.documentElement.lang || "ru";
            setLang(current === "ru" ? "en" : "ru");
        });
    }
});
