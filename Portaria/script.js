// script.js - Sistema de Portaria (Login + Cadastro + Sessão)

// === FUNÇÕES DE GERENCIAMENTO DE DADOS ===
function carregarUsuarios() {
    const data = localStorage.getItem("usuarios");
    return data ? JSON.parse(data) : [];
}

function salvarUsuarios(usuarios) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function salvarSessao(email) {
    localStorage.setItem("usuarioLogado", email);
}

function limparSessao() {
    localStorage.removeItem("usuarioLogado");
}

function usuarioLogado() {
    return localStorage.getItem("usuarioLogado");
}

function codificarSenha(senha) {
    return btoa(encodeURIComponent(senha)); // Mais seguro com UTF-8
}

function decodificarSenha(senhaCodificada) {
    return decodeURIComponent(atob(senhaCodificada));
}

function mostrarAlerta(elemento, mensagem, cor = "#fff") {
    if (!elemento) return;
    elemento.style.display = "block";
    elemento.style.color = cor;
    elemento.textContent = mensagem;
    setTimeout(() => {
        elemento.style.display = "none";
    }, 3000);
}

// === CADASTRO ===
function fazerCadastro() {
    const email = document.getElementById("email")?.value.trim();
    const senha = document.getElementById("senha")?.value;
    const alerta = document.getElementById("alerta");

    if (!email || !senha) {
        mostrarAlerta(alerta, "Preencha todos os campos!", "red");
        return;
    }

    const usuarios = carregarUsuarios();

    if (usuarios.some(u => u.email === email)) {
        mostrarAlerta(alerta, "Este e-mail já está cadastrado!", "red");
        return;
    }

    usuarios.push({ email, senha: codificarSenha(senha) });
    salvarUsuarios(usuarios);

    mostrarAlerta(alerta, "Cadastro realizado com sucesso!", "#4CAF50");

    // Limpar campos
    document.getElementById("email").value = "";
    document.getElementById("senha").value = "";

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1200);
}

// === LOGIN ===
function fazerLogin() {
    const email = document.getElementById("usuario")?.value.trim();
    const senha = document.getElementById("senha")?.value;
    const alerta = document.getElementById("alerta");

    if (!email || !senha) {
        mostrarAlerta(alerta, "Preencha todos os campos!", "red");
        return;
    }

    const usuarios = carregarUsuarios();
    const usuario = usuarios.find(u => u.email === email && decodificarSenha(u.senha) === senha);

    if (usuario) {
        salvarSessao(email);
        mostrarAlerta(alerta, "Login realizado!", "#4CAF50");
        setTimeout(() => {
            window.location.href = "home.html";
        }, 1000);
    } else {
        mostrarAlerta(alerta, "Usuário ou senha incorretos!", "red");
    }
}

// === LOGOUT ===
function logout() {
    if (confirm("Deseja sair do sistema?")) {
        limparSessao();
        window.location.href = "index.html";
    }
}

// === VERIFICAÇÃO GLOBAL AO CARREGAR PÁGINA ===
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname.split("/").pop() || "index.html";

    // Proteção: se logado, não acessa login/cadastro
    if (usuarioLogado() && (path === "index.html" || path === "cadastro.html")) {
        window.location.href = "home.html";
    }

    // Proteção: se NÃO logado, não acessa home
    if (!usuarioLogado() && path === "home.html") {
        alert("Faça login para continuar.");
        window.location.href = "index.html";
    }

    // Links dinâmicos
    document.querySelectorAll(".login-link a, .cadastro-link a").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = link.getAttribute("href");
        });
    });
});
        AOS.init({ duration: 1000, once: true });

        // Header scroll
        window.addEventListener('scroll', () => {
            document.querySelector('header').classList.toggle('scrolled', window.scrollY > 50);
        });

        // Ativar link ativo
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Usuário
        document.addEventListener("DOMContentLoaded", () => {
            const email = usuarioLogado();
            if (email) {
                document.getElementById("user-email").textContent = email;
                document.getElementById("user-avatar").textContent = email[0].toUpperCase();
            }

            // === ACESSIBILIDADE PERSONALIZADA ===
            const btn = document.getElementById("accessibility-btn");
            const menu = document.getElementById("accessibility-menu");
            const options = document.querySelectorAll(".accessibility-option");

            btn.addEventListener("click", () => {
                const expanded = btn.getAttribute("aria-expanded") === "true";
                btn.setAttribute("aria-expanded", !expanded);
                menu.classList.toggle("show");
            });

            options.forEach(opt => {
                opt.addEventListener("click", () => selectAccessibility(opt.dataset.mode));
                opt.addEventListener("keydown", (e) => { if (e.key === "Enter") selectAccessibility(opt.dataset.mode); });
            });

            function selectAccessibility(mode) {
                document.body.setAttribute("data-accessibility", mode);
                localStorage.setItem("accessibilityMode", mode);

                options.forEach(o => o.classList.remove("active"));
                document.querySelector(`[data-mode="${mode}"]`).classList.add("active");

                const nomes = {
                    "default": "Modo padrão ativado",
                    "high-contrast": "Alto contraste para baixa visão ativado",
                    "protanopia": "Modo Protanopia ativado",
                    "deuteranopia": "Modo Deuteranopia ativado",
                    "tritanopia": "Modo Tritanopia ativado"
                };
                mostrarToast(nomes[mode]);
                falar(nomes[mode]);

                menu.classList.remove("show");
                btn.setAttribute("aria-expanded", "false");
            }

            const saved = localStorage.getItem("accessibilityMode") || "default";
            selectAccessibility(saved);

            document.addEventListener("click", (e) => {
                if (!btn.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.remove("show");
                    btn.setAttribute("aria-expanded", "false");
                }
            });
        });

        function mostrarToast(msg, type = "success") {
            const toast = document.getElementById("toast");
            document.getElementById("toast-message").textContent = msg;
            toast.className = type;
            toast.classList.add("show");
            falar(msg);
            setTimeout(() => toast.classList.remove("show"), 3000);
        }

        function falar(texto) {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(texto);
                utterance.lang = 'pt-BR';
                utterance.rate = 0.9;
                speechSynthesis.speak(utterance);
            }
        }

        function irParaDashboard() {
            mostrarToast("Redirecionando para o Dashboard...");
            setTimeout(() => window.location.href = "dashboard.html", 1500);
        }

      