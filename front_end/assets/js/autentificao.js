const AUTH_KEY = 'aryn_auth';
const USER_KEY = 'aryn_usuario';
const ARYN_API_BASE = window.ARYN_API_BASE || (() => {
    if (window.location.protocol === 'file:') return 'http://localhost:3000/api';
    const usandoServidorDoBackend = window.location.port === '3000';
    const usandoServidorLocalSeparado = ['localhost', '127.0.0.1'].includes(window.location.hostname) && !usandoServidorDoBackend;
    return usandoServidorLocalSeparado ? 'http://localhost:3000/api' : `${window.location.origin}/api`;
})();

async function apiRequest(path, options = {}) {
    if (typeof window.requestApi === 'function') {
        return window.requestApi(path, options);
    }

    const auth = getAuth();
    const headers = { ...(options.headers || {}) };

    if (options.body && typeof options.body !== 'string') {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(options.body);
    }

    if (auth && auth.token) {
        headers.Authorization = ['Be' + 'arer', auth.token].join(' ');
    }

    const response = await fetch(`${ARYN_API_BASE}${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || data.mensagem || 'Falha na comunicacao com a API.');
    }

    return data;
}

function getAuth() {
    try {
        const raw = localStorage.getItem(AUTH_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function isLoggedIn() {
    const auth = getAuth();
    return Boolean(auth && auth.logado === true && auth.usuario);
}

function getUsuarioLogado() {
    const auth = getAuth();
    return auth ? auth.usuario : null;
}

function getCurrentUser() {
    const auth = getAuth();
    if (!auth || !auth.logado || !auth.token) return null;
    return {
        email: auth.usuario || auth.email || null,
        token: auth.token,
        id_usuario: auth.id_usuario || null,
        id_cliente: auth.id_cliente || null,
        tipo: auth.tipo || 'CLIENTE'
    };
}

function login(usuario, token = null, dados = {}) {
    const perfil = typeof usuario === 'string' ? { email: usuario } : usuario;
    const auth = {
        usuario: perfil.email,
        id_usuario: dados.id_usuario || perfil.id_usuario || null,
        id_cliente: dados.id_cliente || perfil.id_cliente || null,
        token,
        logado: true,
        loginAt: Date.now(),
        tipo: dados.tipo || perfil.tipo || 'CLIENTE'
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    localStorage.setItem(USER_KEY, perfil.email);
    if (typeof migrarCarrinhoVisitanteParaUsuario === 'function') {
        migrarCarrinhoVisitanteParaUsuario(perfil.email);
    }
}

function logout() {
    localStorage.removeItem(AUTH_KEY);
    if (localStorage.getItem('aryn_lembrar') !== '1') {
        localStorage.removeItem(USER_KEY);
    }
}

async function checkAuth({ redirectOnInvalid = false, redirectTo = '../../index.html', loginPage = 'login.html' } = {}) {
    const auth = getAuth();
    const token = auth && auth.token;

    if (!token) {
        if (redirectOnInvalid) {
            window.location.assign(loginPage);
        }
        return false;
    }

    try {
        const response = await window.requestApi('/auth/perfil');
        const user = response?.data || response?.usuario || null;
        if (!user) {
            throw new Error('Perfil nao encontrado.');
        }

        const nextAuth = {
            ...auth,
            usuario: user.email || auth.usuario,
            nome: user.nome || auth.nome || '',
            id_usuario: user.id_usuario || auth.id_usuario || null,
            id_cliente: user.id_cliente || auth.id_cliente || null,
            tipo: user.tipo || auth.tipo || 'CLIENTE',
            logado: true
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(nextAuth));
        return nextAuth;
    } catch (error) {
        logout();
        if (redirectOnInvalid) {
            window.location.assign(loginPage);
        }
        return false;
    }
}

function updateAccountLink({
    linkId = 'accountLink',
    loginHref = 'front_end/modelos/login.html',
    accountHref = 'front_end/modelos/conta.html',
    adminHref = 'front_end/admin/dashboard.html'
} = {}) {
    const link = document.getElementById(linkId);
    if (!link) return false;

    const auth = getAuth();
    if (auth && auth.token && auth.logado) {
        link.textContent = auth.tipo === 'ADMIN' ? 'Painel administrativo' : 'Minha conta';
        link.href = auth.tipo === 'ADMIN' ? adminHref : accountHref;
        link.setAttribute('aria-label', auth.tipo === 'ADMIN' ? 'Abrir painel administrativo' : 'Abrir minha conta');
        return true;
    }

    link.textContent = 'Entrar';
    link.href = loginHref;
    link.setAttribute('aria-label', 'Entrar na conta');
    return false;
}

function bloquearSeLogado() {
    if (isLoggedIn()) {
        window.location.href = '../../index.html';
        return true;
    }
    return false;
}

window.AUTH_KEY = AUTH_KEY;
window.USER_KEY = USER_KEY;
window.getAuth = getAuth;
window.isLoggedIn = isLoggedIn;
window.getUsuarioLogado = getUsuarioLogado;
window.getCurrentUser = getCurrentUser;
window.login = login;
window.logout = logout;
window.checkAuth = checkAuth;
window.updateAccountLink = updateAccountLink;
window.bloquearSeLogado = bloquearSeLogado;
window.apiRequest = apiRequest;
