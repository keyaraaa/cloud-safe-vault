/* =================================================================
   Vault — client-side logic.
   Связывает UI с Flask REST API.
   ================================================================= */

async function postJSON(url, body) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body || {}),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg = data.error || `HTTP ${res.status}`;
        throw new Error(msg);
    }
    return data;
}

async function getJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

function $(id) { return document.getElementById(id); }

function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        if (!btn) return;
        const prev = btn.textContent;
        btn.textContent = "✓";
        setTimeout(() => { btn.textContent = prev; }, 1400);
    }).catch(() => alert("Копирование не удалось"));
}

document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-copy]");
    if (!btn) return;
    const target = $(btn.dataset.copy);
    if (target) copyToClipboard(target.textContent, btn);
});

function currentLang() {
    return document.documentElement.lang || "ru";
}

function t(key) {
    const dict = (window.I18N || {})[currentLang()] || {};
    return dict[key] || key;
}

// ================================================================
// Страница: ПАРОЛИ
// ================================================================

function initPasswordsPage() {
    const lengthSlider = $("gen-length");
    if (!lengthSlider) return;

    const lengthLabel = $("gen-length-value");
    lengthSlider.addEventListener("input", () => { lengthLabel.textContent = lengthSlider.value; });

    $("gen-run").addEventListener("click", async () => {
        try {
            const r = await postJSON("/api/passwords/generate", {
                length: Number(lengthSlider.value),
                use_lower: $("gen-lower").checked,
                use_upper: $("gen-upper").checked,
                use_digits: $("gen-digits").checked,
                use_symbols: $("gen-symbols").checked,
                exclude_similar: $("gen-exclude-similar").checked,
                exclude_chars: $("gen-exclude").value,
            });
            $("gen-password").textContent = r.password;
            $("gen-entropy").textContent = r.entropy_bits;
            $("gen-pool").textContent = r.pool_size;
            $("gen-result").hidden = false;
        } catch (e) {
            alert("Error: " + e.message);
        }
    });

    $("gen-copy").addEventListener("click", (e) => {
        copyToClipboard($("gen-password").textContent, e.currentTarget);
    });

    // ---- Passphrase ----
    const phrWords = $("phr-words");
    if (phrWords) {
        const phrWordsLbl = $("phr-words-value");
        phrWords.addEventListener("input", () => { phrWordsLbl.textContent = phrWords.value; });

        $("phr-run").addEventListener("click", async () => {
            try {
                const r = await postJSON("/api/passwords/passphrase", {
                    words: Number(phrWords.value),
                    separator: $("phr-sep").value,
                    append_digits: $("phr-digits").checked,
                });
                $("phr-output").textContent = r.passphrase;
                $("phr-entropy").textContent = r.entropy_bits;
                $("phr-result").hidden = false;
            } catch (e) {
                alert("Error: " + e.message);
            }
        });
        $("phr-copy").addEventListener("click", (e) => {
            copyToClipboard($("phr-output").textContent, e.currentTarget);
        });
    }

    // ---- Strength ----
    $("str-run").addEventListener("click", async () => {
        const password = $("str-input").value;
        if (!password) return;
        try {
            const r = await postJSON("/api/passwords/strength", { password });
            $("str-score").textContent = r.score;
            $("str-entropy").textContent = r.entropy_bits;
            $("str-length").textContent = r.length;
            $("str-bar").style.width = ((r.score / 4) * 100) + "%";

            const cr = $("str-crack");
            cr.innerHTML = "";
            for (const [k, v] of Object.entries(r.crack_times)) {
                const li = document.createElement("li");
                li.textContent = `${k}: ${v}`;
                cr.appendChild(li);
            }

            const fb = $("str-feedback");
            fb.innerHTML = "";
            if (r.feedback.warning) {
                const p = document.createElement("p");
                p.textContent = "⚠ " + r.feedback.warning;
                fb.appendChild(p);
            }
            for (const s of (r.feedback.suggestions || [])) {
                const p = document.createElement("p");
                p.textContent = "💡 " + s;
                fb.appendChild(p);
            }
            $("str-result").hidden = false;
        } catch (e) {
            alert("Error: " + e.message);
        }
    });

    // ---- Breach ----
    $("brc-run").addEventListener("click", async () => {
        const password = $("brc-input").value;
        if (!password) return;
        const status = $("brc-status");
        try {
            const r = await postJSON("/api/passwords/breach", { password });
            $("brc-prefix").textContent = r.prefix_sent;
            if (r.breached) {
                status.className = "status breach";
                status.textContent = `${t("pw.brc.breach")} ${r.count.toLocaleString()} ${t("pw.brc.times")}`;
            } else {
                status.className = "status safe";
                status.textContent = t("pw.brc.safe");
            }
            $("brc-result").hidden = false;
        } catch (e) {
            status.className = "status error";
            status.textContent = "Error: " + e.message;
            $("brc-result").hidden = false;
        }
    });
}

// ================================================================
// Страница: ШИФРОВАНИЕ
// ================================================================

// ================================================================
// Хранение токенов в localStorage
// ================================================================

const STORAGE_KEY = "vault_tokens";

function loadTokens() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
    catch { return []; }
}

function saveTokens(tokens) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

function addToken(entry) {
    const tokens = loadTokens();
    tokens.unshift(entry); // новые — вверху
    saveTokens(tokens);
}

function renderTokensList() {
    const section = $("my-tokens-section");
    const list = $("tokens-list");
    if (!section || !list) return;

    const tokens = loadTokens();
    if (tokens.length === 0) { section.hidden = true; return; }

    section.hidden = false;
    list.innerHTML = "";

    tokens.forEach((entry, idx) => {
        const card = document.createElement("div");
        card.style.cssText = "background:var(--bg-card,#1e1e2e);border:1px solid var(--border,#333);border-radius:8px;padding:1rem;cursor:pointer;transition:border-color .2s;";
        card.addEventListener("mouseenter", () => card.style.borderColor = "var(--accent,#7c6aed)");
        card.addEventListener("mouseleave", () => card.style.borderColor = "var(--border,#333)");

        const expired = new Date(entry.expires_at) < new Date();
        const label = entry.label || ("Запись #" + (idx + 1));
        const date = new Date(entry.created_at).toLocaleDateString();

        card.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;">
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:600;margin-bottom:0.25rem;">${label} ${expired ? '<span style="color:var(--accent-danger,#f87171);font-size:.8em;">(истёк)</span>' : ''}</div>
                    <div style="font-size:.8em;color:#888;">Зашифровано: ${date} · до ${new Date(entry.expires_at).toLocaleDateString()}</div>
                    <div style="font-size:.75em;color:#666;margin-top:.25rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">ID: ${entry.token_id}</div>
                </div>
                <div style="display:flex;gap:.5rem;flex-shrink:0;">
                    <button class="btn btn-ghost btn-small" data-idx="${idx}" data-action="fill">Подставить</button>
                    <button class="btn btn-ghost btn-small" data-idx="${idx}" data-action="delete" style="color:var(--accent-danger,#f87171);">✕</button>
                </div>
            </div>
        `;

        card.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-action]");
            if (!btn) return;
            const i = Number(btn.dataset.idx);
            const action = btn.dataset.action;
            if (action === "fill") {
                const tokens = loadTokens();
                $("dec-token").value = tokens[i].token_id;
                $("dec-key").value = tokens[i].key;
                $("dec-token").scrollIntoView({ behavior: "smooth", block: "center" });
            } else if (action === "delete") {
                const tokens = loadTokens();
                tokens.splice(i, 1);
                saveTokens(tokens);
                renderTokensList();
            }
        });

        list.appendChild(card);
    });
}

function initEncryptionPage() {
    const encBtn = $("enc-run");
    if (!encBtn) return;

    renderTokensList();

    encBtn.addEventListener("click", async () => {
        const text = $("enc-text").value;
        if (!text) return;
        try {
            const r = await postJSON("/api/crypto/encrypt", { text });
            $("enc-token").textContent = r.token_id;
            $("enc-key").textContent = r.key;
            $("enc-expires").textContent = r.expires_at;
            $("enc-result").hidden = false;

            // Сохраняем в localStorage
            addToken({
                token_id: r.token_id,
                key: r.key,
                expires_at: r.expires_at,
                label: $("enc-label").value.trim() || "",
                created_at: new Date().toISOString(),
            });
            renderTokensList();
        } catch (e) {
            alert("Error: " + e.message);
        }
    });

    $("dec-run").addEventListener("click", async () => {
        const token_id = $("dec-token").value.trim();
        const key = $("dec-key").value.trim();
        if (!token_id || !key) return;
        const out = $("dec-plaintext");
        try {
            const r = await postJSON("/api/crypto/decrypt", { token_id, key });
            out.textContent = r.plaintext;
            out.style.color = "";
            $("dec-result").hidden = false;
        } catch (e) {
            out.textContent = "⚠ " + e.message;
            out.style.color = "var(--accent-danger)";
            $("dec-result").hidden = false;
        }
    });

    const clearBtn = $("clear-tokens");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (confirm("Удалить все сохранённые записи?")) {
                localStorage.removeItem(STORAGE_KEY);
                renderTokensList();
            }
        });
    }
}

// ================================================================
// Страница: ABOUT (stats)
// ================================================================

async function initAboutPage() {
    const block = $("stats-block");
    if (!block) return;
    try {
        const r = await getJSON("/api/stats");
        if (r.tokens_total > 0) {
            $("stat-tokens").textContent = r.tokens_total.toLocaleString();
            if (r.since) {
                const d = new Date(r.since);
                $("stat-since").textContent = t("about.stats.since") + " " + d.toLocaleDateString();
            }
            block.hidden = false;
        }
    } catch (e) {
        // статистика недоступна — просто не показываем блок
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initPasswordsPage();
    initEncryptionPage();
    initAboutPage();
});
