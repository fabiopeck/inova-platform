* ===============================
   COOKIE BANNER (LGPD)
=============================== */

function showCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    // só mostra se ainda não foi aceito
    const consent = localStorage.getItem('cookiesAccepted');
    if (!consent) {
        banner.style.display = "block";
    }

    // botão de aceitar
    const btn = document.getElementById('accept-cookies');
    if (btn) {
        btn.addEventListener('click', function () {
            banner.style.display = "none";
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }
}

/* ===============================
   NOTIFICAÇÕES PUSH
=============================== */

// Solicitar permissão
function requestNotificationPermission() {
    if (!("Notification" in window)) {
        console.log("Navegador não suporta notificações.");
        return;
    }

    Notification.requestPermission().then(permission => {
        console.log("Permissão:", permission);
    });
}

// Gerar um "token fake" apenas para protótipo
function registerUserToken() {
    const token = localStorage.getItem("pushToken");

    if (!token) {
        const newToken = "token_" + Math.random().toString(36).substring(2);
        localStorage.setItem("pushToken", newToken);
        console.log("Token gerado:", newToken);
    } else {
        console.log("Token existente:", token);
    }
}

/* ===============================
   PWA – SERVICE WORKER
=============================== */

function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js")
            .then(reg => console.log("Service Worker registrado!", reg))
            .catch(err => console.error("Erro ao registrar SW:", err));
    }
}

/* ===============================
   INICIALIZAÇÃO GERAL
=============================== */

window.addEventListener("load", () => {
    registerServiceWorker();
    requestNotificationPermission();
    registerUserToken();
    showCookieBanner();
});
