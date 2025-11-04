// js/main.js
document.addEventListener("DOMContentLoaded", () => {
    // === ACESSIBILIDADE ===
    const saved = localStorage.getItem("accessibilityMode") || "default";
    document.body.setAttribute("data-accessibility", saved);
    document.querySelector(`[data-mode="${saved}"]`)?.classList.add("active");

    const btn = document.getElementById("accessibility-btn");
    const menu = document.getElementById("accessibility-menu");

    if (btn && menu) {
        btn.addEventListener("click", () => {
            const expanded = btn.getAttribute("aria-expanded") === "true";
            btn.setAttribute("aria-expanded", !expanded);
            menu.classList.toggle("show");
        });

        document.querySelectorAll(".accessibility-option").forEach(opt => {
            opt.addEventListener("click", () => setMode(opt.dataset.mode));
            opt.addEventListener("keydown", e => e.key === "Enter" && setMode(opt.dataset.mode));
        });

        document.addEventListener("click", e => {
            if (!btn.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove("show");
                btn.setAttribute("aria-expanded", "false");
            }
        });
    }

    window.setMode = (mode) => {
        document.body.setAttribute("data-accessibility", mode);
        localStorage.setItem("accessibilityMode", mode);
        document.querySelectorAll(".accessibility-option").forEach(o => o.classList.remove("active"));
        document.querySelector(`[data-mode="${mode}"]`).classList.add("active");
        const msgs = {
            default: "Modo padrão ativado",
            "high-contrast": "Alto contraste ativado",
            protanopia: "Modo Protanopia ativado",
            deuteranopia: "Modo Deuteranopia ativado",
            tritanopia: "Modo Tritanopia ativado"
        };
        mostrarToast(msgs[mode]);
        falar(msgs[mode]);
        menu.classList.remove("show");
        btn.setAttribute("aria-expanded", "false");
    };

    // === TOAST ===
    window.mostrarToast = (msg, type = "success") => {
        let toast = document.getElementById("toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast"; toast.innerHTML = `<span>${msg}</span>`;
            document.body.appendChild(toast);
        } else toast.querySelector("span").textContent = msg;
        toast.style.background = type === "danger" ? "var(--danger)" : "var(--success)";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    };

    // === VOZ ===
    window.falar = (texto) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(texto);
            utterance.lang = 'pt-BR'; utterance.rate = 0.9;
            speechSynthesis.speak(utterance);
        }
    };
});