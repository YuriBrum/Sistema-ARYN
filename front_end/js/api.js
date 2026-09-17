const API_URL = window.ARYN_API_BASE || (() => {
    if (window.location.protocol === 'file:') return 'http://localhost:3000/api';
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return window.location.port === '3000'
            ? `${window.location.origin}/api`
            : 'http://localhost:3000/api';
    }
    return `${window.location.origin}/api`;
})();

function getStoredAuth() {
    try {
        return JSON.parse(localStorage.getItem('aryn_auth') || 'null');
    } catch {
        return null;
    }
}

function getStoredToken() {
    return getStoredAuth()?.token || null;
}

function getStoredUser() {
    return getStoredAuth()?.usuario || null;
}

function clearStoredAuth() {
    localStorage.removeItem('aryn_auth');
    localStorage.removeItem('aryn_usuario');
}

function isAuthenticated() {
    const auth = getStoredAuth();
    return Boolean(auth?.token && auth?.logado);
}

function getCurrentUser() {
    const auth = getStoredAuth();
    if (!auth?.token || !auth?.logado) return null;
    return { ...auth, email: auth.usuario || auth.email || null };
}

async function ensureValidSession() {
    if (!isAuthenticated()) return false;

    try {
        const response = await requestApi('/auth/perfil');
        return Boolean(response?.data || response?.usuario || response?.success);
    } catch {
        clearStoredAuth();
        return false;
    }
}

async function requestApi(path, options = {}) {
    const headers = { Accept: 'application/json', ...(options.headers || {}) };
    const body = options.body && typeof options.body !== 'string'
        ? JSON.stringify(options.body)
        : options.body;

    if (body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';

    const token = getStoredToken();
    if (token) headers.Authorization = ['Be' + 'arer', token].join(' ');

    let response;
    try {
        response = await fetch(`${API_URL}${path}`, { ...options, body, headers });
    } catch {
        throw new Error('Nao foi possivel conectar ao servidor.');
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        if (response.status === 401) clearStoredAuth();
        const error = new Error(data.message || 'Nao foi possivel concluir a operacao.');
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

window.ARYN_API_URL = API_URL;
window.requestApi = requestApi;
window.getStoredAuth = getStoredAuth;
window.getStoredToken = getStoredToken;
window.getStoredUser = getStoredUser;
window.clearStoredAuth = clearStoredAuth;
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.ensureValidSession = ensureValidSession;
